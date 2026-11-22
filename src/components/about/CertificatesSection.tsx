"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "@/components/playground/Lightbox";
import { buttonClass } from "@/components/ui/button";
import ImageSlot from "@/components/ui/ImageSlot";
import StickyNote from "@/components/ui/StickyNote";
import Tape from "@/components/ui/Tape";
import { about } from "@/data/about";
import type { GalleryPhoto } from "@/data/gallery";

const INITIAL_VISIBLE = 4;
const certTilt = [-1.5, 1.2, 0.8, -1];

export default function CertificatesSection() {
  const { label, note, items } = about.certificates;
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<{ index: number; originId: string } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const hasMore = items.length > INITIAL_VISIBLE;
  const visibleItems = hasMore && !showAll ? items.slice(0, INITIAL_VISIBLE) : items;

  const lightboxPhotos: GalleryPhoto[] = items.map((c) => ({
    id: c.id,
    src: c.image,
    alt: c.title,
    caption: `${c.title} — ${c.issuer} (${c.year})`,
    category: "certificates",
    width: c.width,
    height: c.height,
    tone: "mono",
  }));

  const openCertificate = (index: number, el: HTMLElement) => {
    triggerRef.current = el;
    setLightbox({ index, originId: items[index].id });
  };

  const closeCertificate = () => {
    setLightbox(null);
    triggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <section aria-labelledby="certificates" className="mt-28 md:mt-32">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2
          id="certificates"
          className="inline-block -rotate-2 rounded-[4px] border-[1.5px] border-ink bg-mint px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider uppercase shadow-hard-sm"
        >
          {label}
        </h2>
        <p className="font-hand text-lg text-ink/80">{note}</p>
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
        {visibleItems.map((c, i) => (
          <li key={c.id} className="relative">
            <Tape corner="tc" tint={i % 2 ? "pink" : "blue"} />
            <StickyNote
              color={c.color}
              torn
              rotate={certTilt[i % certTilt.length]}
              className="h-full px-5 pt-5 pb-9 transition-transform duration-300 hover:-translate-y-1"
            >
              <button
                type="button"
                onClick={(e) => openCertificate(i, e.currentTarget)}
                aria-label={`Lihat sertifikat: ${c.title}`}
                className="group block w-full cursor-zoom-in rounded-[4px] text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-focus"
              >
                {/* Preview foto sertifikat */}
                <div className="overflow-hidden rounded-[4px] border border-ink/20 bg-white p-1.5 shadow-sm transition-shadow group-hover:shadow-md">
                  <motion.div
                    layoutId={`photo-${c.id}`}
                    className="relative w-full overflow-hidden rounded-[2px]"
                    style={{ aspectRatio: `${c.width} / ${c.height}` }}
                  >
                    <ImageSlot
                      src={c.image}
                      alt={c.title}
                      tone="mono"
                      className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(min-width: 640px) 420px, 90vw"
                    />
                  </motion.div>
                </div>

                <p className="mt-3.5 font-mono text-[10px] tracking-wider uppercase opacity-90">
                  {c.issuer} · {c.year}
                </p>
                <h3 className="mt-1 font-sans text-base leading-snug font-semibold sm:text-lg">
                  {c.title}
                </h3>
                <span className="mt-2.5 inline-flex items-center gap-1 font-mono text-[11px] font-bold tracking-wider text-link uppercase underline underline-offset-4 transition-colors group-hover:text-link-hover group-active:text-ink">
                  Click to view
                </span>
              </button>
            </StickyNote>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className={buttonClass("outline", "px-5")}
          >
            {showAll ? "Show less" : "Show more"}
            <span className="ml-2 opacity-90">
              {visibleItems.length}/{items.length}
            </span>
          </button>
        </div>
      )}

      <Lightbox
        photos={lightboxPhotos}
        index={lightbox?.index ?? null}
        originId={lightbox?.originId ?? null}
        onClose={closeCertificate}
        onNavigate={(i) => setLightbox((l) => (l ? { ...l, index: i } : l))}
      />
    </section>
  );
}
