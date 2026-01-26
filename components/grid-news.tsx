import Image from "next/image";
import Link from "next/link";
import { ImageOff, X } from "lucide-react";
import type { NewsItem } from "@/types/news";
import type { Law } from "@/types/laws";
import { formatDateJa } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GridNewsProps {
  news: NewsItem[];
  lawsByName: Map<string, Law>;
  searchQuery?: string;
}

export function GridNews({ news, lawsByName, searchQuery }: GridNewsProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
              <Image src="/25650_line.svg" alt="" width={24} height={24} />
              最新ニュース
            </p>
            {searchQuery && (
              <Button variant="outline" size="sm" className="h-7 text-xs md:hidden" asChild>
                <Link href="/">
                  <X className="h-3 w-3 mr-1" />
                  検索をクリア
                </Link>
              </Button>
            )}
          </div>
          <div className="divide-y divide-border">
          {news.map((item) => {
            // この記事に関連する法令レコードを取得（関連条文がある法令のみ）
            const lawIdsWithArticles = new Set(item.relatedArticles?.map(r => r.lawId) ?? []);
            const itemLaws = (item.aiEstimatedLaws ?? [])
              .map((name) => lawsByName.get(name))
              .filter((law): law is Law => law !== undefined && lawIdsWithArticles.has(law.id));

            return (
            <article key={item.id} className="group relative py-4 first:pt-0">
              <Link
                href={`/news/${item.id}`}
                className="absolute inset-0 z-10"
              />
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <time
                    dateTime={item.publishedAt.toISOString()}
                    className="mt-2 block text-xs text-muted-foreground"
                  >
                    {formatDateJa(item.publishedAt)}
                  </time>
                  {itemLaws.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {itemLaws.map((law) => (
                        <Badge
                          key={law.id}
                          variant="secondary"
                          className="max-w-xs block truncate"
                          title={law.name}
                        >
                          {law.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative w-24 h-16 shrink-0 overflow-hidden rounded bg-muted">
                  {item.ogImage ? (
                    <Image
                      alt={item.title}
                      src={item.ogImage}
                      fill
                      className="object-contain transition-all duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">画像なし</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
