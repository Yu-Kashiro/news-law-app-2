'use client'

import Link from 'next/link'
import { Menu, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="bg-background">
      <nav
        aria-label="Global"
        className="relative mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">News and Law</span>
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold uppercase tracking-widest text-foreground lg:text-2xl"
        >
          News & Law
        </Link>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-m-2.5 text-foreground">
                <span className="sr-only">Open main menu</span>
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full bg-background p-6 sm:max-w-sm sm:ring-1 sm:ring-border"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">News and Law</span>
                  <Logo className="h-8 w-auto" />
                </Link>
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
                <div className="flex justify-end">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-4">
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
      </nav>
    </header>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask
        id="mask0"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="90" cy="90" r="90" className="fill-foreground" />
        <path
          d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
          fill="url(#paint0)"
        />
        <rect
          x="115"
          y="54"
          width="12"
          height="72"
          fill="url(#paint1)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop className="[stop-color:var(--background)]" />
          <stop offset="1" className="[stop-color:var(--background)]" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop className="[stop-color:var(--background)]" />
          <stop offset="1" className="[stop-color:var(--background)]" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
