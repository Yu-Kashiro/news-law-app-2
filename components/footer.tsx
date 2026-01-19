import Link from "next/link"

function DecorativeDots() {
  return (
    <>
      {/* 左端のピンク - 中大 */}
      <div className="absolute left-[3%] top-4 size-2.5 rounded-full bg-[#f28b82] opacity-75" />
      {/* 左側の黄色 - 極小 */}
      <div className="absolute left-[10%] bottom-3 size-1 rounded-full bg-[#fdd663] opacity-65" />
      {/* 左中の青 - 大 */}
      <div className="absolute left-[18%] top-6 size-3 rounded-full bg-[#6b9bd1] opacity-80" />
      {/* 中央左の緑 - 小 */}
      <div className="absolute left-[30%] bottom-5 size-1.5 rounded-full bg-[#81c995] opacity-70" />
      {/* 中央の黄色 - 極小 */}
      <div className="absolute left-[45%] top-3 size-1 rounded-full bg-[#fdd663] opacity-60" />
      {/* 中央右のピンク - 小 */}
      <div className="absolute right-[35%] bottom-4 size-1.5 rounded-full bg-[#f28b82] opacity-70" />
      {/* 右側の緑 - 中大 */}
      <div className="absolute right-[20%] top-5 size-2.5 rounded-full bg-[#a8e063] opacity-80" />
      {/* 右側の青 - 極小 */}
      <div className="absolute right-[12%] bottom-6 size-1 rounded-full bg-[#7baaf7] opacity-65" />
      {/* 右端の黄色 - 中 */}
      <div className="absolute right-[4%] top-4 size-2 rounded-full bg-[#fdd663] opacity-75" />
    </>
  );
}

const navigation = [
  {
    name: "X",
    href: "https://x.com/yu_hibikore",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/Yu-Kashiro",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* 装飾ドット */}
      <DecorativeDots />
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex items-center justify-center gap-x-6 md:order-2">
          <Link
            href="/credits"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            クレジット
          </Link>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="size-6" />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:order-1 md:mt-0">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <Link
              href="https://yu-kashiro.dev/"
              className="hover:text-foreground hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              yu-kashiro.dev
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
