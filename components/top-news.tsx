import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/types/news";
import { formatDateJa } from "@/lib/utils";

export function TopNews({ news }: { news: NewsItem | null }) {
  if (!news) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-foreground sm:text-5xl">
            最新ニュース
          </h2>
          <p className="mt-2 text-lg/8 text-muted-foreground">
            法律に関連する最新のニュースをお届けします。
          </p>
          <div className="mt-16 lg:mt-20">
            <article className="group relative isolate flex flex-col gap-8 lg:flex-row">
              <div className="relative lg:w-80 lg:shrink-0 overflow-hidden rounded-2xl bg-muted">
                {news.ogImage ? (
                  <Image
                    alt={news.title}
                    src={news.ogImage}
                    width={1200}
                    height={630}
                    className="w-full h-auto rounded-2xl transition-all duration-300 group-hover:opacity-75"
                  />
                ) : (
                  <div className="aspect-video w-full rounded-2xl bg-muted" />
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
                  <h3 className="mt-3 text-lg/6 font-semibold text-foreground group-hover:text-muted-foreground">
                    <Link
                      href={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="absolute inset-0" />
                      {news.title}
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm/6 text-muted-foreground">
                    {news.description}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
