# プロジェクト概要

## 概要

**ニュースでまなぶ！日本のルール** は、ニュースと日本の法令を連携させる教育型Webアプリケーションです。ニュース記事からAIが関連する法令を自動抽出し、法律知識を学べる仕組みを提供します。

## 主な機能

- ニュース一覧表示（ページネーション・検索対応）
- ニュース詳細と関連法令の表示
- 法令詳細と関連条文の表示
- AIによる法律コラム生成
- モックモードによるDB不要の動作確認

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| データベース | Turso (SQLite Cloud) + Drizzle ORM |
| AI | Vercel AI SDK + Google Gemini 2.5 Flash Lite |
| 認証 | Better Auth |
| 外部API | e-Gov 法令API v2, RSSフィード |

---

# アーキテクチャ

## ディレクトリ構造

```
news-law-app-2/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ（ニュース一覧）
│   ├── layout.tsx         # ルートレイアウト
│   ├── api/               # APIルート
│   │   ├── cron/fetch-news/  # Cronジョブ
│   │   └── mock-mode/        # モックモード切替
│   └── news/[id]/         # ニュース詳細
│       └── laws/[lawId]/  # 法令詳細
├── components/            # Reactコンポーネント
│   └── ui/               # shadcn/uiコンポーネント
├── data/                  # データアクセス層 (server-only)
├── db/                    # データベース設定・スキーマ
│   ├── schemas/          # Drizzleスキーマ
│   └── migrations/       # マイグレーション
├── lib/                   # ユーティリティ・外部連携
│   ├── ai/               # AI処理
│   ├── law-tools/        # e-Gov APIクライアント
│   └── mock/             # モックモード
├── types/                 # TypeScript型定義
├── hooks/                 # カスタムフック
├── tests/                 # E2Eテスト
└── docs/                  # ドキュメント
```

## ルーティング構造

| パス | ファイル | 説明 |
|------|---------|------|
| `/` | `app/page.tsx` | ニュース一覧 |
| `/news/[id]` | `app/news/[id]/page.tsx` | ニュース詳細 |
| `/news/[id]/laws/[lawId]` | `app/news/[id]/laws/[lawId]/page.tsx` | 法令詳細 |
| `/credits` | `app/credits/page.tsx` | クレジット |

---

# データフロー

## ニュース取得・処理フロー

```
RSSフィード
  │
  ▼
GET /api/cron/fetch-news (CRON_SECRET認証)
  │
  ├─ RSSパース
  ├─ articleIdで重複チェック
  ├─ OG画像取得（並列）
  │
  ▼ 各記事ごとに（並列）
  │
  ├─ AI: 法令名・コラム生成 (Gemini)
  ├─ e-Gov: 法令検索・保存
  ├─ e-Gov: 条文取得
  ├─ AI: 関連条文選択 (Gemini)
  │
  ▼
  DB保存 (news_items, laws, law_articles)
```

## 画面表示フロー

```
ユーザーアクセス
  │
  ▼
data層関数 (news.ts, laws.ts, law-articles.ts)
  │
  ├─ モックモード判定 (isMockMode)
  │   ├─ ON: lib/mock/queries.ts
  │   └─ OFF: Drizzle ORM → Turso DB
  │
  ▼
Server Component でレンダリング
```

---

# データベース設計

## ERダイアグラム

```
┌─────────────┐      ┌──────────┐      ┌───────────────┐
│ news_items  │──────│  laws    │──────│ law_articles  │
└─────────────┘  N:N └──────────┘  1:N └───────────────┘
```

## テーブル定義

### news_items

| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT (PK) | nanoid |
| articleId | TEXT (UNIQUE) | 記事ID |
| title | TEXT | ニュースタイトル |
| description | TEXT | 説明文 |
| link | TEXT | 記事URL |
| ogImage | TEXT | OG画像URL |
| aiEstimatedLaws | JSON | AI推定法令名リスト |
| lawRelevanceNotes | JSON | 法令との関連性解説 |
| lawColumnTitle | TEXT | コラムタイトル |
| lawColumn | TEXT | コラム本文 |
| relatedArticles | JSON | 関連条文への参照 |
| hasValidLaws | BOOLEAN | 有効な法令があるか |
| publishedAt | TIMESTAMP | 記事公開日 |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### laws

| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT (PK) | nanoid |
| name | TEXT (UNIQUE) | 法令名 |
| eGovLawId | TEXT | e-Gov法令ID |
| lawNum | TEXT | 法令番号 |
| promulgationDate | TEXT | 公布日 |
| officialUrl | TEXT | e-GovへのURL |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### law_articles

| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT (PK) | nanoid |
| lawId | TEXT (FK) | 法令への参照 |
| articleNum | TEXT | 条文番号 |
| articleText | TEXT | 条文本文 |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

---

# 外部API連携

## e-Gov法令API v2

**用途:** 法令検索・条文取得

**エンドポイント:**
- `POST /laws` - 法令名で検索
- `GET /law_data/{lawId}` - 法令詳細・全条文取得

**クライアント:** `lib/law-tools/laws-api-client.ts`

## RSSフィード

**用途:** ニュース記事の取得

**取得情報:**
- タイトル
- 説明文
- リンク
- 公開日

## AI Gateway (Gemini)

**モデル:** `google/gemini-2.5-flash-lite`

**処理:**
1. ニュースから法令名・コラム生成 (`lib/ai/generate-laws.ts`)
2. 関連条文の選択 (`lib/ai/generate-related-articles.ts`)

---

# モックモード

## 概要

データベース接続なしでアプリケーションの動作確認ができるモードです。

## 仕組み

1. Cookie `mock_mode` で状態管理
2. `GET/POST /api/mock-mode` で切り替え
3. data層関数で `isMockMode()` 判定
4. モックデータは `lib/mock/data.ts` に静的定義

## モックデータ

- ニュース: 15件
- 法令: 4件（個人情報保護法、労働基準法、道路交通法、民法）
- 条文: 各法令に複数件

---

# 型定義

## 設計方針

CLAUDE.mdの規約に従い、型定義はDrizzleスキーマをベースに定義します。

```typescript
// types/news.ts
type NewsItem = typeof newsItems.$inferSelect;

// types/laws.ts
type Law = typeof laws.$inferSelect;
type LawArticle = typeof lawArticles.$inferSelect;
```

## JSON型

ニュースに埋め込まれるJSONデータの型:

```typescript
// 関連条文への参照
interface RelatedArticle {
  lawId: string;
  articleId: string;
  relevanceNote: string;
}

// 法令との関連理由
interface LawRelevanceNote {
  lawName: string;
  relevanceNote: string;
}
```

---

# 環境変数

| 変数名 | 説明 |
|--------|------|
| `TURSO_DATABASE_URL` | Turso DB URL |
| `TURSO_AUTH_TOKEN` | Turso 認証トークン |
| `CRON_SECRET` | Cronジョブ認証シークレット |
| `AI_GATEWAY_API_KEY` | AI Gateway APIキー |

---

# 開発コマンド

```bash
pnpm dev              # 開発サーバー起動
pnpm build            # 本番ビルド
pnpm lint             # ESLint実行
pnpm test             # テスト実行
pnpm drizzle:migrate  # DBマイグレーション実行
```

---

# CI/CD

| ワークフロー | 説明 |
|-------------|------|
| `ci.yml` | ビルド・テスト・リント |
| `claude-code-review.yml` | Claudeによる自動コードレビュー |
| `migrate.yml` | DBマイグレーション |
