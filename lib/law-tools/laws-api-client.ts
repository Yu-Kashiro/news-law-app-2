/**
 * e-Gov法令API v2 クライアント
 * 法令検索・取得機能を提供
 */

// 検索ガイダンス
export const SEARCH_GUIDANCE = `
# 法令検索AI向けガイダンス

## 効果的な法令検索の段階的アプローチ

### 1. 初期検索戦略
自然言語クエリから法的概念を抽出し、以下の順序で検索を試みてください：
1. 主要な名詞でキーワード検索（例：「シートベルト」「着用」）
2. 法令用語への変換を試行（例：「シートベルト」→「座席ベルト」）
3. 関連する法令名での検索（例：交通関連→「道路交通法」）

### 2. 検索結果の評価
- 複数の法令がヒットした場合、カテゴリーと内容から最も関連性の高いものを特定
- 条文中に定義されていない用語（例：「幼児」）が出現した場合、その定義を別途検索
- 検索結果が0件の場合、キーワードを減らすか、類義語で再検索

### 3. 深掘り検索
- 該当法令が特定できたら、より詳細な条文を取得
- 参照されている他の法令（例：「児童福祉法に定める」）があれば、その法令も検索
- 年齢や数値に関する規定は、前後の条文も確認

### 4. 回答生成時の注意
- 法令間の参照関係は明示的に述べる
- 検索で確認できなかった事項は推論であることを明示
- 複数の解釈が可能な場合は、その旨を記載

### 5. 具体例：年齢に関する規定の検索
質問：「X歳でYは可能か？」
1. Yに関する法令をキーワード検索
2. 年齢制限や年齢区分（幼児、児童、未成年等）を含む条文を特定
3. 年齢区分の定義を他の法令で検索
4. 該当年齢がどの区分に該当するか判断

### 6. よく使われる年齢区分の検索ヒント
法令でよく使われる年齢区分を検索する際のキーワード：
- 「幼児」→ 「児童福祉法」で定義を検索
- 「児童」→ 「児童福祉法」「学校教育法」で定義を検索
- 「未成年」→ 「民法」で定義を検索
- 「少年」→ 「少年法」で定義を検索

### 7. 表記揺れへの対処
同じ概念でも法令により表記が異なる場合があります：
- 「シートベルト」「座席ベルト」
- 「自動車」「車両」「車」
- 「道路」「道」
複数の表記で検索を試みてください。
`;

// 型定義
interface LawInfo {
  law_id?: string;
  law_num?: string;
  law_type?: string;
  promulgation_date?: string;
}

interface RevisionInfo {
  law_title?: string;
  amendment_promulgate_date?: string;
  category?: string;
}

interface Sentence {
  position?: string;
  text?: string;
}

interface ApiResponseItem {
  law_info?: LawInfo;
  revision_info?: RevisionInfo;
  sentences?: Sentence[];
}

interface ApiResponseLaw {
  law_info?: LawInfo;
  revision_info?: RevisionInfo;
}

interface ApiResponse {
  error?: string;
  message?: string;
  code?: string;
  total_count?: number;
  sentence_count?: number;
  count?: number;
  items?: ApiResponseItem[];
  laws?: ApiResponseLaw[];
  law_info?: LawInfo;
  revision_info?: RevisionInfo;
  law_full_text?: Record<string, unknown>;
  attached_files_info?: unknown;
  next_offset?: number;
}

export interface FormattedResultItem {
  law_id?: string;
  law_title?: string;
  law_num?: string;
  position?: string;
  text?: string;
  raw_text?: string;
  law_type?: string;
  promulgation_date?: string;
  last_amendment_date?: string;
  category?: string;
  law_full_text?: Record<string, unknown>;
}

export interface FormattedResult {
  search_type: string;
  total_count: number;
  returned_count: number;
  has_error: boolean;
  error_message: string;
  items: FormattedResultItem[];
  search_hints: {
    has_more?: boolean;
    next_offset?: number;
    suggestions?: string[];
  };
}

export interface Article {
  article_num: string;
  article_text: string;
  char_count: number;
}

export interface LawContent {
  law_id?: string;
  law_title?: string;
  law_num?: string;
  promulgation_date?: string;
  last_amendment?: string;
  articles?: Article[];
  article_count?: number;
  law_full_text?: Record<string, unknown>;
  error?: string;
  message?: string;
}

