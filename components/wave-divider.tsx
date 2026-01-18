export function CurveDivider() {
  return (
    <div className="w-full overflow-hidden">
      {/* モバイル: 直線 */}
      <svg
        className="relative block w-full h-6 md:hidden"
        viewBox="0 0 1200 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,10 L1200,10"
          className="stroke-border fill-none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {/* デスクトップ: 波線 */}
      <svg
        className="relative hidden w-full h-20 md:block"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,10 L150,10 C250,10 300,80 450,80 L750,80 C900,80 950,10 1050,10 L1200,10"
          className="stroke-border fill-none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
