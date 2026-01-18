"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleTextProps {
  text: string;
  className?: string;
  /** 折りたたみ時に表示する最大行数（デフォルト: 4） */
  maxLines?: number;
}

export function ArticleText({
  text,
  className,
  maxLines = 4,
}: ArticleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // テキストが切り詰められているかを検出
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const checkClamped = () => {
      // scrollHeightがclientHeightより大きい場合、テキストは切り詰められている
      setIsClamped(element.scrollHeight > element.clientHeight + 1);
    };

    checkClamped();

    // リサイズ時にも再チェック
    const resizeObserver = new ResizeObserver(checkClamped);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [text, isExpanded]);

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
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

      {(isClamped || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>折りたたむ</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>続きを読む</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
