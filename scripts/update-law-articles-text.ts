/**
 * law_articles の条文テキスト更新スクリプト
 *
 * 使用方法:
 *   pnpm tsx scripts/update-law-articles-text.ts
 *
 * 処理内容:
 *   - 各 law_article の法令IDを取得
 *   - e-Gov API から法令データを再取得
 *   - 改行付きの条文テキストで更新
 */

import "dotenv/config";
import { db } from "@/db";
import { lawArticles } from "@/db/schemas/law-articles";
import { laws } from "@/db/schemas/laws";
import { eq } from "drizzle-orm";
import { getLawContent } from "@/lib/law-tools/laws-api-client";

async function updateLawArticlesText() {
  console.log("=== law_articles 条文テキスト更新スクリプト ===\n");

  // 全条文を取得
  const allArticles = await db.select().from(lawArticles);
  console.log(`条文件数: ${allArticles.length}件\n`);

  // 法令IDでグループ化
  const articlesByLawId = new Map<string, typeof allArticles>();
  for (const article of allArticles) {
    const existing = articlesByLawId.get(article.lawId) ?? [];
    existing.push(article);
    articlesByLawId.set(article.lawId, existing);
  }

  console.log(`関連する法令数: ${articlesByLawId.size}件\n`);

  let updatedCount = 0;
  let errorCount = 0;

  // 法令ごとに処理
  for (const [lawId, articles] of articlesByLawId) {
    // laws テーブルから e-Gov 法令IDを取得
    const law = await db
      .select({ eGovLawId: laws.eGovLawId, name: laws.name })
      .from(laws)
      .where(eq(laws.id, lawId))
      .limit(1);

    if (!law[0]?.eGovLawId) {
      console.log(`[スキップ] 法令ID ${lawId}: e-Gov法令IDなし`);
      continue;
    }

    const { eGovLawId, name } = law[0];
    console.log(`[処理中] ${name} (${eGovLawId})`);

    // e-Gov API から法令データを取得
    const lawContent = await getLawContent({ lawId: eGovLawId });

    if (lawContent.error || !lawContent.articles) {
      console.log(`  [エラー] API取得失敗: ${lawContent.error}`);
      errorCount += articles.length;
      continue;
    }

    // 条文番号でマッチングして更新
    for (const article of articles) {
      // articleNum から条番号を抽出（例: "第2条" → "2"）
      const numMatch = article.articleNum.match(/第(\d+)条/);
      const articleNumKey = numMatch ? numMatch[1] : article.articleNum;

      // API結果から該当条文を検索
      const apiArticle = lawContent.articles.find((a) => {
        return a.article_num === articleNumKey;
      });

      if (apiArticle) {
        // 更新
        await db
          .update(lawArticles)
          .set({ articleText: apiArticle.article_text.trim() })
          .where(eq(lawArticles.id, article.id));
        updatedCount++;
        console.log(`  [更新] ${article.articleNum}`);
      } else {
        console.log(`  [見つからず] ${article.articleNum} (検索キー: ${articleNumKey})`);
        errorCount++;
      }
    }

    // API制限を考慮して少し待機
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n更新結果:");
  console.log(`  - 更新成功: ${updatedCount}件`);
  console.log(`  - エラー/スキップ: ${errorCount}件`);
  console.log("\n=== 更新完了 ===");
}

updateLawArticlesText().catch((error) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
