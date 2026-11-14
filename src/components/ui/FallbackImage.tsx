"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Mis. "center 20%" untuk menggeser fokus foto (object-position). */
  objectPosition?: string;
  /**
   * cover   : isi penuh container (default).
   * contain : muat utuh di dalam container ber-rasio tetap.
   * auto    : tinggi otomatis mengikuti rasio asli gambar (w-full h-auto, tanpa bar kosong).
   */
  fit?: "cover" | "contain" | "auto";
  quality?: number;
  /** Ditampilkan kalau file gambar tidak ada / gagal dimuat. */
  fallback: ReactNode;
}

/** next/image yang otomatis beralih ke placeholder kalau gambar gagal dimuat. */
export default function FallbackImage({
  src,
  alt,
  sizes,
  priority,
  objectPosition,
  fit = "cover",
  quality,
  fallback,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;

  if (fit === "auto") {
    return (
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        quality={quality ?? 90}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
        style={{ width: "100%", height: "auto" }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      quality={quality}
      sizes={sizes}
      priority={priority}
      className={fit === "contain" ? "bg-paper-light object-contain" : "object-cover"}
      style={{ objectPosition }}
      onError={() => setFailed(true)}
    />
  );
}
