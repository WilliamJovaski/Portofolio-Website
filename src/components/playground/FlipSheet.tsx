"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import Tape from "@/components/ui/Tape";
import { galleryText } from "@/data/gallery";
import { cn } from "@/lib/cn";
import { sheetPaperBackStyle, sheetPaperStyle } from "./paper";

interface FlipSheetProps {
  /** 0 = tertutup (kolase menghadap depan), 1 = terbuka (lembar terbalik penuh). */
  progress: MotionValue<number>;
  /** "flip" = putar 3D, "fade" = crossfade (reduced motion / perangkat lemah). */
  mode: "flip" | "fade";
  /** Lembar sedikit terangkat (translateZ + scale) di tengah animasi; dimatikan di mobile. */
  lift: boolean;
  /** Gallery tampil & tidak sedang animasi: lembar disembunyikan total dan tidak menentukan tinggi stage. */
  hidden: boolean;
  /** Kolase bisa di-drag hanya saat lembar diam di posisi tertutup. */
  interactive: boolean;
  /** Class tata letak sisi depan (padding, tinggi minimum). */
  frontClassName?: string;
  /** Isi sisi depan; null saat lembar tersembunyi (kolase di-unmount). */
  children: ReactNode;
}

// Properti backface dipasang langsung di elemen sisi (anak langsung lembar preserve-3d)
const faceBase = "rounded-sm border border-ink/10";
const faceHidden = "backface-hidden [-webkit-backface-visibility:hidden]";

/** Lembar kertas yang berputar dari sisi kiri seperti halaman buku: depan = kolase, belakang = kertas polos. */
export default function FlipSheet({ progress, mode, lift, hidden, interactive, frontClassName, children }: FlipSheetProps) {
  const rotateY = useTransform(progress, [0, 1], [0, -180]);
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.01, 1]);
  const z = useTransform(progress, [0, 0.5, 1], [0, 60, 0]);
  const fade = useTransform(progress, [0, 1], [1, 0]);
  // Bayangan mengikuti sudut: sisi depan menggelap menjelang 90°, sisi belakang terang kembali menuju 180°
  const frontShade = useTransform(progress, [0, 0.5], [0, 0.55]);
  const backShade = useTransform(progress, [0.5, 1], [0.55, 0]);
  const flip = mode === "flip";

  return (
    <motion.div
      inert={hidden || !interactive}
      aria-hidden={hidden || undefined}
      className="relative z-10 col-start-1 row-start-1 transform-3d"
      style={{
        rotateY: flip ? rotateY : 0,
        scale: flip && lift ? scale : 1,
        z: flip && lift ? z : 0,
        opacity: flip ? 1 : fade,
        transformOrigin: "0% 50%",
        visibility: hidden ? "hidden" : "visible",
        pointerEvents: hidden ? "none" : undefined,
        // Saat tersembunyi, lembar tidak lagi menentukan tinggi stage
        contain: hidden ? "size" : undefined,
      }}
    >
      {/* DEPAN: elemen kertas ini sendiri yang memegang backface-visibility */}
      <div
        className={cn("relative shadow-paper", faceBase, flip && faceHidden, frontClassName)}
        style={{ ...sheetPaperStyle, transform: flip ? "rotateY(0deg)" : undefined }}
      >
        {children}
        {flip && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 rounded-sm bg-linear-to-l from-ink/70 via-ink/30 to-ink/5"
            style={{ opacity: frontShade }}
          />
        )}
      </div>

      {/* BELAKANG: kertas notebook polos dengan dekorasi samar */}
      {flip && (
        <div
          aria-hidden="true"
          className={cn("absolute inset-0 overflow-hidden", faceBase, faceHidden)}
          style={{ ...sheetPaperBackStyle, transform: "rotateY(180deg)" }}
        >
          <Tape corner="tc" tint="yellow" rotate={-4} className="top-3!" />
          <span className="absolute top-[14%] left-1/2 -translate-x-1/2 -rotate-6 font-hand text-[clamp(4rem,14vw,10rem)] leading-none text-ink/[0.08] select-none">
            {galleryText.heading.toLowerCase()}
          </span>
          <svg viewBox="0 0 120 60" className="absolute bottom-[12%] left-[10%] w-40 text-ink/10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 40c10-20 20-20 25 0s15 20 25 0 15-20 25 0 15 20 25 0" />
            <path d="M95 12l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
          </svg>
          <motion.div
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink/60 via-ink/25 to-ink/5"
            style={{ opacity: backShade }}
          />
        </div>
      )}
    </motion.div>
  );
}
