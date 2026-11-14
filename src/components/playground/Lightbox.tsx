"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icons";
import ImageSlot from "@/components/ui/ImageSlot";
import type { GalleryPhoto } from "@/data/gallery";
import { useIsClient } from "@/hooks/useMediaQuery";

interface LightboxProps {
  photos: GalleryPhoto[];
  /** Index foto yang tampil; null = tertutup. */
  index: number | null;
  /** Foto yang diklik pertama kali: hanya foto ini yang "terbang" dari kartunya (layoutId). */
  originId: string | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const navBtn =
  "grid size-11 place-items-center rounded-full border border-ink bg-white text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5";

/**
 * Lightbox foto. Dirender lewat portal ke document.body supaya `position: fixed` benar-benar
 * menutup layar (perspective/transform di stage halaman akan "mengurung" elemen fixed).
 */
export default function Lightbox({ photos, index, originId, onClose, onNavigate }: LightboxProps) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const photo = open ? photos[index] : null;
  const count = photos.length;

  // Kunci scroll halaman. Dipasang di <html> karena html punya overflow-x: clip,
  // sehingga overflow pada <body> tidak lagi mengatur scroll viewport.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = { overflow: html.style.overflow, padding: body.style.paddingRight };
    // Ganti lebar scrollbar yang hilang dengan padding supaya halaman tidak bergeser
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = prev.overflow;
      body.style.paddingRight = prev.padding;
    };
  }, [open]);

  // Keyboard: Esc tutup, panah kiri/kanan ganti foto, Tab berputar di dalam dialog
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && count > 1) onNavigate((index + 1) % count);
      else if (e.key === "ArrowLeft" && count > 1) onNavigate((index - 1 + count) % count);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not([tabindex='-1'])")];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onNavigate]);

  if (!isClient) return null;

  const ratio = photo ? photo.width / photo.height : 1;
  const isOrigin = photo?.id === originId;

  return createPortal(
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          key="lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption ?? photo.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Latar gelap: klik di luar foto menutup */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute inset-0 cursor-zoom-out bg-ink/85 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <figure
            className="relative bg-white p-2 pb-11 shadow-paper-lg sm:p-3 sm:pb-12"
            // Lebar mengikuti rasio foto supaya foto utuh muat di layar
            style={{ width: `min(100%, calc((100svh - 12rem) * ${ratio}))` }}
          >
            <motion.div
              key={photo.id}
              layoutId={isOrigin && !reduce ? `photo-${photo.id}` : undefined}
              initial={isOrigin && !reduce ? false : { opacity: 0, scale: reduce ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="relative"
              style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
            >
              <ImageSlot
                alt={photo.alt}
                src={photo.src}
                tone={photo.tone}
                className="h-full w-full"
                sizes="(min-width: 640px) 80vw, 95vw"
                priority
              />
            </motion.div>
            <figcaption className="absolute inset-x-3 bottom-2.5 truncate text-center font-hand text-lg text-ink/80 sm:bottom-3">
              {photo.caption ?? photo.alt}
            </figcaption>
          </figure>

          <button ref={closeRef} type="button" aria-label="Tutup foto" onClick={onClose} className={`${navBtn} absolute top-4 right-4 sm:top-6 sm:right-6`}>
            <Icon name="close" size={18} />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto sebelumnya"
                onClick={() => onNavigate((index - 1 + count) % count)}
                className={`${navBtn} absolute bottom-5 left-4 sm:top-1/2 sm:bottom-auto sm:left-6 sm:-translate-y-1/2 sm:hover:-translate-y-[calc(50%+2px)]`}
              >
                <Icon name="arrow-right" size={18} className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Foto berikutnya"
                onClick={() => onNavigate((index + 1) % count)}
                className={`${navBtn} absolute right-4 bottom-5 sm:top-1/2 sm:right-6 sm:bottom-auto sm:-translate-y-1/2 sm:hover:-translate-y-[calc(50%+2px)]`}
              >
                <Icon name="arrow-right" size={18} />
              </button>
            </>
          )}
          <p className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] text-white/80">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
