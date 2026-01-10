import "server-only";
import { db } from "@/db";
import { laws } from "@/db/schemas/laws";
import { eq, inArray } from "drizzle-orm";
import type { LawInsert } from "@/types/laws";

/** IDで法令を取得 */
export async function getLawById(id: string) {
  const law = await db
    .select()
    .from(laws)
    .where(eq(laws.id, id))
    .limit(1);

  return law[0] ?? null;
}

/** 法令名で法令を取得 */
export async function getLawByName(name: string) {
  const law = await db
    .select()
    .from(laws)
    .where(eq(laws.name, name))
    .limit(1);

  return law[0] ?? null;
}

/** 複数の法令名で法令を取得 */
export async function getLawsByNames(names: string[]) {
  if (names.length === 0) return [];

  return await db
    .select()
    .from(laws)
    .where(inArray(laws.name, names));
}

/** 全法令を取得 */
export async function getAllLaws() {
  return await db.select().from(laws);
}

/** 法令を作成 */
export async function createLaw(data: LawInsert) {
  const result = await db.insert(laws).values(data).returning();
  return result[0];
}

/** 法令を更新 */
export async function updateLaw(id: string, data: Partial<LawInsert>) {
  const result = await db
    .update(laws)
    .set(data)
    .where(eq(laws.id, id))
    .returning();
  return result[0] ?? null;
}
