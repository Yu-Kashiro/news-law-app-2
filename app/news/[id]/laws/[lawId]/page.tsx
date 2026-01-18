import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getNewsById } from "@/data/news";
import { getLawById } from "@/data/laws";
import { getArticlesByLawId } from "@/data/law-articles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticleText } from "@/components/article-text";
import type { LawArticle, RelatedArticle } from "@/types/laws";

type Params = Promise<{ id: string; lawId: string }>;

export default async function NewsLawDetailPage({ params }: { params: Params }) {
  const { id, lawId } = await params;

  const [news, law, articles] = await Promise.all([
    getNewsById(id),
    getLawById(lawId),
    getArticlesByLawId(lawId),
  ]);

  if (!news || !law) {
    notFound();
  }

  // このニュースに関連する法令情報を取得
  const relatedLaw = news.relatedLaws?.find((r) => r.lawName === law.name);

  // このニュース・法令に関連する条文をフィルタリングしてソート
  const relatedArticles = (news.relatedArticles ?? [])
    .filter((r) => r.lawId === lawId)
    .map((related) => {
      const article = articles.find((a) => a.id === related.articleId);
      return article ? { related, article } : null;
    })
    .filter(
      (item): item is { related: RelatedArticle; article: LawArticle } =>
        item !== null
    )
    .sort((a, b) => {
      const extractNum = (articleNum: string) => {
        const match = articleNum.match(/第(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return extractNum(a.article.articleNum) - extractNum(b.article.articleNum);
    });

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="pt-3 mb-4 sm:pt-6 sm:mb-8">
            <Button variant="ghost" asChild className="!px-0">
              <Link href={`/news/${id}`} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="sm:hidden">戻る</span>
                <span className="hidden sm:inline">ニュース詳細に戻る</span>
              </Link>
            </Button>
          </div>

          {/* 法令情報 */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{law.name}</h1>
              {law.lawNum && (
                <p className="text-sm text-muted-foreground mt-1">{law.lawNum}</p>
              )}
            </div>
            {law.officialUrl && (
              <Button asChild variant="outline" size="sm" className="shrink-0 hidden sm:inline-flex">
                <Link
                  href={law.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  e-Govで法令を見る
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>

          {/* 関係する理由 */}
          {relatedLaw?.relevanceNote && (
            <section className="mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                このニュースとの関連
              </p>
              <p className="text-sm text-foreground">
                {relatedLaw.relevanceNote}
              </p>
            </section>
          )}

          {/* 関連条文 */}
          {relatedArticles.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <Image
                    src="/12821.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  関連条文
                </p>
                {law.officialUrl && (
                  <Button asChild variant="outline" size="sm" className="sm:hidden">
                    <Link
                      href={law.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-1.5"
                    >
                      e-Govで法令を見る
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {relatedArticles.map(({ related, article }) => (
                  <Card key={article.id} variant="accent">
                    <CardContent className="p-4">
                      <ArticleText
                        title={article.articleNum}
                        text={article.articleText}
                      />
                      {related.relevanceNote && (
                        <p className="mt-3 text-sm text-foreground border-t pt-3">
                          {related.relevanceNote}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
