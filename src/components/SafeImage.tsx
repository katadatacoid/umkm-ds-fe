"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function SafeImage(props: ImageProps) {
  const { src, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      unoptimized
      onError={() => {
        // Hanya ganti sekali ke fallback, tanpa retry ulang
        setImgSrc("/images/no-image.png");
      }}
    />
  );
}
