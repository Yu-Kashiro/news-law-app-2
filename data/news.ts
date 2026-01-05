import "server-only";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { desc } from "drizzle-orm";

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
