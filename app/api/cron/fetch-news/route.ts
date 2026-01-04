import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsItems } from "@/db/schemas/news";
import { eq } from "drizzle-orm";

export const maxDuration = 30;

const NHK_RSS_URL = "https://www.nhk.or.jp/rss/news/cat0.xml";

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

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

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

    // 新規記事を収集
    const newItems: (RssItem & { articleId: string })[] = [];
    let skippedCount = 0;

    for (const item of items) {
      const articleId = extractArticleId(item.link);

      if (!articleId) {
        skippedCount++;
        continue;
      }

      const existing = await db
        .select({ id: newsItems.id })
        .from(newsItems)
        .where(eq(newsItems.articleId, articleId))
        .limit(1);

      if (existing.length > 0) {
        skippedCount++;
        continue;
      }

      newItems.push({ ...item, articleId });
    }

    // OG image を並列取得
    const ogImageResults = await Promise.allSettled(
      newItems.map((item) => fetchOgImageUrl(item.link))
    );

    // DB に挿入
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      const ogImageResult = ogImageResults[i];
      const ogImage =
        ogImageResult.status === "fulfilled" ? ogImageResult.value : null;

      await db.insert(newsItems).values({
        articleId: item.articleId,
        title: item.title,
        description: item.description,
        link: item.link,
        ogImage,
        publishedAt: new Date(item.pubDate),
      });
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
