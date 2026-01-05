import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { inArray } from "drizzle-orm";
import type { RssItem } from "@/types/news";

export const maxDuration = 30;

const NHK_RSS_URL = "https://www.nhk.or.jp/rss/news/cat0.xml";

function extractArticleId(link: string): string | null {
  // URLパターン: https://news.web.nhk/newsweb/na/na-k10015018501000
  const match = link.match(/na-(k\d+)/);
  return match ? match[1] : null;
}

async function fetchOgImageUrl(articleUrl: string): Promise<string | null> {
  try {
    const response = await fetch(articleUrl, {
      headers: { "User-Agent": "NewsLawApp/1.0" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const html = await response.text();

    // og:image メタタグを抽出（属性順序の両パターンに対応）
    const match = html.match(
      /<meta\s+(?:property="og:image"\s+content="([^"]+)"|content="([^"]+)"\s+property="og:image")/i
    );

    return match ? match[1] || match[2] : null;
  } catch {
    return null;
  }
}

async function parseRss(xml: string): Promise<RssItem[]> {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];

    const titleMatch = itemContent.match(
      /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/
    );
    const linkMatch = itemContent.match(
      /<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/
    );
    const descMatch = itemContent.match(
      /<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/
    );
    const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch && linkMatch && descMatch && pubDateMatch) {
      items.push({
        title: titleMatch[1].trim(),
        link: linkMatch[1].trim(),
        description: descMatch[1].trim(),
        pubDate: pubDateMatch[1].trim(),
      });
    }
  }

  return items;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(NHK_RSS_URL, {
      headers: {
        "User-Agent": "NewsLawApp/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }

    const xml = await response.text();
    const items = await parseRss(xml);

    // articleId を抽出してマッピング
    const itemsWithArticleId = items
      .map((item) => ({
        ...item,
        articleId: extractArticleId(item.link),
      }))
      .filter(
        (item): item is RssItem & { articleId: string } =>
          item.articleId !== null
      );

    const skippedNoArticleId = items.length - itemsWithArticleId.length;

    // 一度のクエリで既存の articleId をすべて取得
    const articleIds = itemsWithArticleId.map((item) => item.articleId);
    const existingArticles =
      articleIds.length > 0
        ? await db
            .select({ articleId: newsItems.articleId })
            .from(newsItems)
            .where(inArray(newsItems.articleId, articleIds))
        : [];

    const existingSet = new Set(existingArticles.map((a) => a.articleId));

    // 新規記事のみをフィルタリング
    const newItems = itemsWithArticleId.filter(
      (item) => !existingSet.has(item.articleId)
    );

    const skippedCount = skippedNoArticleId + existingSet.size;

    // OG image を並列取得
    const ogImageResults = await Promise.allSettled(
      newItems.map((item) => fetchOgImageUrl(item.link))
    );

    // DB に挿入（バルクインサート）
    if (newItems.length > 0) {
      const insertValues = newItems.map((item, i) => {
        const ogImageResult = ogImageResults[i];
        const ogImage =
          ogImageResult.status === "fulfilled" ? ogImageResult.value : null;

        return {
          articleId: item.articleId,
          title: item.title,
          description: item.description,
          link: item.link,
          ogImage,
          publishedAt: new Date(item.pubDate),
        };
      });

      await db.insert(newsItems).values(insertValues);
    }

    return NextResponse.json({
      success: true,
      inserted: newItems.length,
      skipped: skippedCount,
      total: items.length,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
