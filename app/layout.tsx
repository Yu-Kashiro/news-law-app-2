import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: "ニュースでまなぶ！日本のルール",
  description: "ニュースから日本の法律・ルールを学ぶサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="wrap-anywhere relative flex min-h-screen flex-col bg-background">
        {/* Dashed Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 z-0 min-h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e7e5e4 1px, transparent 1px),
              linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            maskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
              repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
              radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
          aria-hidden="true"
        />
        <NuqsAdapter>
          <Suspense>
            <Header />
          </Suspense>
          <main className="relative z-10 mb-8 flex-1">{children}</main>
          <hr className="relative z-10 border-border" />
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
