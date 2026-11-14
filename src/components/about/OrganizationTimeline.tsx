"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { StarSticker } from "@/components/about/Stickers";
import Lightbox from "@/components/playground/Lightbox";
import Arrow from "@/components/ui/Arrow";
import Chip from "@/components/ui/Chip";
import { accentBg } from "@/components/ui/colors";
import PixelHeading from "@/components/ui/PixelHeading";
import Polaroid from "@/components/ui/Polaroid";
import StickyNote from "@/components/ui/StickyNote";
import Tape from "@/components/ui/Tape";
import type { GalleryPhoto } from "@/data/gallery";
import {
  organizations,
  organizationSection,
  type OrganizationEntry,
  type OrganizationPhoto,
} from "@/data/organizations";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

// Kemiringan kartu tipis (-1.5 s/d 1.5 derajat), selaras dengan certTilt di /about
const cardTilt = [-1.2, 1.3, -0.9, 1.4];

// Rotasi deterministik 3 foto spread (sekitar -5deg, +2deg, -3deg)
const spreadRotations: readonly [number, number, number][] = [
  [-5, 2, -3],
  [-4.5, 2.5, -3.5],
];

// Susunan per slot foto (0 = kiri, 1 = tengah/atas, 2 = kanan / baris ke-2 tengah di mobile)
// Desktop: lebar ~37% kolom dengan overlap tepi tipis (~10-12%) dan offset vertikal 0, +18px, +6px.
// Mobile: 2 foto berdampingan tanpa overlap di baris pertama, foto ke-3 rata tengah di baris kedua.
const spreadSlots: readonly {
  wrapperClass: string;
  tape?: boolean;
}[] = [
  {
    wrapperClass:
      "z-10 w-full max-w-[148px] mt-0 md:w-[37%] md:max-w-none md:mt-0 md:-mr-3",
  },
  {
    wrapperClass:
      "z-20 w-full max-w-[148px] mt-2 md:w-[37%] md:max-w-none md:mt-[18px]",
    tape: true,
  },
  {
    wrapperClass:
      "z-10 col-span-2 justify-self-center w-full max-w-[160px] mt-0 md:col-span-1 md:w-[37%] md:max-w-none md:mt-[6px] md:-ml-3",
  },
];

// Jalur vertikal bergelombang halus seperti tarikan pena di atas buku catatan
const HAND_LINE_PATH =
  "M12 0 C 9.5 85, 14.5 170, 12 255 C 9.5 340, 14.5 425, 12 510 C 9.5 595, 14.5 680, 12 765 C 10 850, 14 930, 12 1000";

const entrySpring = { type: "spring", stiffness: 150, damping: 22, mass: 0.85 } as const;
const photoSpring = { type: "spring", stiffness: 170, damping: 20, mass: 0.8 } as const;

const spreadContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Susunan "spread" 3 Polaroid: berjajar penuh di desktop, 2+1 di mobile. */
function PolaroidSpread({
  photos,
  entryIndex,
  reduce,
  onOpenPhoto,
}: {
  photos: OrganizationPhoto[];
  entryIndex: number;
  reduce: boolean;
  onOpenPhoto?: (photoIndex: number) => void;
}) {
  const visiblePhotos = photos.slice(0, 3);
  if (visiblePhotos.length === 0) return null;

  const rotations = spreadRotations[entryIndex % spreadRotations.length];

  return (
    <motion.div
      variants={reduce ? undefined : spreadContainerVariants}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, amount: 0.25 }}
      className="grid grid-cols-2 items-start justify-items-center gap-x-3 gap-y-4 md:flex md:items-start md:justify-center md:gap-0 md:py-2"
    >
      {visiblePhotos.map((photo, pi) => {
        const slot = spreadSlots[pi] ?? spreadSlots[0];
        const targetRotate = rotations[pi] ?? 0;

        const itemVariants: Variants = {
          hidden: {
            opacity: 0,
            y: 30,
            rotate: targetRotate - 3,
          },
          show: {
            opacity: 1,
            y: 0,
            rotate: targetRotate,
            transition: photoSpring,
          },
        };

        return (
          <motion.div
            key={photo.src}
            variants={reduce ? undefined : itemVariants}
            style={reduce ? { rotate: targetRotate } : undefined}
            whileHover={
              reduce
                ? undefined
                : {
                    rotate: 0,
                    y: -6,
                    transition: { type: "spring", stiffness: 260, damping: 20 },
                  }
            }
            className={cn(
              "group/photo relative shrink-0 hover:z-30 focus-within:z-30",
              slot.wrapperClass
            )}
          >
            {/* Satu tape miring hanya di foto tengah */}
            {slot.tape && (
              <Tape
                corner="tc"
                tint={entryIndex % 2 ? "yellow" : "blue"}
                rotate={entryIndex % 2 ? 5 : -6}
                className="h-4 w-12 -ml-6 -top-2"
              />
            )}

            <button
              type="button"
              onClick={() => onOpenPhoto?.(pi)}
              className="block w-full text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-ink rounded-sm"
              aria-label={`Buka foto ${photo.caption ?? photo.alt} ukuran penuh`}
            >
              <Polaroid
                src={photo.src}
                alt={photo.alt}
                objectPosition={photo.objectPosition}
                tone={photo.tone}
                caption={photo.caption}
                rotate={0}
                aspect={photo.aspect}
                fit={photo.fit}
                className="p-1.5 transition-shadow duration-200 group-hover/photo:shadow-paper-lg [&>span]:hidden [&_figcaption]:min-h-5 [&_figcaption]:pt-1.5 [&_figcaption]:text-xs [&_figcaption]:leading-tight"
              />
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/** Satu baris entri organisasi: kartu StickyNote + node di garis + 3 foto Polaroid spread di seberangnya. */
function TimelineItem({
  entry,
  index,
  reduce,
  onOpenPhoto,
}: {
  entry: OrganizationEntry;
  index: number;
  reduce: boolean;
  onOpenPhoto?: (entry: OrganizationEntry, photoIndex: number) => void;
}) {
  const cardOnLeft = index % 2 === 0;
  const tilt = cardTilt[index % cardTilt.length];

  const cardMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28, x: cardOnLeft ? -18 : 18 },
        whileInView: { opacity: 1, y: 0, x: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: entrySpring,
      };

  return (
    <li className="relative flex flex-col gap-6 pl-11 md:grid md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:items-center md:gap-0 md:pl-0">
      {/* Konektor pendek putus-putus dari node ke kartu */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-9 left-3.5 w-7 border-t-2 border-dashed border-ink/40 md:top-1/2 md:w-7 md:-translate-y-1/2",
          cardOnLeft ? "md:right-1/2 md:left-auto" : "md:left-1/2"
        )}
      />

      {/* Node bulat di atas garis utama */}
      <div
        aria-hidden="true"
        className="absolute top-9 left-3.5 z-20 -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-1/2"
      >
        {entry.current && (
          <span
            className={cn(
              "absolute -inset-2 rounded-full border-[1.5px] border-ink/45 bg-yellow/35",
              !reduce && "animate-ping [animation-duration:2.4s]"
            )}
          />
        )}
        <span
          className={cn(
            "relative block size-4 rounded-full border-2 border-ink shadow-hard-sm",
            accentBg[entry.color]
          )}
        />
      </div>

      {/* Kolom foto Polaroid spread: di atas teks saat mobile (order-1), di sisi seberang kartu saat desktop */}
      <div
        className={cn(
          "order-1",
          cardOnLeft
            ? "md:order-none md:col-start-3 md:row-start-1 md:pl-2"
            : "md:order-none md:col-start-1 md:row-start-1 md:pr-2"
        )}
      >
        <PolaroidSpread
          photos={entry.photos}
          entryIndex={index}
          reduce={reduce}
          onOpenPhoto={(photoIndex) => onOpenPhoto?.(entry, photoIndex)}
        />
      </div>

      {/* Kartu teks: mengikuti gaya kartu Certificates (Tape + StickyNote torn + rotasi kecil) */}
      <motion.div
        {...cardMotion}
        className={cn(
          "relative order-2",
          cardOnLeft
            ? "md:order-none md:col-start-1 md:row-start-1 md:pr-3"
            : "md:order-none md:col-start-3 md:row-start-1 md:pl-3"
        )}
      >
        {/* Catatan tulisan tangan + panah dekoratif khusus entri yang sedang aktif */}
        {entry.current && (
          <div className="mb-3 flex items-center gap-1.5 md:absolute md:-top-10 md:right-3 md:mb-0">
            <span className="font-hand text-base text-ink/80">{organizationSection.currentNote}</span>
            <Arrow direction="up-left" className="h-6 w-8 -rotate-90" />
          </div>
        )}

        <div className="relative">
          <Tape corner="tc" tint={index % 2 ? "pink" : "blue"} />
          <StickyNote
            as="article"
            color={entry.color}
            torn
            rotate={tilt}
            className="px-5 pt-5 pb-9"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="white" className="px-2.5 py-0.5 text-[10px] shadow-hard-sm">
                {entry.period}
              </Chip>
              {entry.current && (
                <Chip color="pink" rotate={-2} className="px-2 py-0.5 text-[10px] font-bold shadow-hard-sm">
                  {organizationSection.nowBadge}
                </Chip>
              )}
            </div>

            <h3 className="mt-3 font-sans text-lg leading-snug font-semibold">{entry.role}</h3>
            <p className="mt-1 font-mono text-[10px] tracking-wider uppercase opacity-90">
              {entry.organization}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>

            <p className="mt-2.5 font-sans text-sm leading-relaxed text-ink/80">{entry.description}</p>

            {entry.tags && entry.tags.length > 0 && (
              <ul aria-label="Topik kegiatan" className="mt-4 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <li key={tag}>
                    <Chip color="white" className="bg-white/80 px-2.5 py-0.5 text-[10px]">
                      {tag}
                    </Chip>
                  </li>
                ))}
              </ul>
            )}
          </StickyNote>
        </div>
      </motion.div>
    </li>
  );
}

