# CLAUDE.md

このファイルは、このリポジトリでのコード作業時に Claude Code (claude.ai/code) へのガイダンスを提供します。

## コマンド

**パッケージマネージャー: pnpm（npm/yarn 禁止）**

```bash
pnpm dev              # 開発サーバー起動
pnpm build            # 本番ビルド
pnpm lint             # ESLint実行
pnpm test             # テスト実行
pnpm drizzle:migrate  # DBマイグレーション実行
```

## アーキテクチャ

- **フレームワーク**: Next.js 16 with App Router (React 19)
- **スタイリング**: Tailwind CSS v4（CSS カスタムプロパティでテーマ設定）
- **UI コンポーネント**: shadcn/ui
- **パスエイリアス**: `@/*` はプロジェクトルートにマッピング

### 主要ディレクトリ

- `app/` - Next.js App Router のページとレイアウト
- `components/ui/` - shadcn/ui コンポーネント
- `lib/utils.ts` - 汎用ユーティリティ関数
- `hooks/` - カスタム React フック
- `data/` - データベースクエリ関数（server-only）
- `db/schemas/` - Drizzle ORM スキーマ
- `types/` - TypeScript 型定義
- `zod/` - Zod スキーマ

## 開発規約

### Type 定義

- `/types` に設置、Drizzle Schema の `$inferSelect` をベースに定義
- フォーム用は適宜拡張/Omit

### Zod スキーマ

- `/zod` に設置、drizzle-zod で Drizzle Schema をベースに定義
- フォーム用は適宜拡張/Omit、エラーは日本語

### データ操作

- CRUD 操作はすべてルートハンドラー経由
- クライアントからは SWR でアクセス
- ルートハンドラーでセッション権限チェック必須
- データ作成・編集時は検証必須

## テスト

- CI 設定: `.github/workflows/`
- 変更したコードにはテストを追加/更新する
- マージ前にすべてのテストをパスさせる

## レビューポイント

- 型/Zod は Drizzle Schema ベースか
- CRUD はルートハンドラー経由か
- 権限チェック・データ検証は実装されているか

## レビュー時の留意事項

- ORM のスキーマを変更している場合、それによる影響を詳細にレポートする
- ORM を使ってデータベースにアクセスする際は、直前に適切な権限チェックがされているか確認する
- ORM を使ってデータベースに変更を加える際は、直前に適切な値の検証と権限チェックがされているか確認する
- Drizzle スキーマをベースに Zod や型を定義し、適宜拡張して使用していることを確認する
- 末端のファイルで独自の型定義やアサーションを行っていないことを確認する
