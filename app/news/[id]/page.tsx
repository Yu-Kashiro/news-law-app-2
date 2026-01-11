import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Scale,
  FileText,
  ImageOff,
} from "lucide-react";
import { getNewsById } from "@/data/news";
import { getLawsByNames } from "@/data/laws";
import { formatDateJa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LawCard } from "@/components/law-card";
import { getArticlesByLawId } from "@/data/law-articles";
import { RelatedArticles } from "@/components/related-articles";
import type { LawArticle } from "@/types/laws";

type Params = Promise<{ id: string }>;

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const news = await getNewsById(id);
  const lawRecords = news?.laws ? await getLawsByNames(news.laws) : [];
  const lawMap = new Map(lawRecords.map((law) => [law.name, law]));

  // 関連条文を取得
  const articleIds = news?.relatedArticles?.map((r) => r.articleId) ?? [];
  let articles: LawArticle[] = [];
  if (articleIds.length > 0) {
    // 各法令から条文を取得
    const articlePromises = lawRecords.map((law) => getArticlesByLawId(law.id));
    const articleResults = await Promise.all(articlePromises);
    articles = articleResults.flat();
  }

  if (!news) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                ニュース一覧に戻る
              </Link>
            </Button>
          </div>

          <article className="flex flex-col gap-8 lg:flex-row">
            <div className="relative aspect-video lg:w-80 lg:shrink-0 overflow-hidden rounded-2xl bg-muted">
              {news.ogImage ? (
                <Image
                  alt={news.title}
                  src={news.ogImage}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageOff className="h-8 w-8 text-muted-foreground" />
                  <span className="sr-only">画像なし</span>
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-border" />
            </div>
            <div>
              <div className="flex items-center gap-x-4 text-xs">
                <time
                  dateTime={news.publishedAt.toISOString()}
                  className="text-muted-foreground"
                >
                  {formatDateJa(news.publishedAt)}
                </time>
              </div>
              <div className="max-w-xl">
                <h1 className="mt-3 text-lg/6 font-semibold text-foreground">
                  {news.title}
                </h1>
                <p className="mt-5 text-sm/6 text-muted-foreground">
                  {news.description}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      元の記事を読む
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>

          {news.laws && news.laws.length > 0 && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Scale className="h-5 w-5" />
                関係法令
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {news.laws.map((lawName) => {
                  const law = lawMap.get(lawName);
                  const relatedLaw = news.relatedLaws?.find(
                    (r) => r.lawName === lawName
                  );
                  return law ? (
                    <LawCard
                      key={lawName}
                      law={law}
                      newsId={id}
                      relevanceNote={relatedLaw?.relevanceNote}
                    />
                  ) : (
                    <Card key={lawName} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground">
                          {lawName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          詳細情報を取得中...
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* 関連条文セクション（法令コラムの上に配置） */}
          {news.relatedArticles && news.relatedArticles.length > 0 && (
            <RelatedArticles
              relatedArticles={news.relatedArticles}
              articles={articles}
              laws={lawRecords}
            />
          )}

          {news.lawColumn && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {news.lawColumnTitle ?? "法令コラム"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm/6 text-muted-foreground whitespace-pre-wrap">
                  {news.lawColumn}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
