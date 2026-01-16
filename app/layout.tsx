import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="ja" suppressHydrationWarning>
      <body className="wrap-anywhere flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <Header />
            <main className="mb-8 flex-1">{children}</main>
            <hr className="border-border" />
            <Footer />
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
