import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Scale, FileText } from "lucide-react";
import { getNewsById } from "@/data/news";
import { formatDateJa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = Promise<{ id: string }>;

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    notFound();
  }

  const news = await getNewsById(newsId);

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
              ) : null}
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
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  関係法令
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {news.laws.map((law) => (
                    <Badge key={law} variant="secondary">
                      {law}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {news.lawColumn && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  法令コラム
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
