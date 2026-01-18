import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "クレジット | ニュースでまなぶ！日本のルール",
  description: "当サイトで使用しているコンテンツのクレジット表記",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">クレジット</h1>
      <p className="mt-2 text-muted-foreground">
        当サイトで使用しているコンテンツのクレジット表記です。
      </p>

      <div className="mt-10 space-y-10">
        {/* ニュースデータ */}
        <section>
          <h2 className="text-lg font-semibold">ニュースデータ</h2>
          <div className="mt-4 rounded-lg border p-4">
            <p className="font-medium">NHK RSS</p>
            <p className="mt-1 text-sm text-muted-foreground">
              ニュース情報はNHKが提供するRSSフィードから取得しています。
            </p>
            <Link
              href="https://www.nhk.or.jp/toppage/rss/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              https://www.nhk.or.jp/toppage/rss/index.html
            </Link>
          </div>
        </section>

        {/* イラスト素材 */}
        <section>
          <h2 className="text-lg font-semibold">イラスト素材</h2>
          <div className="mt-4 rounded-lg border p-4">
            <p className="font-medium">ソコスト</p>
            <p className="mt-1 text-sm text-muted-foreground">
              サイト内で使用しているイラストはソコストから提供されています。
            </p>
            <Link
              href="https://soco-st.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              https://soco-st.com/
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
