"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Arrow from "@/components/ui/Arrow";
import Chip from "@/components/ui/Chip";
import PixelHeading from "@/components/ui/PixelHeading";
import TechTile from "@/components/tech/TechTile";
import type { TechGroupData, TechTileData } from "@/components/tech/types";
import type { Accent } from "@/components/ui/colors";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/** PRNG kecil ber-seed: hasil sama di server & browser (tanpa Math.random -> tanpa hydration mismatch). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Seed {
  /** Posisi acak awal (px, desktop). */
  sx: number;
  sy: number;
  sRotate: number;
  sScale: number;
  /** Posisi melayang Fase 1 (drift relatif dari posisi awal). */
  dx: number;
  dy: number;
  dRotate: number;
  /** Kemiringan kecil akhir pada stiker. */
  tilt: number;
}

const seedFor = (i: number): Seed => {
  const r = mulberry32(i * 9973 + 17);
  const angle = r() * Math.PI * 2;
  const radius = 90 + r() * 190;
  const sx = Math.round(Math.cos(angle) * radius);
  const sy = Math.round(Math.sin(angle) * (radius * 0.65));
  const sRotate = Math.round(r() * 56 - 28);
  const sScale = 0.82 + r() * 0.22;

  // Drift pelan acak selama Fase 1
  const driftAngle = angle + (r() - 0.5) * 1.4;
  const driftDist = 24 + r() * 28;
  const dx = Math.round(sx + Math.cos(driftAngle) * driftDist);
  const dy = Math.round(sy + Math.sin(driftAngle) * driftDist);
  const dRotate = Math.round(sRotate + (r() * 24 - 12));

  const tilt = Math.round((r() * 8 - 4) * 10) / 10;
  return { sx, sy, sRotate, sScale, dx, dy, dRotate, tilt };
};

type Phase = "scrambled" | "drifting" | "assembling";

// Durasi Fase 1 (melayang) dalam ms sebelum masuk Fase 2 (menyusun)
const DRIFT_DURATION_MS = 1250;
// Stagger antar ikon saat menyusun (detik)
const STAGGER_SEC = 0.032;

interface ScatterTileProps {
  item: TechTileData;
  color: Accent;
  index: number;
  seed: Seed;
  phase: Phase;
  hasAssembled: boolean;
  isMobile: boolean;
  reduce: boolean;
}

/** Satu tile: scrambled -> melayang (1.25s) -> menyusun mulus (spring) -> terkunci di posisi akhir. */
function ScatterTile({
  item,
  color,
  index,
  seed,
  phase,
  hasAssembled,
  isMobile,
  reduce,
}: ScatterTileProps) {
  // Setelah tersusun atau jika prefers-reduced-motion aktif: kunci di posisi akhir tanpa animasi ulang
  if (reduce || hasAssembled) {
    return (
      <div style={{ transform: "translate3d(0px, 0px, 0px)", opacity: 1 }}>
        <TechTile {...item} color={color} tilt={seed.tilt} tape={index % 3 === 1} />
      </div>
    );
  }

  // Di layar mobile, jarak sebar dikecilkan supaya tidak keluar viewport / horizontal scroll
  const scaleFactor = isMobile ? 0.42 : 1;
  const sx = Math.round(seed.sx * scaleFactor);
  const sy = Math.round(seed.sy * scaleFactor);
  const dx = Math.round(seed.dx * scaleFactor);
  const dy = Math.round(seed.dy * scaleFactor);

  const animateState =
    phase === "scrambled"
      ? { x: sx, y: sy, rotate: seed.sRotate, scale: seed.sScale, opacity: 0.75 }
      : phase === "drifting"
        ? { x: dx, y: dy, rotate: seed.dRotate, scale: 0.94, opacity: 0.92 }
        : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };

  const transition =
    phase === "drifting"
      ? { duration: DRIFT_DURATION_MS / 1000, ease: "easeInOut" as const }
      : phase === "assembling"
        ? {
            type: "spring" as const,
            stiffness: 135,
            damping: 19,
            mass: 0.85,
            delay: index * STAGGER_SEC,
          }
        : { duration: 0 };

  return (
    <motion.div
      initial={{ x: sx, y: sy, rotate: seed.sRotate, scale: seed.sScale, opacity: 0.75 }}
      animate={animateState}
      transition={transition}
      className="will-change-transform"
    >
      <TechTile {...item} color={color} tilt={seed.tilt} tape={index % 3 === 1} />
    </motion.div>
  );
}

