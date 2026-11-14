"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icons";
import ImageSlot from "@/components/ui/ImageSlot";
import type { Picture } from "@/data/site";
import { useIsClient } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

interface CaseStudyGalleryProps {
  images: Picture[];
}

/**
 * Galeri halaman detail Case Study:
 * - Tiap kartu di grid mengikuti rasio asli gambar (w-full h-auto, tanpa bar putih atas/bawah).
 * - Klik gambar membuka lightbox resolusi penuh (max-w-full max-h-[85vh] object-contain) dengan thumbnail strip.
 */
export default function CaseStudyGallery({ images }: CaseStudyGalleryProps) {
  const isClient = useIsClient();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const open = activeIndex !== null;
  const active = open ? images[activeIndex] : null;
  const count = images.length;

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      else if (e.key === "ArrowRight" && count > 1) {
        setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % count));
      } else if (e.key === "ArrowLeft" && count > 1) {
        setActiveIndex((prev) => (prev === null ? 0 : (prev - 1 + count) % count));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, count]);

  return (
    <>
      <div className={cn("mt-12 grid items-start gap-6", count > 2 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {images.map((img, i) => {
          const canZoom = Boolean(img.src);
          return (
            <div
              key={`${img.alt}-${i}`}
              className="w-full h-auto overflow-hidden rounded-sm border border-ink/20 shadow-paper transition-shadow duration-200 hover:shadow-paper-lg"
            >
              {canZoom ? (
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Perbesar gambar: ${img.alt}`}
                  className="block w-full h-auto cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-ink"
                >
                  <ImageSlot
                    {...img}
                    fit="auto"
                    quality={90}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </button>
              ) : (
                <ImageSlot
                  {...img}
                  fit="auto"
                  quality={90}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              )}
            </div>
          );
        })}
      </div>

      {isClient &&
        active &&
        active.src &&
        activeIndex !== null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-ink/90 p-3 backdrop-blur-[2px] sm:p-6"
          >
            {/* Area klik latar untuk menutup */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setActiveIndex(null)}
              className="absolute inset-0 cursor-zoom-out"
            />

            {/* Tombol tutup */}
            <button
              type="button"
              aria-label="Tutup pratinjau"
              onClick={() => setActiveIndex(null)}
              className="relative z-10 ml-auto grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-white text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              <Icon name="close" size={18} />
            </button>

            {/* Gambar utama resolusi penuh, muat utuh tanpa overflow ke kanan */}
            <div className="relative z-10 my-auto flex w-full max-w-6xl items-center justify-center px-2 sm:px-12">
              {count > 1 && (
                <button
                  type="button"
                  aria-label="Gambar sebelumnya"
                  onClick={() => setActiveIndex((activeIndex - 1 + count) % count)}
                  className="absolute left-0 z-20 grid size-10 place-items-center rounded-full border-[1.5px] border-ink bg-white text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="arrow-right" size={18} className="rotate-180" />
                </button>
              )}

              <Image
                key={active.src}
                src={active.src}
                alt={active.alt}
                width={1920}
                height={1080}
                quality={90}
                sizes="100vw"
                priority
                className="max-h-[75vh] max-w-full rounded-sm border border-white/20 object-contain shadow-paper-lg sm:max-h-[80vh]"
                style={{ width: "auto", height: "auto" }}
              />

              {count > 1 && (
                <button
                  type="button"
                  aria-label="Gambar berikutnya"
                  onClick={() => setActiveIndex((activeIndex + 1) % count)}
                  className="absolute right-0 z-20 grid size-10 place-items-center rounded-full border-[1.5px] border-ink bg-white text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5"
                >
                  <Icon name="arrow-right" size={18} />
                </button>
              )}
            </div>

            {/* Thumbnail strip: kecil, utuh (object-contain), tidak terpotong */}
            {count > 1 && (
              <div className="relative z-10 mt-3 flex max-w-full items-center gap-2.5 overflow-x-auto rounded-md border border-white/15 bg-ink/75 px-3 py-2">
                {images.map((thumb, ti) =>
                  thumb.src ? (
                    <button
                      key={`${thumb.src}-${ti}`}
                      type="button"
                      onClick={() => setActiveIndex(ti)}
                      aria-label={`Lihat gambar ${ti + 1}: ${thumb.alt}`}
                      className={cn(
                        "shrink-0 overflow-hidden rounded border-2 bg-paper-light p-0.5 transition-all",
                        ti === activeIndex
                          ? "border-blue scale-105 shadow-hard-sm"
                          : "border-white/30 opacity-70 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        width={240}
                        height={150}
                        quality={85}
                        sizes="120px"
                        className="block h-12 w-auto max-w-[100px] object-contain sm:h-14 sm:max-w-[120px]"
                      />
                    </button>
                  ) : null
                )}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