/** Section ORGANIZATION EXPERIENCE di halaman /about. */
export default function OrganizationTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [lightbox, setLightbox] = useState<{
    photos: GalleryPhoto[];
    index: number;
    originId: string;
  } | null>(null);

  const handleOpenPhoto = (entry: OrganizationEntry, photoIndex: number) => {
    const photos: GalleryPhoto[] = entry.photos.map((p, idx) => ({
      id: `${entry.id}-photo-${idx}`,
      src: p.src,
      alt: p.alt,
      caption: `${entry.organization} — ${p.caption ?? p.alt}`,
      tone: p.tone ?? "ocean",
      category: "organization",
      width: 1200,
      height: 800,
    }));
    setLightbox({
      photos,
      index: photoIndex,
      originId: `${entry.id}-photo-${photoIndex}`,
    });
  };

  // Garis ter-gambar mengikuti posisi scroll (reversible naik/turun)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 60%"],
  });

  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section aria-labelledby="organizations" className="mt-28 md:mt-32">
      {/* Header: menyalin pola label + catatan handwriting dari section Certificates, ditambah PixelHeading */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="inline-block -rotate-2 rounded-[4px] border-[1.5px] border-ink bg-yellow px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider uppercase shadow-hard-sm">
          {organizationSection.label}
        </span>
        <p className="font-hand text-lg text-ink/80">{organizationSection.note}</p>
      </div>

      <div className="relative mt-3 w-fit">
        <PixelHeading as="h2" size="md">
          <span id="organizations">{organizationSection.heading}</span>
        </PixelHeading>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 left-full ml-3 hidden rotate-12 scale-75 sm:block"
        >
          <StarSticker />
        </div>
      </div>

      {/* Area timeline: garis vertikal di kiri (mobile) / di tengah (desktop) */}
      <div ref={timelineRef} className="relative mt-10 md:mt-14">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 1000"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-y-2 left-3.5 h-[calc(100%-1rem)] w-6 -translate-x-1/2 md:left-1/2"
        >
          {/* Jalur belakang (track abu tipis putus-putus) */}
          <path
            d={HAND_LINE_PATH}
            fill="none"
            stroke="color-mix(in srgb, var(--color-ink) 18%, transparent)"
            strokeWidth="2"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
          {/* Garis utama hitam yang ter-gambar mengikuti scroll */}
          <motion.path
            d={HAND_LINE_PATH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : lineProgress }}
          />
        </svg>

        <ol className="relative space-y-14 md:space-y-20">
          {organizations.map((entry, index) => (
            <TimelineItem
              key={entry.id}
              entry={entry}
              index={index}
              reduce={reduce}
              onOpenPhoto={handleOpenPhoto}
            />
          ))}
        </ol>
      </div>

      {lightbox && (
        <Lightbox
          photos={lightbox.photos}
          index={lightbox.index}
          originId={lightbox.originId}
          onClose={() => setLightbox(null)}
          onNavigate={(nextIdx) =>
            setLightbox((prev) => (prev ? { ...prev, index: nextIdx } : null))
          }
        />
      )}
    </section>
  );
}
