import type { newsItems } from "@/db/schemas/news";

/** news_itemsテーブルから取得したレコードの型 */
export type NewsItem = typeof newsItems.$inferSelect;
