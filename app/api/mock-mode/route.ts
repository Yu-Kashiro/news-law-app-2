import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MOCK_MODE_COOKIE } from "@/lib/mock/constants";

export async function GET() {
  const cookieStore = await cookies();
  // Cookie未設定の場合はデフォルトでモックモード無効
  const isMockMode = cookieStore.get(MOCK_MODE_COOKIE)?.value === "true";
  return NextResponse.json({ enabled: isMockMode });
}

export async function POST(request: Request) {
  const { enabled } = await request.json();
  const cookieStore = await cookies();

  cookieStore.set(MOCK_MODE_COOKIE, enabled ? "true" : "false", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  return NextResponse.json({ enabled });
}