export interface AnalysisResult {
  original_query: string;
  total_results: number;
  law_distribution: Record<
    string,
    {
      title: string;
      count: number;
      positions: string[];
    }
  >;
  relevance_indicators: Array<{
    law_title?: string;
    matching_words: string[];
    match_ratio: number;
  }>;
  undefined_terms: Array<{
    term: string;
    law_title?: string;
    context: string;
  }>;
  referenced_laws: Array<{
    from_law?: string;
    to_law: string;
    context: string;
  }>;
  suggested_actions: Array<{
    action: string;
    reason: string;
    law_id?: string;
    law_title?: string;
    suggestion?: string;
    target_law?: string;
  }>;
}

// Laws API クライアント
class LawsAPIClient {
  private static readonly BASE_URL = "https://laws.e-gov.go.jp/api/2";

  static async callApi(
    endpoint: string,
    params: Record<string, unknown>,
    pathParam?: string
  ): Promise<ApiResponse> {
    const cleanParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          cleanParams.set(key, value.join(","));
        } else {
          cleanParams.set(key, String(value));
        }
      }
    }

    let url = pathParam
      ? `${this.BASE_URL}/${endpoint}/${encodeURIComponent(pathParam)}`
      : `${this.BASE_URL}/${endpoint}`;

    const queryString = cleanParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "LawsAIMCP/1.0",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = (await response.json()) as ApiResponse;
          if (errorData.code === "404001") {
            return { items: [], total_count: 0, error: "no_results" };
          }
          return {
            error: `http_error_${response.status}`,
            message: errorData.message || "",
          };
        }
        throw new Error(`HTTP error: ${response.status}`);
      }

      return (await response.json()) as ApiResponse;
    } catch (error) {
      return {
        error: "request_failed",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// レスポンスフォーマッター
class ResponseFormatter {
  static formatSearchResults(
    results: ApiResponse,
    searchType: string
  ): FormattedResult {
    const formatted: FormattedResult = {
      search_type: searchType,
      total_count: 0,
      returned_count: 0,
      has_error: false,
      error_message: "",
      items: [],
      search_hints: {},
    };

    if (results.error) {
      formatted.has_error = true;
      formatted.error_message = results.message || results.error;
      return formatted;
    }

    if (searchType === "keyword") {
      formatted.total_count = results.total_count || 0;
      formatted.returned_count = results.sentence_count || 0;

      const items = results.items || [];
      for (const item of items) {
        const lawInfo = item.law_info || {};
        const revisionInfo = item.revision_info || {};
        const sentences = item.sentences || [];

        for (const sentence of sentences) {
          formatted.items.push({
            law_id: lawInfo.law_id,
            law_title: revisionInfo.law_title,
            law_num: lawInfo.law_num,
            position: sentence.position,
            text: (sentence.text || "").replace(/<[^>]+>/g, ""),
            raw_text: sentence.text || "",
          });
        }
      }

      if (formatted.total_count > formatted.returned_count) {
        formatted.search_hints.has_more = true;
        formatted.search_hints.next_offset = results.next_offset || 0;
      }
    } else if (searchType === "laws") {
      formatted.total_count = results.total_count || 0;
      formatted.returned_count = results.count || 0;

      const laws = results.laws || [];
      for (const law of laws) {
        const lawInfo = law.law_info || {};
        const revisionInfo = law.revision_info || {};

        formatted.items.push({
          law_id: lawInfo.law_id,
          law_title: revisionInfo.law_title,
          law_num: lawInfo.law_num,
          law_type: lawInfo.law_type,
          promulgation_date: lawInfo.promulgation_date,
          last_amendment_date: revisionInfo.amendment_promulgate_date,
          category: revisionInfo.category,
        });
      }
    } else if (searchType === "law_data") {
      const lawInfo = results.law_info || {};
      const revisionInfo = results.revision_info || {};

      formatted.total_count = 1;
      formatted.returned_count = 1;
      formatted.items = [
        {
          law_id: lawInfo.law_id,
          law_title: revisionInfo.law_title,
          law_num: lawInfo.law_num,
          law_full_text: results.law_full_text || {},
        },
      ];
    }

    return formatted;
  }

  static extractArticlesFromLawData(lawData: ApiResponse): Article[] {
    const articles: Article[] = [];

    const parseElement = (element: unknown): void => {
      if (typeof element !== "object" || element === null) return;

      const el = element as Record<string, unknown>;
      const tag = el.tag as string | undefined;

      if (tag === "Article") {
        const attr = el.attr as Record<string, string> | undefined;
        const articleNum = attr?.Num || "";
        const articleText = this.extractText(element);

        if (articleNum && articleText) {
          articles.push({
            article_num: articleNum,
            article_text: articleText,
            char_count: articleText.length,
          });
        }
      }

      const children = el.children;
      if (Array.isArray(children)) {
        for (const child of children) {
          parseElement(child);
        }
      }
    };

    const lawFullText = lawData.law_full_text || {};
    parseElement(lawFullText);

    return articles;
  }

  private static extractText(element: unknown): string {
    if (typeof element === "string") {
      return element;
    }
    if (typeof element === "object" && element !== null) {
      const el = element as Record<string, unknown>;
      const children = el.children;
      if (Array.isArray(children)) {
        return children.map((child) => this.extractText(child)).join("");
      }
    }
    return "";
  }
}

// ツール関数

/**
 * キーワードで法令本文を検索
 */
export async function searchLawsByKeyword(params: {
  keywords: string[];
  limit?: number;
  offset?: number;
  lawType?: string[];
  dateFrom?: string;
  dateTo?: string;
}): Promise<FormattedResult> {
  const { keywords, limit = 10, offset = 0, lawType, dateFrom, dateTo } = params;

  const apiParams: Record<string, unknown> = {
    keyword: keywords.join(" "),
    limit,
    offset,
    sentence_text_size: 300,
  };

  if (lawType) apiParams.law_type = lawType;
  if (dateFrom) apiParams.promulgation_date_from = dateFrom;
  if (dateTo) apiParams.promulgation_date_to = dateTo;

  const results = await LawsAPIClient.callApi("keyword", apiParams);
  const formatted = ResponseFormatter.formatSearchResults(results, "keyword");

  if (formatted.total_count === 0) {
    formatted.search_hints.suggestions = [
      "キーワードを減らして検索",
      "類義語や関連語で検索",
      "法令名で直接検索",
    ];
  }

  return formatted;
}

/**
 * 法令名で法令を検索
 */
export async function searchLawsByTitle(params: {
  titleKeywords: string[];
  limit?: number;
  lawType?: string[];
  includeRepealed?: boolean;
}): Promise<FormattedResult> {
  const { titleKeywords, limit = 10, lawType, includeRepealed = false } = params;

  const apiParams: Record<string, unknown> = {
    law_title: titleKeywords.join(" "),
    limit,
  };

  if (lawType) apiParams.law_type = lawType;
  if (!includeRepealed) apiParams.repeal_status = ["None"];

  const results = await LawsAPIClient.callApi("laws", apiParams);
  return ResponseFormatter.formatSearchResults(results, "laws");
}

/**
 * 法令IDから法令本文を取得
 */
export async function getLawContent(params: {
  lawId: string;
  extractArticles?: boolean;
  targetDate?: string;
}): Promise<LawContent> {
  const { lawId, extractArticles = true, targetDate } = params;

  const apiParams: Record<string, unknown> = {
    law_full_text_format: "json",
  };

  if (targetDate) apiParams.asof = targetDate;

  const results = await LawsAPIClient.callApi("law_data", apiParams, lawId);

  if (results.error) {
    return { error: results.error, message: results.message };
  }

  const lawInfo = results.law_info || {};
  const revisionInfo = results.revision_info || {};

  const output: LawContent = {
    law_id: lawInfo.law_id,
    law_title: revisionInfo.law_title,
    law_num: lawInfo.law_num,
    promulgation_date: lawInfo.promulgation_date,
    last_amendment: revisionInfo.amendment_promulgate_date,
  };

  if (extractArticles) {
    const articles = ResponseFormatter.extractArticlesFromLawData(results);
    output.articles = articles;
    output.article_count = articles.length;
  } else {
    output.law_full_text = results.law_full_text || {};
  }

  return output;
}

/**
 * 法令検索のベストプラクティスとガイダンスを取得
 */
export function getSearchGuidance(): string {
  return SEARCH_GUIDANCE;
}

/**
 * 検索結果を分析し、関連性や次のアクションを提案
 */
export function analyzeSearchResults(
  searchResults: FormattedResultItem[],
  originalQuery: string
): AnalysisResult {
  const analysis: AnalysisResult = {
    original_query: originalQuery,
    total_results: searchResults.length,
    law_distribution: {},
    relevance_indicators: [],
    undefined_terms: [],
    referenced_laws: [],
    suggested_actions: [],
  };

  // 法令ごとの分布を分析
  const lawCount: Record<
    string,
    { title: string; count: number; positions: string[] }
  > = {};

  for (const result of searchResults) {
    const lawId = result.law_id || "unknown";
    const lawTitle = result.law_title || "不明";

    if (!lawCount[lawId]) {
      lawCount[lawId] = {
        title: lawTitle,
        count: 0,
        positions: [],
      };
    }
    lawCount[lawId].count += 1;
    lawCount[lawId].positions.push(result.position || "");
  }

  analysis.law_distribution = lawCount;

  // 関連性の指標を計算
  const queryWords = new Set(
    originalQuery.toLowerCase().match(/[一-龥ぁ-んァ-ヶー]+/g) || []
  );

  // 未定義用語と参照法令を検出
  const ageTerms = ["幼児", "児童", "未成年", "少年", "成年"];
  const lawReferences: Array<{
    from_law?: string;
    to_law: string;
    context: string;
  }> = [];

  for (const result of searchResults.slice(0, 10)) {
    const text = (result.text || "").toLowerCase();

    // キーワードマッチング
    const matchingWords = [...queryWords].filter((word) => text.includes(word));
    if (matchingWords.length > 0) {
      analysis.relevance_indicators.push({
        law_title: result.law_title,
        matching_words: matchingWords,
        match_ratio: queryWords.size > 0 ? matchingWords.length / queryWords.size : 0,
      });
    }

    // 未定義用語の検出
    for (const term of ageTerms) {
      if (text.includes(term) && text.includes("定める")) {
        analysis.undefined_terms.push({
          term,
          law_title: result.law_title,
          context: text.slice(0, 100),
        });
      }
    }

    // 他法令への参照を検出
    const lawPattern = /([一-龥]+法)(?:第[一-九十百千万]+条)?/g;
    let match;
    while ((match = lawPattern.exec(text)) !== null) {
      const foundLaw = match[1];
      if (foundLaw !== result.law_title) {
        lawReferences.push({
          from_law: result.law_title,
          to_law: foundLaw,
          context: text.slice(0, 100),
        });
      }
    }
  }

  // 重複を除去
  const seenLaws = new Set<string>();
  analysis.referenced_laws = lawReferences.filter((ref) => {
    if (seenLaws.has(ref.to_law)) return false;
    seenLaws.add(ref.to_law);
    return true;
  });

  // 次のアクションを提案
  const lawIds = Object.keys(lawCount);

  if (lawIds.length === 1) {
    const lawId = lawIds[0];
    analysis.suggested_actions.push({
      action: "get_full_law",
      reason: "検索結果が単一の法令に集中している",
      law_id: lawId,
      law_title: lawCount[lawId].title,
    });
  } else if (lawIds.length > 5) {
    analysis.suggested_actions.push({
      action: "narrow_search",
      reason: "検索結果が複数の法令に分散している",
      suggestion: "より具体的なキーワードで絞り込み",
    });
  }

  // 未定義用語がある場合
  for (const termInfo of analysis.undefined_terms) {
    analysis.suggested_actions.push({
      action: "search_definition",
      reason: `'${termInfo.term}'の定義が必要`,
      suggestion: `'${termInfo.term} 定義'で検索`,
    });
  }

  // 参照法令がある場合
  for (const ref of analysis.referenced_laws.slice(0, 3)) {
    analysis.suggested_actions.push({
      action: "search_referenced_law",
      reason: `他の法令（${ref.to_law}）が参照されている`,
      target_law: ref.to_law,
    });
  }

  // 年齢に関するクエリの場合
  if (["歳", "年齢", "何歳"].some((word) => originalQuery.includes(word))) {
    analysis.suggested_actions.push({
      action: "search_age_definitions",
      reason: "年齢に関する質問",
      suggestion: "年齢区分の定義を確認（幼児、児童等）",
    });
  }

  return analysis;
}
