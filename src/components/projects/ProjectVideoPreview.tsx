"use client";

import { useState } from "react";
import ImageSlot, { type ImageSlotProps } from "@/components/ui/ImageSlot";
import { cn } from "@/lib/cn";

interface ProjectVideoPreviewProps extends ImageSlotProps {
  videoUrl: string;
  title: string;
}

/** Ekstrak YouTube ID dari berbagai format link (youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, atau /embed/). */
function toYouTubeEmbedUrl(url: string): string {
  const trimmed = url.trim();
  const idMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  const videoId = idMatch ? idMatch[1] : trimmed;
  // Jika sudah berupa URL embed utuh tanpa ID yang cocok, fallback pakai string aslinya
  const base = videoId.length === 11 ? `https://www.youtube.com/embed/${videoId}` : trimmed;

  const urlObj = new URL(base.startsWith("http") ? base : `https://www.youtube.com/embed/${base}`);
  urlObj.searchParams.set("autoplay", "1");
  urlObj.searchParams.set("mute", "1");
  urlObj.searchParams.set("enablejsapi", "1");
  urlObj.searchParams.set("rel", "0");

  return urlObj.toString();
}

/**
 * YouTube Facade / Lazy-Load Preview khusus untuk Holy-Bin & HiraDraw:
 * - Sebelum diklik: hanya merender thumbnail <ImageSlot> + tombol Play custom (tanpa iframe YouTube sama sekali).
 * - Saat tombol Play diklik: mengganti thumbnail/overlay dengan YouTube <iframe> (?autoplay=1).
 * - Klik pada area preview memakai `stopPropagation()` agar tidak memicu navigasi kartu.
 */
export default function ProjectVideoPreview({
  videoUrl,
  title,
  className,
  ...imageProps
}: ProjectVideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedSrc = toYouTubeEmbedUrl(videoUrl);

  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn("relative overflow-hidden bg-ink", className)}
    >
      {isPlaying ? (
        <iframe
          src={embedSrc}
          title={`${title} video preview`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      ) : (
        <>
          <ImageSlot
            {...imageProps}
            className="h-full w-full"
          />

          <button
            type="button"
            onClick={handleStart}
            aria-label={`Play YouTube video preview for ${title}`}
            className="group/play absolute inset-0 z-10 flex items-center justify-center bg-ink/20 transition-colors duration-200 hover:bg-ink/35 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-dashed focus-visible:outline-yellow"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-yellow px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-hard transition-transform duration-150 group-hover/play:scale-105 group-hover/play:-translate-y-0.5">
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                aria-hidden="true"
                className="shrink-0 fill-current"
              >
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
              <span>Play Video</span>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
