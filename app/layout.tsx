import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
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
      <body className="wrap-anywhere flex min-h-screen flex-col">
        <NuqsAdapter>
          <Suspense>
            <Header />
          </Suspense>
          <main className="mb-8 flex-1">{children}</main>
          <hr className="border-border" />
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
