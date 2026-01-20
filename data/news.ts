import "server-only";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { and, count, desc, eq, like, or } from "drizzle-orm";

/** 1ページあたりの表示件数 */
export const NEWS_PER_PAGE = 10;

/** IDで記事を取得 */
export async function getNewsById(id: string) {
  const news = await db
    .select()
    .from(newsItems)
    .where(eq(newsItems.id, id))
    .limit(1);

  return news[0] ?? null;
}

/** ページネーション付きでニュースを取得 */
export async function getPaginatedNews(page: number) {
  const offset = (page - 1) * NEWS_PER_PAGE;
  return db
    .select()
    .from(newsItems)
    .where(eq(newsItems.hasValidLaws, true))
    .orderBy(desc(newsItems.publishedAt))
    .limit(NEWS_PER_PAGE)
    .offset(offset);
}

/** ニュースの総件数を取得 */
export async function getNewsCount() {
  const result = await db
    .select({ count: count() })
    .from(newsItems)
    .where(eq(newsItems.hasValidLaws, true));
  return result[0]?.count ?? 0;
}

/** ページネーション付きで検索 */
export async function searchNewsPaginated(name: string, page: number) {
  const pattern = `%${name}%`;
  const offset = (page - 1) * NEWS_PER_PAGE;
  return db
    .select()
    .from(newsItems)
    .where(
      and(
        eq(newsItems.hasValidLaws, true),
        or(
          like(newsItems.title, pattern),
          like(newsItems.description, pattern),
          like(newsItems.lawRelevanceNotes, pattern)
        )
      )
    )
    .orderBy(desc(newsItems.publishedAt))
    .limit(NEWS_PER_PAGE)
    .offset(offset);
}

/** 検索結果の総件数を取得 */
export async function searchNewsCount(name: string) {
  const pattern = `%${name}%`;
  const result = await db
    .select({ count: count() })
    .from(newsItems)
    .where(
      and(
        eq(newsItems.hasValidLaws, true),
        or(
          like(newsItems.title, pattern),
          like(newsItems.description, pattern),
          like(newsItems.lawRelevanceNotes, pattern)
        )
      )
    );
  return result[0]?.count ?? 0;
}
