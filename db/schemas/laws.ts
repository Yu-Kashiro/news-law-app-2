import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const laws = sqliteTable("laws", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull().unique(),

  // e-Gov から取得
  eGovLawId: text("egov_law_id"),
  lawNum: text("law_num"),
  promulgationDate: text("promulgation_date"),
  officialUrl: text("official_url"),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