interface TechStackScatterProps {
  label: string;
  heading: string;
  groups: TechGroupData[];
}

/**
 * Section TECH STACK di Home:
 * 1. Kondisi awal: ikon tersebar acak (scrambled).
 * 2. Saat 35% masuk viewport: Fase 1 melayang pelan (~1.25s), lalu Fase 2 menyusun ke tempatnya.
 * 3. Setelah tersusun (`hasAssembled = true`), posisi dikunci sampai halaman di-refresh.
 */
export default function TechStackScatter({ label, heading, groups }: TechStackScatterProps) {
  const reduce = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("scrambled");
  const [hasAssembled, setHasAssembled] = useState(false);

  const totalCount = useMemo(
    () => groups.reduce((sum, g) => sum + g.items.length, 0),
    [groups]
  );

  // Posisi acak awal dibuat sekali saat mount (useMemo) agar tidak berkedip saat re-render
  const seeds = useMemo(
    () => Array.from({ length: totalCount }, (_, i) => seedFor(i)),
    [totalCount]
  );

  const starts = useMemo(
    () => groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0)),
    [groups]
  );

  useEffect(() => {
    if (reduce || hasAssembled || hasTriggeredRef.current) return;
    const el = sectionRef.current;
    if (!el) return;

    let driftTimer: ReturnType<typeof setTimeout> | undefined;
    let lockTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasTriggeredRef.current) return;

        hasTriggeredRef.current = true;
        observer.disconnect();

        // Fase 1: melayang pelan
        setPhase("drifting");

        // Fase 2: menyusun mulus ke posisi masing-masing grup
        driftTimer = setTimeout(() => {
          setPhase("assembling");

          // Kunci posisi setelah seluruh stagger + spring selesai
          const totalAssembleMs = Math.round((totalCount * STAGGER_SEC + 0.95) * 1000);
          lockTimer = setTimeout(() => {
            setHasAssembled(true);
          }, totalAssembleMs);
        }, DRIFT_DURATION_MS);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (driftTimer) clearTimeout(driftTimer);
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, [reduce, hasAssembled, totalCount]);

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="section-y relative overflow-x-clip"
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 text-center">
        <p className="font-hand text-lg text-ink/80">{label}</p>
        <PixelHeading size="md" className="mt-1">
          <span id="tech-stack-heading">{heading}</span>
        </PixelHeading>

        <div className="mt-10 space-y-12 md:mt-12 md:space-y-14">
          {groups.map((group, gi) => (
            <div key={group.id} className="relative">
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <Chip color={group.color} rotate={-2} className="shadow-hard-sm">
                  {group.label}
                </Chip>
                <p className="inline-flex items-center gap-1 font-hand text-base text-ink/80">
                  {group.note}
                  {group.arrow && <Arrow direction="up-right" className="h-6 w-8 rotate-[100deg]" />}
                </p>
              </div>
              <ul
                className={cn(
                  "mx-auto mt-6 grid max-w-md grid-cols-3 items-start justify-items-center gap-x-3 gap-y-7 [--tile:58px] sm:max-w-2xl sm:grid-cols-4 sm:[--tile:64px] md:flex md:max-w-4xl md:flex-wrap md:items-start md:justify-center md:gap-x-5 md:gap-y-8 md:[--tile:72px]",
                  hasAssembled || reduce
                    ? "[&:has(>li:hover)>li:not(:hover)]:opacity-70"
                    : "pointer-events-none"
                )}
              >
                {group.items.map((item, ii) => {
                  const index = starts[gi] + ii;
                  return (
                    <li
                      key={item.name}
                      className="w-[88px] transition-opacity duration-200 md:w-[96px]"
                    >
                      <ScatterTile
                        item={item}
                        color={group.color}
                        index={index}
                        seed={seeds[index]}
                        phase={phase}
                        hasAssembled={hasAssembled}
                        isMobile={isMobile}
                        reduce={reduce}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
