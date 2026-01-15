import { GridNews } from "@/components/grid-news";
import { TopNews } from "@/components/top-news";
import { getAllNews } from "@/data/news";
import { getLawsByNames } from "@/data/laws";

export default async function Home() {
  const { topNews, gridNews } = await getAllNews();

  // トップニュースの法令をDBから取得
  const topNewsLaws = topNews?.laws
    ? await getLawsByNames(topNews.laws)
    : [];

  // グリッドニュースの法令を一括取得
  const allGridLawNames = gridNews.flatMap((news) => news.laws ?? []);
  const allGridLaws = allGridLawNames.length > 0
    ? await getLawsByNames(allGridLawNames)
    : [];

  // 法令名からレコードへのマップを作成
  const lawsByName = new Map(allGridLaws.map((law) => [law.name, law]));

  return (
    <div className="flex flex-col">
      <TopNews news={topNews} lawRecords={topNewsLaws} />
      <GridNews news={gridNews} lawsByName={lawsByName} />
    </div>
  );
}
