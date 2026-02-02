# ニュースでまなぶ！日本のルール

ニュースと法律情報を提供するWebアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router) / React 19
- **スタイリング**: Tailwind CSS v4 / shadcn/ui
- **データベース**: Drizzle ORM / LibSQL
- **AI**: Vercel AI SDK

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# DBマイグレーション
pnpm drizzle:migrate
```

## ディレクトリ構成

```
app/          # Next.js App Router ページ
components/   # UIコンポーネント
data/         # データベースクエリ関数
db/           # Drizzle ORMスキーマ
hooks/        # カスタムReactフック
lib/          # ユーティリティ関数
types/        # TypeScript型定義
zod/          # Zodスキーマ
```

