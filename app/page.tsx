import { GridNews } from "@/components/grid-news";
import { TopNews } from "@/components/top-news";
import { getAllNews } from "@/data/news";

export default async function Home() {
  const { topNews, gridNews } = await getAllNews();

  return (
    <div className="flex flex-col">
      <TopNews news={topNews} />
      <GridNews news={gridNews} />
    </div>
  );
}
