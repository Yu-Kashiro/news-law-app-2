import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

/** 法令の良い点・改善点の型 */
export interface LawPoint {
  title: string;
  description: string;
}

export const laws = sqliteTable("laws", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),

  // e-Gov から取得
  eGovLawId: text("egov_law_id"),
  lawNum: text("law_num"),
  promulgationDate: text("promulgation_date"),
  officialUrl: text("official_url"),

  // AI 生成コンテンツ
  summary: text("summary").notNull(),
  background: text("background"),
  pros: text("pros", { mode: "json" }).$type<LawPoint[]>(),
  cons: text("cons", { mode: "json" }).$type<LawPoint[]>(),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
