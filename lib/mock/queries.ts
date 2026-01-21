import "server-only";
import { mockNewsItems, mockLaws, mockLawArticles } from "./data";
import { NEWS_PER_PAGE } from "@/data/news";
import type { NewsItem } from "@/types/news";
import type { Law, LawArticle } from "@/types/laws";

// ニュース関連
export function getMockNewsById(id: string): NewsItem | null {
  return mockNewsItems.find((news) => news.id === id) ?? null;
}

export function getMockPaginatedNews(page: number): NewsItem[] {
  const offset = (page - 1) * NEWS_PER_PAGE;
  const validNews = mockNewsItems.filter((news) => news.hasValidLaws);
  const sorted = [...validNews].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
  return sorted.slice(offset, offset + NEWS_PER_PAGE);
}

export function getMockNewsCount(): number {
  return mockNewsItems.filter((news) => news.hasValidLaws).length;
}

export function searchMockNewsPaginated(name: string, page: number): NewsItem[] {
  const pattern = name.toLowerCase();
  const offset = (page - 1) * NEWS_PER_PAGE;
  const validNews = mockNewsItems.filter((news) => {
    if (!news.hasValidLaws) return false;
    return (
      news.title.toLowerCase().includes(pattern) ||
      news.description.toLowerCase().includes(pattern) ||
      JSON.stringify(news.lawRelevanceNotes).toLowerCase().includes(pattern)
    );
  });
  const sorted = [...validNews].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
  return sorted.slice(offset, offset + NEWS_PER_PAGE);
}

export function searchMockNewsCount(name: string): number {
  const pattern = name.toLowerCase();
  return mockNewsItems.filter((news) => {
    if (!news.hasValidLaws) return false;
    return (
      news.title.toLowerCase().includes(pattern) ||
      news.description.toLowerCase().includes(pattern) ||
      JSON.stringify(news.lawRelevanceNotes).toLowerCase().includes(pattern)
    );
  }).length;
}

// 法令関連
export function getMockLawById(id: string): Law | null {
  return mockLaws.find((law) => law.id === id) ?? null;
}

export function getMockLawByName(name: string): Law | null {
  return mockLaws.find((law) => law.name === name) ?? null;
}

export function getMockLawsByNames(names: string[]): Law[] {
  if (names.length === 0) return [];
  return mockLaws.filter((law) => names.includes(law.name));
}

// 条文関連
export function getMockArticlesByLawId(lawId: string): LawArticle[] {
  return mockLawArticles.filter((article) => article.lawId === lawId);
}

export function getMockArticleByNumAndLawId(
  articleNum: string,
  lawId: string
): LawArticle | undefined {
  return mockLawArticles.find(
    (article) => article.articleNum === articleNum && article.lawId === lawId
  );
}
