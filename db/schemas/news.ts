import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const newsItems = sqliteTable("news_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  articleId: text("article_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  ogImage: text("og_image"),
  laws: text("laws", { mode: "json" }).$type<string[]>(),
  keywords: text("keywords", { mode: "json" }).$type<string[]>(),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
