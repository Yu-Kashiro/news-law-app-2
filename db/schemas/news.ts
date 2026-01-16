import { RelatedArticle, RelatedLaw } from "@/types/laws";
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const newsItems = sqliteTable("news_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  articleId: text("article_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  ogImage: text("og_image"),
  laws: text("laws", { mode: "json" }).$type<string[]>(),
  relatedLaws: text("related_laws", { mode: "json" }).$type<RelatedLaw[]>(),
  lawColumnTitle: text("law_column_title"),
  lawColumn: text("law_column"),
  keywords: text("keywords", { mode: "json" }).$type<string[]>(),
  relatedArticles: text("related_articles", { mode: "json" }).$type<
    RelatedArticle[]
  >(),
  hasValidLaws: integer("has_valid_laws", { mode: "boolean" }),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
