# ニュースでまなぶ！日本のルール

NHKのニュース記事を取得し、AIが関連する日本の法律を推定・解説する教育Webアプリケーション

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 16 (App Router) / React 19 / Tailwind CSS v4 / shadcn/ui |
| バックエンド | Next.js API Routes (サーバーレス) |
| ORM | Drizzle ORM |
| データベース | Turso (LibSQL / サーバーレス SQLite) |
| 認証 | better-auth |
| AI | Vercel AI SDK + Google Gemini 2.5 Flash |
| バリデーション | Zod v4 / React Hook Form |
| デプロイ | Vercel |

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

## ページ構成

- `/` - トップページ（ニュース一覧・検索・ページネーション）
- `/news/[id]` - ニュース記事詳細（関連法律・AI法律コラム表示）
- `/news/[id]/laws/[lawId]` - 法律詳細（法律情報・関連条文一覧）
- `/credits` - クレジットページ

## 外部サービス連携

| サービス | 役割 | 接続方式 |
|---------|------|---------|
| NHK NEWS WEB | ニュースソース | RSS フィード取得 |
| Google Gemini 2.5 Flash | 法律推定・コラム生成 | Vercel AI SDK |
| e-Gov 法令API | 法律の公式情報・条文取得 | REST API |
| Turso | データ永続化 | LibSQL (サーバーレス SQLite) |

## アーキテクチャ

### 全体構成

```mermaid
graph TB
    subgraph Client["クライアント（ブラウザ）"]
        Browser["React 19 + Tailwind CSS v4 + shadcn/ui"]
    end

    subgraph NextJS["Next.js 16 App Router on Vercel"]
        subgraph Pages["ページ（Server Components）"]
            Home["/ トップページ<br/>ニュース一覧・検索"]
            NewsDetail["/news/[id]<br/>記事詳細・法律コラム"]
            LawDetail["/news/[id]/laws/[lawId]<br/>法律詳細・条文一覧"]
        end

        subgraph API["API Routes"]
            Cron["/api/cron/fetch-news<br/>Cronジョブ"]
            MockAPI["/api/mock-mode<br/>モックモード切替"]
        end

        subgraph DataLayer["データアクセス層（server-only）"]
            NewsData["data/news.ts"]
            LawsData["data/laws.ts"]
            ArticlesData["data/law-articles.ts"]
        end

        subgraph ORM["ORM / スキーマ層"]
            Drizzle["Drizzle ORM"]
            Schemas["db/schemas/<br/>news | laws | law_articles | auth"]
            Types["types/ + zod/<br/>型定義・バリデーション"]
        end

        subgraph Lib["外部サービス連携層"]
            AILib["lib/ai/<br/>generate-laws.ts"]
            LawTools["lib/law-tools/<br/>laws-api-client.ts"]
            Auth["lib/auth.ts<br/>better-auth"]
        end

        MockMode["lib/mock/<br/>モックデータ"]
    end

    subgraph External["外部サービス"]
        NHK["NHK NEWS WEB<br/>RSS フィード"]
        Gemini["Google Gemini 2.5 Flash<br/>Vercel AI SDK"]
        EGov["e-Gov 法令API<br/>法律情報・条文"]
        Turso["Turso<br/>LibSQL / サーバーレス SQLite"]
    end

    Browser -->|ページリクエスト| Pages
    Browser -->|API呼び出し| API

    Pages --> DataLayer
    API --> DataLayer
    DataLayer -->|通常モード| ORM
    DataLayer -.->|モックモード| MockMode

    Cron --> AILib
    Cron --> LawTools
    Cron --> NHK

    AILib --> Gemini
    LawTools --> EGov
    Auth --> Turso

    ORM --> Drizzle
    Drizzle --> Turso
    Types -.-> Schemas

    classDef external fill:#e8f4f8,stroke:#2196F3,stroke-width:2px
    classDef page fill:#fff3e0,stroke:#FF9800,stroke-width:2px
    classDef data fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    classDef api fill:#fce4ec,stroke:#E91E63,stroke-width:2px

    class NHK,Gemini,EGov,Turso external
    class Home,NewsDetail,LawDetail page
    class NewsData,LawsData,ArticlesData,Drizzle data
    class Cron,MockAPI api
```

### データフロー（ニュース取得パイプライン）

```mermaid
sequenceDiagram
    participant Cron as Cronジョブ
    participant NHK as NHK NEWS WEB
    participant DB as Turso DB
    participant AI as Gemini 2.5 Flash
    participant EGov as e-Gov 法令API

    Note over Cron,EGov: ニュース取得パイプライン

    Cron->>NHK: RSS フィード取得
    NHK-->>Cron: 記事一覧（タイトル・概要・リンク）
    Cron->>Cron: OG画像抽出・記事パース
    Cron->>DB: 新規記事を保存

    loop 各ニュース記事
        Cron->>AI: 記事タイトル・概要を送信
        AI-->>Cron: 関連法律名・関連性メモ・法律コラム
        Cron->>DB: AI解析結果を更新

        loop 各推定法律
            Cron->>EGov: 法律名で検索
            EGov-->>Cron: 法律情報・条文テキスト
            Cron->>DB: 法律・条文を保存
        end
    end
```

### ER図（データベース）

```mermaid
erDiagram
    news_items {
        string id PK
        string articleId UK
        string title
        string description
        string link
        string ogImage
        json aiEstimatedLaws
        json lawRelevanceNotes
        string lawColumnTitle
        string lawColumn
        json relatedArticles
        boolean hasValidLaws
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    laws {
        string id PK
        string name UK
        string eGovLawId
        string lawNum
        string promulgationDate
        string officialUrl
        datetime createdAt
        datetime updatedAt
    }

    law_articles {
        string id PK
        string lawId FK
        string articleNum
        string articleText
        datetime createdAt
        datetime updatedAt
    }

    users {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
    }

    sessions {
        string id PK
        string userId FK
        string token UK
        datetime expiresAt
        string ipAddress
        string userAgent
    }

    laws ||--o{ law_articles : "has"
    users ||--o{ sessions : "has"
    news_items }o--o{ laws : "references (via JSON)"
```
