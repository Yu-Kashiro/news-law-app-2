import "server-only";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { and, desc, eq, like, or } from "drizzle-orm";

/** 全ニュースを取得（法令が存在するニュースのみ） */
export async function getAllNews() {
  return db
    .select()
    .from(newsItems)
    .where(eq(newsItems.hasValidLaws, true))
    .orderBy(desc(newsItems.publishedAt));
}

export async function searchNews(name: string) {
  const pattern = `%${name}%`;
  console.log("searchNews called with:", name, "pattern:", pattern);
  const result = await db.query.newsItems.findMany({
    where: and(
      eq(newsItems.hasValidLaws, true),
      or(
        like(newsItems.title, pattern),
        like(newsItems.description, pattern)
      )
    ),
    orderBy: [desc(newsItems.publishedAt)],
  });
  console.log("searchNews result count:", result.length);
  return result;
}

/** 全ニュースを、TopNews用とGridNews用に分割して返す */
export async function getNewsForHomePage() {
  const news = await getAllNews();

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
