import type { laws, LawPoint } from "@/db/schemas/laws";

/** lawsテーブルから取得したレコードの型 */
export type Law = typeof laws.$inferSelect;

/** 法令の良い点・改善点の型（再エクスポート） */
export type { LawPoint } from "@/db/schemas/laws";

/** 法令作成時の入力型 */
export type LawInsert = typeof laws.$inferInsert;

/** AI生成による法令詳細のレスポンス型 */
export interface LawDetailResponse {
  summary: string;
  background: string;
  pros: LawPoint[];
  cons: LawPoint[];
}

/** e-Gov APIから取得した法令基本情報 */
export interface EGovLawInfo {
  eGovLawId: string;
  lawNum: string;
  lawTitle: string;
  promulgationDate?: string;
  officialUrl: string;
}
