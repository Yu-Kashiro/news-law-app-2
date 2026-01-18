import Image from "next/image";
import { GridNews } from "@/components/grid-news";
import { NewsPagination } from "@/components/news-pagination";
import { TopNews } from "@/components/top-news";
import { CurveDivider } from "@/components/wave-divider";
import {
  getPaginatedNews,
  getNewsCount,
  searchNewsPaginated,
  searchNewsCount,
  NEWS_PER_PAGE,
} from "@/data/news";
import { getLawsByNames } from "@/data/laws";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const loadSearchParams = createLoader({
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
});

export default async function Home({ searchParams }: PageProps<"/">) {
  const { name, page } = await loadSearchParams(searchParams);

  // ページネーション付きでデータを取得
  const [news, totalCount] = await Promise.all(
    name
      ? [searchNewsPaginated(name, page), searchNewsCount(name)]
      : [getPaginatedNews(page), getNewsCount()]
  );

  const totalPages = Math.ceil(totalCount / NEWS_PER_PAGE);

  // 1ページ目かつ非検索時のみトップニュースを表示
  const showTopNews = !name && page === 1;
  const topNews = showTopNews ? (news[0] ?? null) : null;
  const gridNews = showTopNews ? news.slice(1) : news;

  // トップニュースの法令をDBから取得
  const topNewsLaws = topNews?.laws ? await getLawsByNames(topNews.laws) : [];

  // グリッドニュースの法令を一括取得
  const allGridLawNames = gridNews.flatMap((n) => n.laws ?? []);
  const allGridLaws =
    allGridLawNames.length > 0 ? await getLawsByNames(allGridLawNames) : [];

  // 法令名からレコードへのマップを作成
  const lawsByName = new Map(allGridLaws.map((law) => [law.name, law]));

  return (
    <div className="flex flex-col">
      {showTopNews && (
        <>
          <TopNews news={topNews} lawRecords={topNewsLaws} />
          <CurveDivider />
        </>
      )}
      {name && news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Image
            src="/17029.svg"
            alt=""
            width={160}
            height={160}
            className="mb-4 opacity-60"
          />
          <p className="text-muted-foreground">ニュースが見つかりませんでした</p>
        </div>
      ) : (
        <>
          <GridNews news={gridNews} lawsByName={lawsByName} />
          <NewsPagination
            currentPage={page}
            totalPages={totalPages}
            searchQuery={name || undefined}
          />
        </>
      )}
    </div>
  );
}
