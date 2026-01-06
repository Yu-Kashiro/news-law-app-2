import "server-only";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { desc, eq } from "drizzle-orm";

/** 全ニュースを取得し、TopNews用とGridNews用に分割して返す */
export async function getAllNews() {
  const news = await db
    .select()
    .from(newsItems)
    .orderBy(desc(newsItems.publishedAt));

  return {
    topNews: news[0] ?? null,
    gridNews: news.slice(1),
  };
}

/** IDで記事を取得 */
export async function getNewsById(id: string) {
  const news = await db
    .select()
    .from(newsItems)
    .where(eq(newsItems.id, id))
    .limit(1);

  return news[0] ?? null;
}
