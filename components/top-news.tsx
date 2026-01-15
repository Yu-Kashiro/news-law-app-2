import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type { NewsItem } from "@/types/news";
import type { Law } from "@/types/laws";
import { formatDateJa } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TopNewsProps {
  news: NewsItem | null;
  lawRecords: Law[];
}

export function TopNews({ news, lawRecords }: TopNewsProps) {
  if (!news) {
    return null;
  }

  return (
    <section className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <article className="group relative">
          <Link href={`/news/${news.id}`} className="absolute inset-0 z-10" />
          <div className="flex flex-col lg:flex-row lg:justify-center gap-6 lg:gap-8">
            {/* 左側: テキストコンテンツ */}
            <div className="flex-1 lg:max-w-md">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
                Pick Up
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {news.title}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                {news.description}
              </p>
              <time
                dateTime={news.publishedAt.toISOString()}
                className="mt-4 block text-xs text-muted-foreground"
              >
                {formatDateJa(news.publishedAt)}
              </time>
              {lawRecords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {lawRecords.map((law) => (
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
            {/* 右側: 画像 */}
            <div className="relative lg:flex-1 lg:max-w-md aspect-video overflow-hidden rounded-lg bg-muted">
              {news.ogImage ? (
                <Image
                  alt={news.title}
                  src={news.ogImage}
                  fill
                  className="object-contain rounded-lg transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="h-12 w-12 text-muted-foreground" />
                  <span className="sr-only">画像なし</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
