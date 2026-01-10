import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Scale,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  History,
  MessageCircle,
} from "lucide-react";
import { getLawById } from "@/data/laws";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ from?: string }>;

export default async function LawDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { from } = await searchParams;

  const law = await getLawById(id);
  const backHref = from ? `/news/${from}` : "/";
  const backLabel = from ? "ニュースに戻る" : "ニュース一覧に戻る";

  if (!law) {
    notFound();
  }

  return (
    <div className="bg-background py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link href={backHref} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          </div>

          <article className="space-y-8">
            {/* タイトル */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Scale className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {law.name}
                  </h1>
                  {law.lawNum && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {law.lawNum}
                    </p>
                  )}
                </div>
              </div>
              {law.officialUrl && (
                <Button asChild>
                  <Link
                    href={law.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    e-Gov法令検索
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* 一言で言うと */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  一言で言うと
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm/6 text-muted-foreground">
                  {law.summary}
                </p>
              </CardContent>
            </Card>

            {/* なぜこの法律ができたのか */}
            {law.background && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    なぜこの法律ができたのか
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {law.background}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* この法律の良いところ */}
            {law.pros && law.pros.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5" />
                    この法律の良いところ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">ポイント</TableHead>
                        <TableHead>解説</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {law.pros.map((point, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {point.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {point.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* 直した方が良いところ */}
            {law.cons && law.cons.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsDown className="h-5 w-5" />
                    直した方が良いところ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">ポイント</TableHead>
                        <TableHead>解説</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {law.cons.map((point, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {point.title}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {point.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* コメント欄 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  コメント
                  <span className="text-sm font-normal text-muted-foreground">
                    (3件)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* コメント入力欄 */}
                <div className="space-y-3">
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="この法律についてコメントを書く..."
                    rows={3}
                    disabled
                  />
                  <div className="flex justify-end">
                    <Button disabled>コメントを投稿</Button>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  {/* モックコメント1 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          田中
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">田中太郎</p>
                        <p className="text-xs text-muted-foreground">
                          2024年12月15日
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-10">
                      この法律の背景がとても分かりやすくまとまっていて勉強になりました。特に制定の経緯について詳しく知ることができて良かったです。
                    </p>
                  </div>

                  {/* モックコメント2 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          佐藤
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">佐藤花子</p>
                        <p className="text-xs text-muted-foreground">
                          2024年12月10日
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-10">
                      メリット・デメリットが両方書いてあるのが良いですね。法律の良い面だけでなく課題も知れるのは参考になります。
                    </p>
                  </div>

                  {/* モックコメント3 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          鈴木
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">鈴木一郎</p>
                        <p className="text-xs text-muted-foreground">
                          2024年12月5日
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground pl-10">
                      法律の要約がとても助かります。原文を読むのは大変なので、このように簡潔にまとめてもらえると理解しやすいです。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>
        </div>
      </div>
    </div>
  );
}
