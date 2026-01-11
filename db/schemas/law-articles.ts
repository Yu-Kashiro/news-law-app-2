import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { laws } from "./laws";

export const lawArticles = sqliteTable("law_articles", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  lawId: text("law_id")
    .notNull()
    .references(() => laws.id, { onDelete: "cascade" }),
  articleNum: text("article_num").notNull(),      // 例: "第七十一条の四の二第一項"
  articleTitle: text("article_title"),             // 条見出し（あれば）
  articleText: text("article_text").notNull(),     // 条文本文
  position: text("position"),                      // e-Gov APIのposition情報
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
