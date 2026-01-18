"use client";

import { Search } from "lucide-react";
import {
  SiteLogoIcon,
  SiteLogoText,
  SiteRibbon,
} from "@/components/site-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { debounce, useQueryState } from "nuqs";

function DecorativeDots() {
  return (
    <>
      {/* 左上の緑 - 大 */}
      <div className="absolute left-[5%] top-2 size-3 rounded-full bg-[#a8e063] opacity-80" />
      {/* 左側の青 - 極小 */}
      <div className="absolute left-[12%] bottom-2 size-1 rounded-full bg-[#6b9bd1] opacity-60" />
      {/* 左中の黄色 - 小 */}
      <div className="absolute left-[22%] top-5 size-1.5 rounded-full bg-[#fdd663] opacity-70" />
      {/* 中央左のピンク - 中 */}
      <div className="absolute left-[25%] bottom-3 size-2.5 rounded-full bg-[#f28b82] opacity-75" />
      {/* 中央右の黄色 - 極小 */}
      <div className="absolute right-[40%] top-3 size-1 rounded-full bg-[#fdd663] opacity-65" />
      {/* 右側の緑 - 小 */}
      <div className="absolute right-[25%] bottom-4 size-1.5 rounded-full bg-[#81c995] opacity-70" />
      {/* 右側の青 - 中大 */}
      <div className="absolute right-[15%] top-2 size-2.5 rounded-full bg-[#7baaf7] opacity-75" />
      {/* 右端のピンク - 極小 */}
      <div className="absolute right-[5%] bottom-2 size-1 rounded-full bg-[#f28b82] opacity-60" />
    </>
  );
}

export function Header() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
  });
  const [, setPage] = useQueryState("page");
  return (
    <header className="relative sticky top-0 z-50 bg-background shadow-sm overflow-hidden">
      {/* 装飾ドット */}
      <DecorativeDots />
      <nav
        aria-label="Global"
        className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 p-4 lg:px-8 lg:py-6"
      >
        {/* 左側: ロゴアイコン */}
        <div className="shrink-0">
          <SiteLogoIcon size="xs" className="lg:hidden" />
          <SiteLogoIcon size="md" className="hidden lg:inline-block" />
        </div>

        {/* 中央: テキストとリボン（absoluteで真ん中に配置） */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto flex flex-col items-center">
            <SiteLogoText size="xs" className="lg:hidden" />
            <SiteLogoText size="sm" className="hidden lg:block" />
            <SiteRibbon size="xs" className="lg:hidden" />
            <SiteRibbon size="sm" className="hidden lg:block" />
          </div>
        </div>

        {/* 右側: 検索とメニュー */}
        <div className="flex items-center gap-2">
          {/* デスクトップ: 検索とテーマ切替 */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={name}
                onChange={(e) => {
                  setPage(null);
                  setName(e.target.value, {
                    limitUrlUpdates:
                      e.target.value === "" ? undefined : debounce(500),
                  });
                }}
                placeholder="ニュースを検索..."
                className="rounded-full pl-9"
              />
            </div>
          </div>

          {/* モバイル: 検索 */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <span className="sr-only">検索を開く</span>
                  <Search className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="bg-background p-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    value={name}
                    onChange={(e) => {
                      setPage(null);
                      setName(e.target.value, {
                        limitUrlUpdates:
                          e.target.value === "" ? undefined : debounce(500),
                      });
                    }}
                    placeholder="ニュースを検索..."
                    className="rounded-full pl-9"
                    autoFocus
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
