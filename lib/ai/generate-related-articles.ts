import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";
import { getLawContent } from "@/lib/law-tools/laws-api-client";
import { getArticleByNumAndLawId, createArticle } from "@/data/law-articles";
import type { RelatedArticle } from "@/types/laws";

/** 漢数字をアラビア数字に変換 */
function kanjiToArabic(str: string): string {
  const kanjiNums: Record<string, number> = {
    零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4,
    五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
  };
  const kanjiUnits: Record<string, number> = {
    十: 10, 百: 100, 千: 1000, 万: 10000,
  };

  // 全角数字を半角に変換
  const result = str.replace(/[０-９]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0)
  );

  // 既にアラビア数字のみの場合はそのまま返す
  if (/^[0-9]+$/.test(result)) {
    return result;
  }

  // 漢数字を変換
  const parseKanjiNumber = (s: string): number => {
    let total = 0;
    let current = 0;
    let temp = 0;

    for (const char of s) {
      if (char in kanjiNums) {
        temp = kanjiNums[char];
      } else if (char in kanjiUnits) {
        const unit = kanjiUnits[char];
        if (temp === 0) temp = 1;
        if (unit >= 10000) {
          current = (current + temp) * unit;
          temp = 0;
        } else {
          current += temp * unit;
          temp = 0;
        }
      }
    }
    total = current + temp;
    return total;
  };

  // 「の」で分割して各部分を変換（例: 七十一の四の二 → 71の4の2）
  const parts = result.split("の");
  const convertedParts = parts.map((part) => {
    if (/^[0-9]+$/.test(part)) return part;
    if (/^[一二三四五六七八九十百千万零〇]+$/.test(part)) {
      return String(parseKanjiNumber(part));
    }
    return part;
  });

  return convertedParts.join("の");
}

/** AIによる関連条文選択のスキーマ */
const selectArticlesSchema = z.object({
  selectedArticles: z
    .array(
      z.object({
        articleNum: z.string().describe("条文番号（例: 第108条）"),
        relevanceNote: z
          .string()
          .describe("この条文がニュースにどう関係するかの解説（100〜200文字）"),
      })
    )
    .describe("ニュースに関連する条文（最大3件）"),
});

/** ニュースに関連する条文を法令から選択・保存 */
export async function findAndSaveRelatedArticles(params: {
  newsTitle: string;
  newsDescription: string;
  keywords: string[];
  lawId: string;
  lawName: string;
  eGovLawId?: string;
}): Promise<RelatedArticle[]> {
  const { newsTitle, newsDescription, lawId, lawName, eGovLawId } = params;

  // e-Gov法令IDがない場合はスキップ
  if (!eGovLawId) {
    return [];
  }

  // 法令の全条文を取得
  const lawContent = await getLawContent({
    lawId: eGovLawId,
    extractArticles: true,
  });

  if (lawContent.error || !lawContent.articles || lawContent.articles.length === 0) {
    return [];
  }

  // 条文が多すぎる場合は先頭200件に制限（APIコスト削減）
  const articles = lawContent.articles.slice(0, 200);

  // 条文リストを作成（AIに渡す用）
  const articleList = articles
    .map((a) => `【第${a.article_num}条】${a.article_text.slice(0, 300)}`)
    .join("\n\n");

  // AIで関連条文を選択
  const { output } = await generateText({
    model: gateway("google/gemini-2.5-flash-lite"),
    output: Output.object({
      schema: selectArticlesSchema,
    }),
    system: `あなたは法律の専門家です。ニュース記事に最も関連する条文を選択し、その関連性を一般読者向けにわかりやすく解説してください。

## 選択の基準
1. ニュースの内容に直接関係する条文を優先
2. 罰則規定がある場合はそれも含める
3. 定義規定が関連する場合は含める
4. 最大3件まで選択

## 解説の方針
1. なぜこの条文がニュースに関係するのかを明確に説明
2. この条文が適用されるとどうなるか（罰則、義務など）を説明
3. 専門用語は避け、平易な言葉で説明`,
    prompt: `以下のニュース記事に関連する条文を「${lawName}」から選択してください。

【ニュースタイトル】
${newsTitle}

【ニュース概要】
${newsDescription}

【${lawName}の条文一覧】
${articleList}

関連する条文がない場合は空の配列を返してください。`,
  });

  if (!output || output.selectedArticles.length === 0) {
    return [];
  }

  const relatedArticles: RelatedArticle[] = [];

  for (const selected of output.selectedArticles) {
    // 条文番号から「第」と「条」を除去して数字部分を取得
    const articleNumMatch = selected.articleNum.match(/第?([0-9０-９一二三四五六七八九十百千万]+(?:の[0-9０-９一二三四五六七八九十百千万]+)*)条?/);
    if (!articleNumMatch) continue;

    // 漢数字・全角数字をアラビア数字に変換
    const normalizedNum = kanjiToArabic(articleNumMatch[1]);

    // 該当する条文を探す
    const article = articles.find((a) => a.article_num === normalizedNum);
    if (!article) continue;

    // 条文をDBに保存（既存チェック）
    const articleNumForDb = `第${normalizedNum}条`;
    const existingArticle = await getArticleByNumAndLawId(articleNumForDb, lawId);

    let articleId: string;

    if (existingArticle) {
      articleId = existingArticle.id;
    } else {
      const newArticle = await createArticle({
        lawId,
        articleNum: articleNumForDb,
        articleText: article.article_text,
      });
      articleId = newArticle.id;
    }

    relatedArticles.push({
      lawId,
      articleId,
      relevanceNote: selected.relevanceNote,
    });
  }

  return relatedArticles;
}
