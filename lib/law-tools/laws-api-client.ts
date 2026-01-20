/**
 * e-Gov法令API v2 クライアント
 * 法令検索・取得機能を提供
 */

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

  private static extractText(element: unknown, depth = 0): string {
    if (typeof element === "string") {
      return element;
    }
    if (typeof element === "object" && element !== null) {
      const el = element as Record<string, unknown>;
      const tag = el.tag as string | undefined;
      const children = el.children;

      // 条番号（ArticleTitle: 第二十条など）は見出しと重複するのでスキップ
      if (tag === "ArticleTitle") {
        return "";
      }

      if (Array.isArray(children)) {
        const childTexts = children.map((child) =>
          this.extractText(child, depth + 1)
        );

        const text = childTexts.join("");

        // 項（Paragraph）の前に空行を追加
        if (tag === "Paragraph") {
          return "\n\n" + text;
        }

        // 号（Item）の前に改行を追加
        if (tag === "Item") {
          return "\n" + text;
        }

        // 号番号（ItemTitle: 一、二など）の後にスペースを追加
        if (tag === "ItemTitle") {
          return text + " ";
        }

        return text;
      }
    }
    return "";
  }
}

// ツール関数

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
