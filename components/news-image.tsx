"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface NewsImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallbackIconSize?: "sm" | "md" | "lg";
}

const iconSizes = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function NewsImage({
  src,
  alt,
  fill,
  width,
  height,
  priority,
  className,
  fallbackIconSize = "md",
}: NewsImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ImageOff className={`${iconSizes[fallbackIconSize]} text-muted-foreground`} />
        <span className="sr-only">画像なし</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
