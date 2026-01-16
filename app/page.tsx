import { GridNews } from "@/components/grid-news";
import { TopNews } from "@/components/top-news";
import { CurveDivider } from "@/components/wave-divider";
import { getAllNews, searchNews } from "@/data/news";
import { getLawsByNames } from "@/data/laws";
import { createLoader, parseAsString } from "nuqs/server";

export const loadSearchParams = createLoader({
  name: parseAsString.withDefault(""),
});

export default async function Home({ searchParams }: PageProps<"/">) {
  const { name } = await loadSearchParams(searchParams);
  const allNews = name ? await searchNews(name) : await getAllNews();

  // トップとグリッドに分割（検索時は全てグリッドに表示）
  const topNews = name ? null : (allNews[0] ?? null);
  const gridNews = name ? allNews : allNews.slice(1);

  // トップニュースの法令をDBから取得
  const topNewsLaws = topNews?.laws ? await getLawsByNames(topNews.laws) : [];

  // グリッドニュースの法令を一括取得
  const allGridLawNames = gridNews.flatMap((news) => news.laws ?? []);
  const allGridLaws =
    allGridLawNames.length > 0 ? await getLawsByNames(allGridLawNames) : [];

  // 法令名からレコードへのマップを作成
  const lawsByName = new Map(allGridLaws.map((law) => [law.name, law]));

  return (
    <div className="flex flex-col">
      {!name && (
        <>
          <TopNews news={topNews} lawRecords={topNewsLaws} />
          <CurveDivider />
        </>
      )}
      <GridNews news={gridNews} lawsByName={lawsByName} />
    </div>
  );
}
