export function CurveDivider() {
  return (
    <div className="w-full overflow-hidden">
      <svg
        className="relative block w-full h-20"
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
