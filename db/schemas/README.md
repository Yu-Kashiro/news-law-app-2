# データベーススキーマ ドキュメント

このドキュメントでは、各テーブルのカラムとデータの出所（AI推定 / API取得 / システム生成）を説明します。

---

## news_items テーブル

ニュース記事の情報を保存するテーブル。

| カラム名 | 型 | 必須 | データソース | 説明 |
|----------|-----|------|-------------|------|
| `id` | text | ✓ | システム | nanoid で自動生成される主キー |
| `articleId` | text | ✓ | 外部RSS | NHK RSS フィードの記事固有ID（重複取り込み防止用） |
| `title` | text | ✓ | 外部RSS | 記事タイトル |
| `description` | text | ✓ | 外部RSS | 記事の説明文 |
| `link` | text | ✓ | 外部RSS | 記事へのリンクURL |
| `ogImage` | text | | 外部HTML | 記事ページから取得した OG 画像の URL |
| `aiEstimatedLaws` | json (string[]) | | **AI推定** | 関連する法令名のリスト（e-Gov 未検証） |
| `lawRelevanceNotes` | json (LawRelevanceNote[]) | | **AI推定** | 各法令とニュースの関連理由 |
| `lawColumnTitle` | text | | **AI推定** | 法律コラムのタイトル |
| `lawColumn` | text | | **AI推定** | 法律コラムの本文 |
| `relatedArticles` | json (RelatedArticle[]) | | **AI推定** + API | ニュースに関連する条文（条文自体は e-Gov API から取得） |
| `hasValidLaws` | boolean | | システム | e-Gov API で1件以上の法令が見つかったかのフラグ |
| `publishedAt` | timestamp | ✓ | 外部RSS | 記事の公開日時 |
| `createdAt` | timestamp_ms | ✓ | システム | レコード作成日時（自動設定） |
| `updatedAt` | timestamp_ms | ✓ | システム | レコード更新日時（自動更新） |

### データソース凡例

- **外部RSS**: NHK RSS フィードから取得
- **外部HTML**: NHK 記事ページをスクレイピングして取得
- **AI推定**: Gemini 2.5 Flash による推定（検証なし）
- **AI推定 + API**: AI が推定し、e-Gov API で条文を取得
- **システム**: アプリケーションが自動生成

### 注意事項

- `aiEstimatedLaws` と `lawRelevanceNotes` は AI の出力をそのまま保存しており、存在しない法令名が含まれる可能性があります
- サイト表示時は `hasValidLaws = true` でフィルタされるため、有効な法令がない記事は表示されません
- `ogImage` の URL は NHK サーバー上の画像を指しており、ユーザーのブラウザが直接 NHK から画像を取得します

---

## laws テーブル

法令の詳細情報を保存するテーブル。**e-Gov API で存在が確認できた法令のみ** が保存されます。

| カラム名 | 型 | 必須 | データソース | 説明 |
|----------|-----|------|-------------|------|
| `id` | text | ✓ | システム | nanoid で自動生成される主キー |
| `name` | text | ✓ | **e-Gov API** | 法令の正式名称 |
| `eGovLawId` | text | | **e-Gov API** | e-Gov 法令ID |
| `lawNum` | text | | **e-Gov API** | 法令番号（例: 平成十六年法律第百二十号） |
| `promulgationDate` | text | | **e-Gov API** | 公布日 |
| `officialUrl` | text | | システム | e-Gov の法令詳細ページ URL |
| `summary` | text | | **AI生成** | 法令の概要説明 |
| `background` | text | | **AI生成** | 法令の背景・制定理由 |
| `pros` | json (LawPoint[]) | | **AI生成** | 法令の良い点 |
| `cons` | json (LawPoint[]) | | **AI生成** | 法令の改善点・課題 |
| `createdAt` | timestamp_ms | ✓ | システム | レコード作成日時 |
| `updatedAt` | timestamp_ms | ✓ | システム | レコード更新日時 |

### 保存条件

- AI がニュース記事から法令名を推定
- e-Gov API で検索し、**見つかった場合のみ** このテーブルに保存
- 見つからなかった法令名は `news_items.aiEstimatedLaws` には残るが、このテーブルには保存されない

---

## law_articles テーブル

法令の条文を保存するテーブル。

| カラム名 | 型 | 必須 | データソース | 説明 |
|----------|-----|------|-------------|------|
| `id` | text | ✓ | システム | nanoid で自動生成される主キー |
| `lawId` | text | ✓ | システム | laws テーブルへの外部キー |
| `articleNum` | text | ✓ | **e-Gov API** | 条番号（例: 第1条） |
| `articleText` | text | ✓ | **e-Gov API** | 条文の本文 |
| `createdAt` | timestamp_ms | ✓ | システム | レコード作成日時 |
| `updatedAt` | timestamp_ms | ✓ | システム | レコード更新日時 |

---

## データの信頼性まとめ

| 信頼性 | データソース | 該当カラム例 |
|--------|-------------|-------------|
| **高** | e-Gov API | `laws.name`, `laws.eGovLawId`, `law_articles.*` |
| **高** | 外部RSS/HTML | `news_items.title`, `news_items.link`, `news_items.ogImage` |
| **中** | AI推定 + API検証 | `news_items.relatedArticles` |
| **低** | AI推定（未検証） | `news_items.aiEstimatedLaws`, `news_items.lawRelevanceNotes`, `news_items.lawColumn` |
| **低** | AI生成 | `laws.summary`, `laws.background`, `laws.pros`, `laws.cons` |

### 重要

- 「AI推定（未検証）」のデータは、存在しない法令名や不正確な関連性が含まれる可能性があります
- 「AI生成」のデータは法令の解説であり、法的助言ではありません
- e-Gov API から取得したデータは公式情報ですが、最新性は API の更新頻度に依存します
