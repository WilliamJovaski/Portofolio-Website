"use client";

import { useRef, useState, type CSSProperties, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Arrow from "@/components/ui/Arrow";
import ImageSlot from "@/components/ui/ImageSlot";
import Tape from "@/components/ui/Tape";
import { categoryLabel, galleryCategories, galleryPhotos, galleryText, type GalleryPhoto } from "@/data/gallery";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import Lightbox from "./Lightbox";

// Kemiringan kartu bergiliran (deterministik, tanpa Math.random)
const CARD_TILT = [-1.2, 0.8, -0.4, 1.4, -1, 0.5];
const CHIP_TILT = [-2, 1.5, -1, 2, -1.5, 1];

/** Bagi foto ke kolom terpendek (berdasarkan rasio foto), jadi "Load more" tidak menggeser foto lama. */
function toColumns(photos: GalleryPhoto[], count: number) {
  const cols = Array.from({ length: count }, () => ({ height: 0, items: [] as { photo: GalleryPhoto; index: number }[] }));
  photos.forEach((photo, index) => {
    const col = cols.reduce((a, b) => (b.height < a.height ? b : a));
    col.items.push({ photo, index });
    col.height += photo.height / photo.width + (photo.caption ? 0.2 : 0.08);
  });
  return cols.map((c) => c.items);
}

function GalleryCard({ photo, index, onOpen }: { photo: GalleryPhoto; index: number; onOpen: (el: HTMLElement) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Buka foto: ${photo.caption ?? photo.alt}`}
      className="group relative block w-full cursor-zoom-in rotate-(--tilt) bg-white p-1.5 shadow-paper transition-[rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-paper-lg focus-visible:rotate-0 sm:p-2"
      style={{ "--tilt": `${CARD_TILT[index % CARD_TILT.length]}deg` } as CSSProperties}
    >
      {index % 5 === 2 && <Tape corner="tc" tint={index % 2 ? "pink" : "yellow"} />}
      <motion.div layoutId={`photo-${photo.id}`} className="relative" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        <ImageSlot
          alt={photo.alt}
          src={photo.src}
          tone={photo.tone}
          className="h-full w-full"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
      </motion.div>
      {photo.caption && (
        <span className="block px-1 pt-1.5 text-center font-hand text-sm leading-tight text-ink/80">{photo.caption}</span>
      )}
    </button>
  );
}

interface GalleryViewProps {
  headingId: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onLightboxChange: (open: boolean) => void;
}

/** Halaman gallery: tombol kembali, judul, filter kategori, masonry, load more, lightbox. */
export default function GalleryView({ headingId, headingRef, onBack, onLightboxChange }: GalleryViewProps) {
  const reduce = useReducedMotion();
  const lg = useMediaQuery("(min-width: 1024px)");
  const sm = useMediaQuery("(min-width: 640px)");
  const [filter, setFilter] = useState("all");
  const [count, setCount] = useState(galleryText.pageSize);
  const [lightbox, setLightbox] = useState<{ index: number; originId: string } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const photos = filter === "all" ? galleryPhotos : galleryPhotos.filter((p) => p.category === filter);
  const visible = photos.slice(0, count);
  const columns = toColumns(visible, lg ? 4 : sm ? 3 : 2);
  const filters = ["all", ...galleryCategories];

  const chooseFilter = (f: string) => {
    setFilter(f);
    setCount(galleryText.pageSize);
  };
  const openPhoto = (index: number, el: HTMLElement) => {
    triggerRef.current = el;
    setLightbox({ index, originId: photos[index].id });
    onLightboxChange(true);
  };
  const closePhoto = () => {
    setLightbox(null);
    onLightboxChange(false);
    // Fokus kembali ke kartu yang tadi diklik
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="px-4 pt-6 pb-16 sm:px-8 md:px-12 md:pt-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-white transition-transform hover:-translate-x-0.5"
      >
        <span aria-hidden="true">←</span>
        {galleryText.back}
      </button>

      <div className="relative mt-8 text-center">
        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="font-pixel text-[clamp(3rem,10vw,7rem)] leading-[0.85] tracking-tight text-ink uppercase"
        >
          {galleryText.heading}
        </h2>
        {/* Catatan tulisan tangan + panah ke foto */}
        <p className="mt-3 inline-flex -rotate-3 items-center gap-2 font-hand text-lg text-ink/80 md:absolute md:top-1/2 md:right-[8%] md:mt-0">
          {galleryText.note}
          <Arrow direction="up-right" className="h-6 w-8 rotate-[100deg]" />
        </p>
      </div>

      <div role="group" aria-label="Filter kategori" className="mt-8 flex flex-wrap justify-center gap-2.5">
        {filters.map((f, i) => {
          const active = f === filter;
          const n = f === "all" ? galleryPhotos.length : galleryPhotos.filter((p) => p.category === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => chooseFilter(f)}
              className={cn(
                "rounded-full border border-ink px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                active ? "bg-ink text-white" : "bg-white hover:bg-yellow"
              )}
              style={{ rotate: `${CHIP_TILT[i % CHIP_TILT.length]}deg` }}
            >
              {f === "all" ? galleryText.all : categoryLabel(f)}
              <span className="ml-1.5 opacity-90">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Masonry: key = filter supaya ganti filter memicu fade-in ulang */}
      <motion.div
        key={filter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mt-10 flex items-start gap-3 sm:gap-5 lg:gap-6"
      >
        {columns.map((col, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
            {col.map(({ photo, index }) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: reduce ? 0 : (index % galleryText.step) * 0.04 }}
              >
                <GalleryCard photo={photo} index={index} onOpen={(el) => openPhoto(index, el)} />
              </motion.div>
            ))}
          </div>
        ))}
      </motion.div>

      {count < photos.length && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setCount((n) => n + galleryText.step)}
            className={buttonClass("outline", "px-5")}
          >
            {galleryText.loadMore}
            <span className="ml-2 opacity-90">
              {visible.length}/{photos.length}
            </span>
          </button>
        </div>
      )}

      <Lightbox
        photos={photos}
        index={lightbox?.index ?? null}
        originId={lightbox?.originId ?? null}
        onClose={closePhoto}
        onNavigate={(i) => setLightbox((l) => (l ? { ...l, index: i } : l))}
      />
    </div>
  );
}
