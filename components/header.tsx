'use client'

import { Menu, Search } from 'lucide-react'
import { SiteLogo, SiteLogoIcon, SiteLogoText, SiteRibbon } from '@/components/site-logo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <nav
        aria-label="Global"
        className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 p-4 lg:px-8 lg:py-6"
      >
        {/* 左側: ロゴアイコン */}
        <div className="flex-shrink-0">
          <SiteLogoIcon size="md" />
        </div>

        {/* 中央: テキストとリボン（absoluteで真ん中に配置） */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          <div className="pointer-events-auto flex flex-col items-center">
            <SiteLogoText size="sm" />
            <SiteRibbon size="sm" />
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
                placeholder="ニュースを検索..."
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert('検索機能は準備中です')
                  }
                }}
              />
            </div>
            <ThemeToggle />
          </div>

          {/* モバイル: テーマ切替とメニュー */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-border"
              >
                <div className="flex items-center justify-center">
                  <SiteLogo size="sm" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="ニュースや法令を検索..."
                      className="pl-9"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          alert('検索機能は準備中です')
                        }
                      }}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
