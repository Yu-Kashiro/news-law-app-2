import type { news } from "@/db/schemas/news";

/** newsテーブルから取得したレコードの型 */
export type News = typeof news.$inferSelect;
