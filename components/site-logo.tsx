'use client'

import Link from 'next/link'

interface SiteLogoIconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function SiteLogoIcon({ size = 'md', className }: SiteLogoIconProps) {
  const scales = {
    xs: 0.8,
    sm: 1,
    md: 1.3,
    lg: 1.6,
  }
  const scale = scales[size]

  return (
    <Link href="/" className={className ?? "inline-block"}>
      <svg
        width="36"
        height="36"
        viewBox="0 -5 24 24"
        fill="none"
        style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
      >
        {/* 土台 */}
        <rect x="1" y="19" width="22" height="3" rx="0.5" fill="#C56A1F" />
        {/* 左翼 */}
        <rect x="2" y="10" width="7" height="9" rx="0.5" fill="#E07B2E" />
        {/* 右翼 */}
        <rect x="15" y="10" width="7" height="9" rx="0.5" fill="#E07B2E" />
        {/* 中央部分 */}
        <rect x="9" y="12" width="6" height="7" rx="0.5" fill="#F5A623" />
        {/* 中央塔本体 */}
        <rect x="9" y="6" width="6" height="6" rx="0.5" fill="#E07B2E" />
        {/* 中央塔の三角屋根 */}
        <path d="M12 1 L8 6 L16 6 Z" fill="#C56A1F" />
        {/* 窓 */}
        <rect x="3.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="3.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="6" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="6" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="16" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="16" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="18.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="18.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
        <rect x="10.5" y="14" width="3" height="3" rx="0.3" fill="#FEF3C7" />
        <rect x="10.5" y="7.5" width="3" height="3" rx="0.3" fill="#FEF3C7" />
      </svg>
    </Link>
  )
}

export function SiteLogoText({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg', className?: string }) {
  const scales = {
    xs: 0.7,
    sm: 1,
    md: 1.3,
    lg: 1.6,
  }
  const scale = scales[size]

  return (
    <Link href="/" className={className ?? "inline-block"}>
      <span
        className="text-2xl font-black"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center', display: 'inline-block' }}
      >
        <span className="text-[#C56A1F]">ニュース</span>
        <span className="text-black">でまなぶ！</span>
      </span>
    </Link>
  )
}

export function SiteRibbon({ size = 'md', className }: { size?: 'xs' | 'sm' | 'md' | 'lg', className?: string }) {
  const scales = {
    xs: 0.7,
    sm: 1,
    md: 1.3,
    lg: 1.6,
  }
  const scale = scales[size]

  return (
    <Link href="/" className={className ?? "inline-block"}>
      <svg
        width="200"
        height="40"
        viewBox="0 0 160 32"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center', marginTop: -8 }}
      >
        {/* 左側の装飾ライン */}
        <line
          x1="0"
          y1="16"
          x2="22"
          y2="16"
          stroke="#C56A1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* 曲線のリボン背景 */}
        <path
          d="M25 8 Q80 -5 135 8 L130 24 Q80 35 30 24 Z"
          fill="#E07B2E"
        />
        {/* テキスト */}
        <text
          x="80"
          y="19"
          textAnchor="middle"
          className="fill-white text-[13px] font-bold"
          style={{ fontFamily: 'sans-serif' }}
        >
          日本のルール
        </text>
        {/* 右側の装飾ライン */}
        <line
          x1="138"
          y1="16"
          x2="160"
          y2="16"
          stroke="#C56A1F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  )
}

// 後方互換性のため
export function SiteLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = {
    sm: 1,
    md: 1.3,
    lg: 1.6,
  }
  const scale = scales[size]

  return (
    <Link href="/" className="inline-block">
      <div
        className="flex items-center gap-2"
        style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
      >
        <SiteLogoIcon size="sm" />
        <span className="text-2xl font-black">
          <span className="text-[#C56A1F]">ニュース</span>
          <span className="text-black">でまなぶ！</span>
        </span>
      </div>
    </Link>
  )
}
