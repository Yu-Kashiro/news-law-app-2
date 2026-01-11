import Link from "next/link";
import { ExternalLink, ArrowRight, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Law } from "@/types/laws";

interface LawCardProps {
  law: Law;
  newsId: string;
  relevanceNote?: string;
}

export function LawCard({ law, newsId, relevanceNote }: LawCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex flex-col gap-3 flex-1">
          {/* 法令名と法令番号 */}
          <div>
            <h3 className="font-semibold text-foreground">{law.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 min-h-4">
              {law.lawNum || "\u00A0"}
            </p>
          </div>

          {/* 関連理由 */}
          {relevanceNote && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{relevanceNote}</p>
              </div>
            </div>
          )}

          {/* 一言要約 */}
          {law.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {law.summary}
            </p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/laws/${law.id}?from=${newsId}`}>
              詳細を見る
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          {law.officialUrl && (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={law.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                e-Gov
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
