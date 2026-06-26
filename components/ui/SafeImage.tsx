'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

type SafeImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = '/images/menu/fettuccine.webp',
  ...props
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt="sadeImage"
      onError={() => setImageSrc(fallbackSrc)}
      loading="eager"
      // unoptimized={
      //   typeof imageSrc === 'string' && imageSrc.startsWith('https://')
      // }
    />
  );
}