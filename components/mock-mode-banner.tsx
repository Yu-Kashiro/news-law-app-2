import { cookies } from "next/headers";
import { MOCK_MODE_COOKIE } from "@/lib/mock/constants";

export async function MockModeBanner() {
  const cookieStore = await cookies();
  const isMockMode = cookieStore.get(MOCK_MODE_COOKIE)?.value === "true";

  if (!isMockMode) {
    return null;
  }

  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-800">
      Mock Mode: DBを使用せず、サンプルデータを表示しています
    </div>
  );
}
