/**
 * hasValidLaws フラグ更新スクリプト
 *
 * 使用方法:
 *   pnpm tsx scripts/update-has-valid-laws.ts
 *
 * 処理内容:
 *   - 各ニュースの laws 配列をチェック
 *   - DB に存在する法令が1件以上あれば hasValidLaws = true
 *   - なければ hasValidLaws = false
 */

import "dotenv/config";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { laws } from "@/db/schemas/laws";
import { eq } from "drizzle-orm";

async function updateHasValidLaws() {
  console.log("=== hasValidLaws 更新スクリプト ===\n");

  // 全ニュースを取得
  const allNews = await db.select().from(newsItems);
  console.log(`ニュース件数: ${allNews.length}件\n`);

  // 全法令名を取得
  const allLaws = await db.select({ name: laws.name }).from(laws);
  const lawNamesSet = new Set(allLaws.map((l) => l.name));
  console.log(`DB内の法令数: ${lawNamesSet.size}件\n`);

  let updatedTrue = 0;
  let updatedFalse = 0;

  for (const news of allNews) {
    const newsLaws = news.aiEstimatedLaws ?? [];

    // ニュースの法令名のうち、DBに存在するものがあるか確認
    const hasValidLaws = newsLaws.some((lawName) => lawNamesSet.has(lawName));

    await db
      .update(newsItems)
      .set({ hasValidLaws })
      .where(eq(newsItems.id, news.id));

    if (hasValidLaws) {
      updatedTrue++;
    } else {
      updatedFalse++;
    }
  }

  console.log("更新結果:");
  console.log(`  - hasValidLaws = true: ${updatedTrue}件`);
  console.log(`  - hasValidLaws = false: ${updatedFalse}件`);
  console.log("\n=== 更新完了 ===");
}

updateHasValidLaws().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
