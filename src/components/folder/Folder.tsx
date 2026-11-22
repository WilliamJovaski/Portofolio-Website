"use client";

import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { folder } from "@/config/folder";

interface FolderProps {
  width: number;
  height: number;
  /** Kipas terbuka: saku depan sedikit "terbuka", bayangan melebar, glow menguat. */
  open: boolean;
  /** Slot kertas: dirender DI ANTARA panel belakang dan saku depan. */
  children?: ReactNode;
}

const { colors } = folder;

/**
 * Folder SVG murni visual (viewBox 120 x 96), lapisan dari belakang ke depan:
 *  glow hangat & bayangan elips di "meja"
 *  panel belakang + tab kiri atas
 *  slot kertas (di-clip di sisi bawah folder supaya kertas tidak keluar dari bawah saku)
 *  saku depan (gradient, highlight, garis lipatan, label, stiker smiley)
 * Semua lapisan pointer-events: none. Klik ditangani wrapper di FolderIntro.
 */
export default function Folder({ width, height, open, children }: FolderProps) {
  const id = useId();
  const reduce = useReducedMotion();
  const frontTopPct = folder.frontTop * 100;

  return (
    <div className="pointer-events-none relative" style={{ width, height }}>
      {/* Glow kuning hangat di belakang folder */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: `${-height * 0.2}px ${-width * 0.25}px`,
          background: `radial-gradient(closest-side, ${folder.glowColor}, transparent)`,
          filter: `blur(${width * 0.05}px)`,
        }}
        animate={{ opacity: open ? 1 : 0.6, scale: open ? 1.12 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Bayangan elips di bawah folder (seperti diletakkan di meja) */}
      <motion.div
        aria-hidden="true"
        className="absolute left-[6%] right-[6%]"
        style={{
          top: height * 0.94,
          height: height * 0.16,
          background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-ink) 28%, transparent), transparent)",
        }}
        animate={{ scaleX: open ? 1.18 : 1, opacity: open ? 1 : 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Panel belakang + tab */}
      <svg viewBox="0 0 120 96" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-back`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: colors.backLight }} />
            <stop offset="1" style={{ stopColor: colors.back }} />
          </linearGradient>
        </defs>
        <path
          d="M0 16Q0 8 8 8H35Q39 8 41.5 10.5L45 14H112Q120 14 120 22V88Q120 96 112 96H8Q0 96 0 88Z"
          fill={`url(#${id}-back)`}
        />
        {/* Garis tepi tab yang sedikit lebih terang */}
        <path d="M3 13Q4 10 8 10H34" stroke="var(--color-white)" strokeOpacity="0.45" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      </svg>

      {/* Slot kertas: area besar ke atas & samping, tapi terpotong rata di sisi bawah folder */}
      <div
        className="pointer-events-none absolute overflow-hidden"
        style={{ left: -width, right: -width, top: -width * 2, bottom: 0 }}
      >
        <div className="absolute" style={{ left: width, top: width * 2, width, height }}>
          {children}
        </div>
      </div>

      {/* Saku depan: sedikit lebih rendah dari panel belakang, "terbuka" (rotateX) saat kipas keluar */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20"
        style={{ top: `${frontTopPct}%`, transformOrigin: "50% 100%" }}
        animate={{
          rotateX: open && !reduce ? folder.pocketOpenTilt : 0,
          y: open ? height * 0.02 : 0,
          transformPerspective: width * 2,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <svg viewBox="0 30 120 66" preserveAspectRatio="none" aria-hidden="true" className="block h-full w-full overflow-visible">
          <defs>
            <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: colors.frontLight }} />
              <stop offset="0.45" style={{ stopColor: colors.front }} />
              <stop offset="1" style={{ stopColor: colors.frontDark }} />
            </linearGradient>
          </defs>
          <path d="M0 36Q0 30 6 30H114Q120 30 120 36V90Q120 96 114 96H6Q0 96 0 90Z" fill={`url(#${id}-front)`} />
          {/* Highlight tipis di tepi atas */}
          <path d="M6 31.3H114" stroke="var(--color-white)" strokeOpacity="0.75" strokeWidth="1" strokeLinecap="round" />
          {/* Garis lipatan */}
          <path d="M3 39.5H117" style={{ stroke: colors.fold }} strokeOpacity="0.28" strokeWidth="0.5" />
          {/* Label kecil di saku */}
          <g transform="rotate(-3 24 74)">
            <rect x="11" y="68" width="28" height="12" rx="1.2" fill="var(--color-paper-light)" opacity="0.92" />
            <path d="M14 72.5h18M14 76h12" stroke="color-mix(in srgb, var(--color-ink) 22%, transparent)" strokeWidth="1.1" strokeLinecap="round" />
          </g>
          {/* Stiker logo */}
          <g transform="rotate(10 101 79)">
            <circle cx="101" cy="79" r="8.6" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="0.8" />
            <image href="/images/logo.png" x="93" y="71" width="16" height="16" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
