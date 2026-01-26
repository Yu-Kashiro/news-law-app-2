"use client";

import { useSyncExternalStore, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MOCK_MODE_COOKIE } from "@/lib/mock/constants";

function getCookieValue(name: string): boolean {
  if (typeof document === "undefined") return true;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  // Cookie未設定の場合はデフォルトでモックモード
  return match?.[2] !== "false";
}

function subscribe(callback: () => void) {
  // useSyncExternalStoreに必要だが、Cookieの変更は監視しない
  void callback;
  return () => {};
}

function getSnapshot(): boolean {
  return getCookieValue(MOCK_MODE_COOKIE);
}

function getServerSnapshot(): boolean {
  return false;
}

export function MockModeToggle() {
  const [isPending, setIsPending] = useState(false);
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  async function handleToggle(checked: boolean) {
    setIsPending(true);
    await fetch("/api/mock-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: checked }),
    });

    window.location.href = "/";
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="mock-mode"
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label
        htmlFor="mock-mode"
        className="cursor-pointer text-xs text-muted-foreground"
      >
        Mock Mode
      </Label>
    </div>
  );
}
