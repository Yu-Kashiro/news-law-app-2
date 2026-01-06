import "server-only";
import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";

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

const lawsResponseSchema = z.object({
  laws: z
    .array(z.string())
    .describe("ニュース記事に関連する日本の法令名のリスト（正式名称）"),
  lawColumnTitle: z
    .string()
    .describe("引きのある簡潔なタイトル（20文字以内）"),
  lawColumn: z
    .string()
    .describe("法律コラム本文（300〜500文字、3〜5段落）"),
});

export type LawsResponse = z.infer<typeof lawsResponseSchema>;

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
    prompt: `以下のニュース記事について、関連する法令名のリスト、法律コラムのタイトル、法律コラムを作成してください。

【ニュースタイトル】
${title}

【ニュース概要】
${description}`,
  });

  if (!output) {
    throw new Error("Failed to generate laws response");
  }

  return output;
}
