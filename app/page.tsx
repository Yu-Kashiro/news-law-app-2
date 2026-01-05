import { GridNews } from "@/components/grid-news";
import { TopNews } from "@/components/top-news";
import { getAllNews } from "@/data/news";

export default async function Home() {
  const { topNews, gridNews } = await getAllNews();

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {topNews && <TopNews news={topNews} />}
      <GridNews news={gridNews} />
    </div>
  );
}
