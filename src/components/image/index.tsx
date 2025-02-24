"use client";

import Image from "next/image";

interface NostrImageProps {
  nostrUrl: string;
  alt: string;
  width: string;
  height: string;
  className?: string;
}

export function NostrImage({
  nostrUrl,
  alt,
  width,
  height,
  className,
}: NostrImageProps) {
  const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(nostrUrl)}`;

  return (
    <Image
      src={proxiedUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
