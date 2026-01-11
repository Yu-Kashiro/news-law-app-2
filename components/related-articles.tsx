import { ScrollText, Lightbulb, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LawArticle, RelatedArticle, Law } from "@/types/laws";

interface RelatedArticlesProps {
  relatedArticles: RelatedArticle[];
  articles: LawArticle[];
  laws: Law[];
}

export function RelatedArticles({
  relatedArticles,
  articles,
  laws,
}: RelatedArticlesProps) {
  if (relatedArticles.length === 0) return null;

  // articleIdからLawArticleを引くためのマップ
  const articleMap = new Map(articles.map((a) => [a.id, a]));
  // lawIdからLawを引くためのマップ
  const lawMap = new Map(laws.map((l) => [l.id, l]));

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <ScrollText className="h-5 w-5" />
        関連条文
      </h2>
      <div className="space-y-4">
        {relatedArticles.map((related, index) => {
          const article = articleMap.get(related.articleId);
          const law = lawMap.get(related.lawId);

          if (!article || !law) return null;

          return (
            <Card key={`${related.articleId}-${index}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {law.name} {article.articleNum}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 条文本文 */}
                <blockquote className="border-l-2 border-primary/30 pl-4 text-sm text-muted-foreground italic">
                  「{article.articleText}」
                </blockquote>

                {/* 関連性の解説 */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        この条文とニュースの関係
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {related.relevanceNote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* e-Gov リンク */}
                {law.officialUrl && (
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={law.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        条文全体を見る
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
