import Link from "next/link";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Law } from "@/types/laws";

interface LawCardProps {
  law: Law;
  newsId: string;
}

export function LawCard({ law, newsId }: LawCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* 法令名と法令番号 */}
          <div>
            <h3 className="font-semibold text-foreground">{law.name}</h3>
            {law.lawNum && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {law.lawNum}
              </p>
            )}
          </div>

          {/* 一言要約 */}
          {law.summary && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {law.summary}
            </p>
          )}

          {/* 公布日 */}
          {law.promulgationDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>公布日: {law.promulgationDate}</span>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-2 mt-1">
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
        </div>
      </CardContent>
    </Card>
  );
}
