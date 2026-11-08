import { useState, type ImgHTMLAttributes } from "react";

export const PROJECT_IMAGE_FALLBACK = "/projects/fallback.svg";

type ProjectImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> & {
  src?: string;
  alt: string;
};

/**
 * Proje görseli: adres yoksa ya da yüklenemezse (ör. Storage 402/403) ortak
 * yedek görsele geçer. Böylece sayfada kırık görsel simgesi kalmaz.
 */
export default function ProjectImage({ src, alt, ...rest }: ProjectImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const useFallback = !src || failedSrc === src;
  return (
    <img
      {...rest}
      src={useFallback ? PROJECT_IMAGE_FALLBACK : src}
      alt={alt}
      data-fallback={useFallback ? "true" : undefined}
      onError={() => {
        if (src && !useFallback) setFailedSrc(src);
      }}
    />
  );
}
