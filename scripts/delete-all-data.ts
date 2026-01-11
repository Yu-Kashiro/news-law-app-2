/**
 * 全データ削除スクリプト
 *
 * 使用方法:
 *   pnpm tsx scripts/delete-all-data.ts
 *
 * 削除対象:
 *   - news_items（ニュース）
 *   - law_articles（条文）
 *   - laws（法令）
 */

import "dotenv/config";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { lawArticles } from "@/db/schemas/law-articles";
import { laws } from "@/db/schemas/laws";
import { sql } from "drizzle-orm";

async function deleteAllData() {
  console.log("=== データ削除スクリプト ===\n");

  // 削除前のカウント
  const [newsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsItems);
  const [lawsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(laws);
  const [articlesCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(lawArticles);

  console.log("削除前のレコード数:");
  console.log(`  - news_items: ${newsCount.count}件`);
  console.log(`  - laws: ${lawsCount.count}件`);
  console.log(`  - law_articles: ${articlesCount.count}件`);
  console.log("");

  // 削除実行（外部キー制約の順序を考慮）
  console.log("削除中...");

  // 1. ニュースを削除
  await db.delete(newsItems);
  console.log("  ✓ news_items を削除しました");

  // 2. 条文を削除（lawsへの外部キーがあるため先に削除）
  await db.delete(lawArticles);
  console.log("  ✓ law_articles を削除しました");

  // 3. 法令を削除
  await db.delete(laws);
  console.log("  ✓ laws を削除しました");

  console.log("\n=== 削除完了 ===");
}

deleteAllData().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
