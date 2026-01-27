import "server-only";
import { cookies } from "next/headers";
import { MOCK_MODE_COOKIE } from "./constants";

export async function isMockMode(): Promise<boolean> {
  const cookieStore = await cookies();
  // Cookie未設定の場合はデフォルトでモックモード無効
  return cookieStore.get(MOCK_MODE_COOKIE)?.value === "true";
}
