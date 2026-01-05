import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/types/news";
import { formatDateJa } from "@/lib/utils";

export function GridNews({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return null;
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            その他のニュース
          </h2>
          <p className="mt-2 text-lg/8 text-muted-foreground">
            法律に関連するニュースをお届けします。
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="group relative flex flex-col items-start justify-between"
            >
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10"
              />
              <div className="relative w-full overflow-hidden rounded-2xl bg-muted">
                {item.ogImage ? (
                  <Image
                    alt={item.title}
                    src={item.ogImage}
                    width={1200}
                    height={630}
                    className="w-full h-auto rounded-2xl transition-all duration-300 group-hover:opacity-75"
                  />
                ) : (
                  <div className="aspect-video w-full rounded-2xl bg-muted" />
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-border" />
              </div>
              <div className="flex max-w-xl grow flex-col justify-between">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={item.publishedAt.toISOString()}
                    className="text-muted-foreground"
                  >
                    {formatDateJa(item.publishedAt)}
                  </time>
                </div>
                <div className="relative grow">
                  <h3 className="mt-3 text-lg/6 font-semibold text-foreground group-hover:text-muted-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm/6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
