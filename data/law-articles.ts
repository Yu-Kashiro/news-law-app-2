import "server-only";
import { db } from "@/db";
import { lawArticles } from "@/db/schemas/law-articles";
import { eq, and } from "drizzle-orm";
import type { LawArticle, LawArticleInsert } from "@/types/laws";

/** 法令IDから条文一覧を取得 */
export async function getArticlesByLawId(lawId: string): Promise<LawArticle[]> {
  return db.query.lawArticles.findMany({
    where: eq(lawArticles.lawId, lawId),
  });
}

/** 条文番号と法令IDで条文を取得 */
export async function getArticleByNumAndLawId(
  articleNum: string,
  lawId: string
): Promise<LawArticle | undefined> {
  return db.query.lawArticles.findFirst({
    where: and(
      eq(lawArticles.articleNum, articleNum),
      eq(lawArticles.lawId, lawId)
    ),
  });
}

/** 条文を作成 */
export async function createArticle(
  data: Omit<LawArticleInsert, "id" | "createdAt" | "updatedAt">
): Promise<LawArticle> {
  const [article] = await db.insert(lawArticles).values(data).returning();
  return article;
}

/** 条文IDで条文を取得 */
export async function getArticleById(id: string): Promise<LawArticle | undefined> {
  return db.query.lawArticles.findFirst({
    where: eq(lawArticles.id, id),
  });
}
