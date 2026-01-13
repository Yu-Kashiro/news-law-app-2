import "server-only";
import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";
import type { LawsResponse } from "@/types/news";
import type { Law, RelatedLaw } from "@/types/laws";
import { getLawByName, getLawsByNames, createLaw } from "@/data/laws";
import { searchLawsByTitle } from "@/lib/law-tools/laws-api-client";
import { generateLawDetail } from "@/lib/ai/generate-law-detail";
import { findAndSaveRelatedArticles } from "@/lib/ai/generate-related-articles";
import type { RelatedArticle } from "@/types/laws";


const SYSTEM_PROMPT = `あなたは日本法令の専門家・法律ライターです。ニュース記事に関連する法律的なコラムを執筆してください。

## コラムの方針
1. ニュース記事の内容に関連する法律的な観点や背景を解説する
2. 一般読者が興味を持てるような、わかりやすく教育的な内容にする
3. 関連する法的概念や一般的な法律知識を提供する
4. 読者の法律リテラシー向上に貢献する内容にする
5. コラム内で言及する法令名は正式名称を使用する

## コラムの構成
- タイトル: 引きのある簡潔なタイトル（20文字以内）
- 本文: 3〜5段落程度（300〜500文字）
  - 第1段落: ニュースに関連する法的な論点や背景
  - 第2-4段落: 関連する法律知識や一般的な法的観点
  - 最終段落: まとめや読者への示唆

## 注意事項
- 具体的な法的助言は避け、一般的な解説に留める
- 専門用語を使う場合は括弧書きで補足する
- 読者の興味を引く、親しみやすい文体で書く
- 事実と解説を明確に区別する
- コラム内で法令名に言及する場合は、正式な法令名（例：「刑法」「民法」「労働基準法」など）を使用する`;

const relatedLawSchema = z.object({
  lawName: z.string().describe("法令の正式名称"),
  relevanceNote: z
    .string()
    .describe("このニュースとこの法令がなぜ関係するのか（50〜100文字）"),
});

const lawsResponseSchema = z.object({
  laws: z
    .array(z.string())
    .describe("ニュース記事に関連する日本の法令名のリスト（正式名称）"),
  relatedLaws: z
    .array(relatedLawSchema)
    .describe("各法令とニュースの関連性の説明"),
  lawColumnTitle: z
    .string()
    .describe("引きのある簡潔なタイトル（20文字以内）"),
  lawColumn: z
    .string()
    .describe("法律コラム本文（300〜500文字、3〜5段落）"),
});

/** ニュースから法令名・コラムを生成 */
export async function generateLawsForNews(
  title: string,
  description: string
): Promise<LawsResponse> {
  const { output } = await generateText({
    model: gateway("google/gemini-2.5-flash-lite"),
    output: Output.object({
      schema: lawsResponseSchema,
    }),
    system: SYSTEM_PROMPT,
    prompt: `以下のニュース記事について、関連する法令名のリスト、各法令との関連性の説明、法律コラムのタイトル、法律コラムを作成してください。

【ニュースタイトル】
${title}

【ニュース概要】
${description}

【出力形式】
- laws: 関連する法令名（正式名称）のリスト
- relatedLaws: 各法令について、lawName（法令名）とrelevanceNote（なぜこのニュースと関係するのか50〜100文字で説明）のオブジェクト配列
- lawColumnTitle: コラムタイトル
- lawColumn: コラム本文`,
  });

  if (!output) {
    throw new Error("Failed to generate laws response");
  }

  return output;
}

/** 法令名から法令詳細を事前生成してDBに保存し、関連条文も取得 */
export async function ensureLawsExist(
  lawNames: string[],
  newsContext?: { title: string; description: string; keywords: string[] }
): Promise<{ laws: Law[]; relatedArticles: RelatedArticle[] }> {
  if (lawNames.length === 0) return { laws: [], relatedArticles: [] };

  // 既存の法令を取得
  const existingLaws = await getLawsByNames(lawNames);
  const existingNames = new Set(existingLaws.map((law) => law.name));

  // 未登録の法令名を抽出
  const newLawNames = lawNames.filter((name) => !existingNames.has(name));

  // 新規法令を生成
  const newLaws: Law[] = [];
  for (const lawName of newLawNames) {
    try {
      const law = await generateAndSaveLaw(lawName);
      if (law) {
        newLaws.push(law);
      }
    } catch (error) {
      console.error(`Failed to generate law: ${lawName}`, error);
    }
  }

  const allLaws = [...existingLaws, ...newLaws];

  // 関連条文を取得（newsContextがある場合のみ）
  const relatedArticles: RelatedArticle[] = [];
  if (newsContext) {
    for (const law of allLaws) {
      try {
        const articles = await findAndSaveRelatedArticles({
          newsTitle: newsContext.title,
          newsDescription: newsContext.description,
          keywords: newsContext.keywords,
          lawId: law.id,
          lawName: law.name,
          eGovLawId: law.eGovLawId ?? undefined,
        });
        relatedArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to find related articles for: ${law.name}`, error);
      }
    }
  }

  return { laws: allLaws, relatedArticles };
}


/** 単一の法令を生成してDBに保存（e-Gov APIで見つかった場合のみ） */
async function generateAndSaveLaw(lawName: string): Promise<Law | null> {
  // e-Gov APIで法令情報を検索
  const searchResult = await searchLawsByTitle({
    titleKeywords: [lawName],
    limit: 1,
  });

  // e-Gov APIで見つからない場合はスキップ
  if (searchResult.has_error || searchResult.items.length === 0) {
    return null;
  }

  const item = searchResult.items[0];
  const officialName = item.law_title;

  // 正式名称がない場合はスキップ
  if (!officialName) {
    return null;
  }

  // 正式名称で既存チェック
  const existing = await getLawByName(officialName);
  if (existing) return existing;

  const eGovLawId = item.law_id;
  const lawNum = item.law_num;
  const promulgationDate = item.promulgation_date;
  const officialUrl = eGovLawId
    ? `https://elaws.e-gov.go.jp/document?lawid=${eGovLawId}`
    : undefined;

  // AI で解説を生成
  const detail = await generateLawDetail(officialName, lawNum);

  // DBに保存
  const law = await createLaw({
    name: officialName,
    eGovLawId,
    lawNum,
    promulgationDate,
    officialUrl,
    summary: detail.summary,
    background: detail.background,
    pros: detail.pros,
    cons: detail.cons,
  });

  return law;
}
