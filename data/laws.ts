import "server-only";
import { db } from "@/db";
import { laws } from "@/db/schemas/laws";
import { eq, inArray } from "drizzle-orm";
import type { LawInsert } from "@/types/laws";
import { isMockMode } from "@/lib/mock/utils";
import {
  getMockLawById,
  getMockLawByName,
  getMockLawsByNames,
} from "@/lib/mock/queries";

/** IDで法令を取得 */
export async function getLawById(id: string) {
  if (await isMockMode()) {
    return getMockLawById(id);
  }

  const law = await db
    .select()
    .from(laws)
    .where(eq(laws.id, id))
    .limit(1);

  return law[0] ?? null;
}

/** 法令名で法令を取得 */
export async function getLawByName(name: string) {
  if (await isMockMode()) {
    return getMockLawByName(name);
  }

  const law = await db
    .select()
    .from(laws)
    .where(eq(laws.name, name))
    .limit(1);

  return law[0] ?? null;
}

/** 複数の法令名で法令を取得 */
export async function getLawsByNames(names: string[]) {
  if (await isMockMode()) {
    return getMockLawsByNames(names);
  }

  if (names.length === 0) return [];

  return await db
    .select()
    .from(laws)
    .where(inArray(laws.name, names));
}

/** 法令を作成 */
export async function createLaw(data: LawInsert) {
  const result = await db.insert(laws).values(data).returning();
  return result[0];
}
