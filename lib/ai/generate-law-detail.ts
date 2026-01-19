import "server-only";
import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";
import type { LawDetailResponse } from "@/types/laws";

const lawPointSchema = z.object({
  title: z.string().describe("ポイントの見出し（10-20文字）"),
  description: z.string().describe("ポイントの解説（50-100文字）"),
});

const lawDetailSchema = z.object({
  summary: z
    .string()
    .describe("この法律を一言で説明（1-2文、50文字以内）"),
  background: z
    .string()
    .describe("なぜこの法律ができたのか（歴史的背景、きっかけとなった事件等を含む、200-400文字）"),
  pros: z
    .array(lawPointSchema)
    .min(3)
    .max(6)
    .describe("この法律の良いところ（3-6項目）"),
  cons: z
    .array(lawPointSchema)
    .min(3)
    .max(6)
    .describe("この法律の直した方が良いところ、課題（3-6項目）"),
}) satisfies z.ZodType<LawDetailResponse>;

const SYSTEM_PROMPT = `あなたは日本法令の専門家です。一般市民に向けて、法律をわかりやすく解説してください。

## 解説の方針
1. 法律の専門家ではない一般読者が理解できる言葉で説明する
2. 歴史的背景や制定のきっかけを具体的に説明する
3. 法律の良い点と課題を公平に評価する
4. 専門用語を使う場合は括弧書きで補足する
5. 具体例を交えて説明する

## 注意事項
- 事実に基づいた解説を行う
- 政治的に偏った見解を避ける
- 法律の改正履歴がある場合は最新の内容を反映する`;

export async function generateLawDetail(
  lawName: string,
  lawNum?: string,
  articlesSummary?: string
): Promise<LawDetailResponse> {
  const contextParts = [`【法令名】${lawName}`];

  if (lawNum) {
    contextParts.push(`【法令番号】${lawNum}`);
  }

  if (articlesSummary) {
    contextParts.push(`【条文の概要】\n${articlesSummary}`);
  }

  const { output } = await generateText({
    model: gateway("google/gemini-2.5-flash"),
    output: Output.object({
      schema: lawDetailSchema,
    }),
    system: SYSTEM_PROMPT,
    prompt: `以下の法令について、一般市民向けの解説を作成してください。

${contextParts.join("\n\n")}

解説には以下を含めてください：
1. この法律を一言で説明（summary）
2. なぜこの法律ができたのか（background）- 歴史的背景、きっかけとなった事件等
3. この法律の良いところ（pros）- 3-6項目
4. この法律の直した方が良いところ（cons）- 3-6項目`,
  });

  if (!output) {
    throw new Error("Failed to generate law detail");
  }

  return output;
}
