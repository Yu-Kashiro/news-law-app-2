import type { newsItems } from "@/db/schemas/news";

/** news_itemsテーブルから取得したレコードの型 */
export type NewsItem = typeof newsItems.$inferSelect;

/** AI生成による法令情報のレスポンス型（Drizzle Schemaから派生） */
export type LawsResponse = Required<
  Pick<NewsItem, "laws" | "relatedLaws" | "lawColumnTitle" | "lawColumn">
>;

/** RSSフィードから取得したアイテムの型 */
export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}
