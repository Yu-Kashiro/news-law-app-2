"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArticleTextProps {
  text: string;
  title?: string;
  className?: string;
  /** 折りたたみ時に表示する最大行数（デフォルト: 4） */
  maxLines?: number;
}

export function ArticleText({
  text,
  title,
  className,
  maxLines = 4,
}: ArticleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  // ResizeObserver内で最新のisExpanded値を参照するためのref
  const isExpandedRef = useRef(isExpanded);

  // refの更新はuseEffect内で行う（レンダー中の更新を避ける）
  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  // テキストが切り詰められているかを検出（初回マウント時とテキスト変更時のみ）
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkClamped = () => {
      // 展開中は判定をスキップ（折りたたみ時の状態を維持）
      if (isExpandedRef.current) return;
      // scrollHeightがclientHeightより大きい場合、テキストは切り詰められている
      setIsClamped(element.scrollHeight > element.clientHeight + 1);
    };

    checkClamped();

    // リサイズ時にも再チェック
    const resizeObserver = new ResizeObserver(checkClamped);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [text]);

  const showToggle = isClamped || isExpanded;

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      {title && (
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {showToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  折りたたむ
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  続きを読む
                </>
              )}
            </Button>
          )}
        </div>
      )}

      <div
        ref={textRef}
        className={cn(
          "whitespace-pre-wrap",
          !isExpanded && "line-clamp-[var(--max-lines)]"
        )}
        style={{ "--max-lines": maxLines } as React.CSSProperties}
      >
        {text}
      </div>

      {!title && showToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              折りたたむ
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              続きを読む
            </>
          )}
        </Button>
      )}
    </div>
  );
}
