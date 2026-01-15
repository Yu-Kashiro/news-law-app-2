import { type SVGProps } from 'react'

interface DietBuildingIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export function DietBuildingIcon({
  size = 24,
  className,
  ...props
}: DietBuildingIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* 土台 */}
      <rect x="1" y="19" width="22" height="3" rx="0.5" fill="#4ADE80" />
      {/* 左翼 */}
      <rect x="2" y="10" width="7" height="9" rx="0.5" fill="#F472B6" />
      {/* 右翼 */}
      <rect x="15" y="10" width="7" height="9" rx="0.5" fill="#60A5FA" />
      {/* 中央部分 */}
      <rect x="9" y="12" width="6" height="7" rx="0.5" fill="#FBBF24" />
      {/* 中央塔本体 */}
      <rect x="9" y="6" width="6" height="6" rx="0.5" fill="#FB923C" />
      {/* 中央塔の三角屋根 */}
      <path d="M12 1 L8 6 L16 6 Z" fill="#F87171" />
      {/* 左翼の窓 */}
      <rect x="3.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="3.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="6" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="6" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      {/* 右翼の窓 */}
      <rect x="16" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="16" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="18.5" y="12" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      <rect x="18.5" y="15" width="2" height="2" rx="0.3" fill="#FEF3C7" />
      {/* 中央の窓 */}
      <rect x="10.5" y="14" width="3" height="3" rx="0.3" fill="#FEF3C7" />
      {/* 塔の窓 */}
      <rect x="10.5" y="7.5" width="3" height="3" rx="0.3" fill="#FEF3C7" />
    </svg>
  )
}
