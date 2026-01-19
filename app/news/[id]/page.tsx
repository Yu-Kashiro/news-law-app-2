import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, ImageOff } from "lucide-react";
import { getNewsById } from "@/data/news";
import { getLawsByNames } from "@/data/laws";
import { formatDateJa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CurveDivider } from "@/components/wave-divider";

type Params = Promise<{ id: string }>;

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { id } = await params;

  const news = await getNewsById(id);
  const lawRecords = news?.aiEstimatedLaws ? await getLawsByNames(news.aiEstimatedLaws) : [];

  if (!news) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="pt-6 mb-8 flex items-center justify-between">
            <Button variant="ghost" asChild className="!px-0">
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="sm:hidden">戻る</span>
                <span className="hidden sm:inline">ニュース一覧に戻る</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="sm:hidden">
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
                <div className="mt-6 hidden sm:block">
                  <Button asChild variant="outline">
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
        </div>
      </div>

      <CurveDivider />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          {lawRecords.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Image
                  src="/16366_line.svg"
                  alt=""
                  width={24}
                  height={30}
                  className="inline-block"
                />
                関係法令
              </h2>
              <div className="space-y-3">
                {lawRecords.map((law) => {
                  const relatedLaw = news.relatedLaws?.find(
                    (r) => r.lawName === law.name
                  );

                  return (
                    <Card
                      key={law.id}
                      variant="accent"
                      className="hover:bg-muted/50"
                    >
                      <Link
                        href={`/news/${id}/laws/${law.id}`}
                        className="group block"
                      >
                        <CardContent className="py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:underline">
                            {law.name}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                          {relatedLaw?.relevanceNote && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {relatedLaw.relevanceNote}
                            </p>
                          )}
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {news.lawColumn && (
            <section className="mt-8">
              <h2 className="flex items-center gap-2 text-base font-semibold bg-primary/20 text-foreground px-4 py-2 rounded-md mb-3">
                <Image
                  src="/12976_color.svg"
                  alt=""
                  width={24}
                  height={30}
                  className="inline-block"
                />
                {news.lawColumnTitle ?? "法令コラム"}
              </h2>
              <p className="text-sm/6 text-muted-foreground whitespace-pre-wrap">
                {news.lawColumn}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
