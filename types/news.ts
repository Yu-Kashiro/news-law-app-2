import type { newsItems } from "@/db/schemas/news";

/** news_itemsテーブルから取得したレコードの型 */
export type NewsItem = typeof newsItems.$inferSelect;

/** RSSフィードから取得したアイテムの型 */
export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}
