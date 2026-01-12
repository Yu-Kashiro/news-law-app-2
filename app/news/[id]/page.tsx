import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  ImageOff,
} from "lucide-react";
import { getNewsById } from "@/data/news";
import { getLawsByNames } from "@/data/laws";
import { formatDateJa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Params = Promise<{ id: string }>;

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const news = await getNewsById(id);
  const lawRecords = news?.laws ? await getLawsByNames(news.laws) : [];
  const lawMap = new Map(lawRecords.map((law) => [law.name, law]));

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
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                関係法令
              </p>
              <ul className="divide-y divide-border">
                {news.laws.map((lawName) => {
                  const law = lawMap.get(lawName);
                  const relatedLaw = news.relatedLaws?.find(
                    (r) => r.lawName === lawName
                  );

                  return (
                    <li key={lawName}>
                      <Link
                        href={law ? `/news/${id}/laws/${law.id}` : "#"}
                        className="block rounded-lg p-3 -mx-3 hover:bg-muted transition-colors"
                      >
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                          {lawName}
                          <ArrowRight className="h-3 w-3" />
                        </span>
                        {relatedLaw?.relevanceNote && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {relatedLaw.relevanceNote}
                          </p>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
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
