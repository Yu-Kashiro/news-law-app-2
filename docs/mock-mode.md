# モックモード

データベースを使用せずにアプリケーションを動作確認できる機能です。開発環境やデモ用途で使用します。

## 概要

モックモードを有効にすると、データベースへのアクセスをすべてスキップし、`lib/mock/data.ts` に定義されたサンプルデータを表示します。

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────┐
│                        クライアント                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MockModeToggle (components/mock-mode-toggle.tsx)       │   │
│  │  - Switch UI でモックモードを切り替え                     │   │
│  │  - POST /api/mock-mode でCookieを設定                   │   │
│  │  - window.location.href でフルページリロード            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Route                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  /api/mock-mode/route.ts                                │   │
│  │  - GET: 現在のモックモード状態を返す                      │   │
│  │  - POST: Cookie (mock_mode) を設定/削除                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    サーバーコンポーネント                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  data/news.ts, data/laws.ts, data/law-articles.ts      │   │
│  │                                                         │   │
│  │  各クエリ関数の先頭で isMockMode() をチェック            │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ if (await isMockMode()) {                       │   │   │
│  │  │   return getMockXxx();  // モックデータを返す    │   │   │
│  │  │ }                                               │   │   │
│  │  │ return db.query...      // DBからデータ取得     │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## ファイル構成

```
lib/mock/
├── constants.ts   # Cookie名の定数 (MOCK_MODE_COOKIE)
├── utils.ts       # isMockMode() - Cookieからモックモード状態を取得
├── data.ts        # モックデータ (laws, lawArticles, newsItems)
└── queries.ts     # モックデータ用のクエリ関数

components/
├── mock-mode-toggle.tsx  # 切り替えスイッチ (Client Component)
└── mock-mode-banner.tsx  # モックモード中のバナー表示 (Server Component)

app/api/mock-mode/
└── route.ts       # モックモード切り替えAPI
```

## 各ファイルの役割

### `lib/mock/constants.ts`

Cookie名を定数として定義。

```typescript
export const MOCK_MODE_COOKIE = "mock_mode";
```

### `lib/mock/utils.ts`

サーバーサイドでCookieを確認し、モックモードの状態を返す。

```typescript
export async function isMockMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(MOCK_MODE_COOKIE)?.value === "true";
}
```

### `lib/mock/data.ts`

モックデータを定義。

| 変数 | 内容 |
|------|------|
| `mockLaws` | 法令データ (4件: 個人情報保護法、労働基準法、道路交通法、民法) |
| `mockLawArticles` | 条文データ (各法令に1-2件) |
| `mockNewsItems` | ニュースデータ (15件) |

### `lib/mock/queries.ts`

モックデータを検索・フィルタリングする関数群。

| 関数 | 説明 |
|------|------|
| `getMockNewsById(id)` | IDでニュースを取得 |
| `getMockPaginatedNews(page)` | ページネーション付きでニュース取得 |
| `getMockNewsCount()` | ニュース総件数 |
| `searchMockNewsPaginated(name, page)` | キーワード検索 |
| `searchMockNewsCount(name)` | 検索結果件数 |
| `getMockLawById(id)` | IDで法令を取得 |
| `getMockLawByName(name)` | 法令名で法令を取得 |
| `getMockLawsByNames(names)` | 複数の法令名で法令を取得 |
| `getMockArticlesByLawId(lawId)` | 法令IDで条文一覧を取得 |
| `getMockArticleByNumAndLawId(articleNum, lawId)` | 条文番号と法令IDで条文を取得 |

### `components/mock-mode-toggle.tsx`

フッターに表示されるトグルスイッチ（Client Component）。

- `useSyncExternalStore` でCookie値を監視
- トグル時に `/api/mock-mode` へPOSTリクエスト
- `window.location.href = "/"` でフルページリロード（Router Cacheをバイパスし、IDの不一致による404を防止）

### `components/mock-mode-banner.tsx`

モックモード有効時にページ上部に表示されるバナー（Server Component）。

### `app/api/mock-mode/route.ts`

モックモードの状態管理API。

| メソッド | 動作 |
|---------|------|
| `GET` | 現在のモックモード状態を返す |
| `POST` | `enabled: true` でCookieを設定、`enabled: false` でCookieを削除 |

## データ取得フロー

```
1. ユーザーがページにアクセス
2. Server Component が data/news.ts などの関数を呼び出す
3. 各関数の先頭で isMockMode() を実行
4. Cookie を確認
   ├─ mock_mode=true  → getMockXxx() でモックデータを返す
   └─ mock_mode=false → db.query... でDBからデータ取得
5. データをUIにレンダリング
```

## 使用方法

1. フッターの「Mock Mode」トグルをオンにする
2. ページ上部に黄色いバナー「Mock Mode: DBを使用せず、サンプルデータを表示しています」が表示される
3. ニュース一覧・詳細ページでモックデータが表示される
4. トグルをオフにすると通常モード（DB使用）に戻る

## 画像表示

モックニュースには [picsum.photos](https://picsum.photos/) のプレースホルダー画像を使用。

```
https://picsum.photos/seed/mock-news-{n}/800/450
```

- `seed` パラメータでニュースごとに固定の画像を表示
- 800x450 (16:9 アスペクト比)

`next.config.ts` の `remotePatterns` に `picsum.photos` を追加済み。
