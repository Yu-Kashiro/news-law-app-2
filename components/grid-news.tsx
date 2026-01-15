import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { NewsItem } from "@/types/news";
import type { Law } from "@/types/laws";
import { formatDateJa } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface GridNewsProps {
  news: NewsItem[];
  lawsByName: Map<string, Law>;
}

export function GridNews({ news, lawsByName }: GridNewsProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
            Latest News
          </p>
          <div className="divide-y divide-border">
          {news.map((item) => {
            // この記事に関連する法令レコードを取得
            const itemLaws = (item.laws ?? [])
              .map((name) => lawsByName.get(name))
              .filter((law): law is Law => law !== undefined);

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
