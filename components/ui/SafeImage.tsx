"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = "/images/menu/fettuccine.webp",
  onError,
  alt,
  ...props
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={(e) => {
        setImageSrc(fallbackSrc);
        onError?.(e);
      }}
    />
  );
}
