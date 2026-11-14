"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import Paper from "./Paper";
import { fan, paper, papers, peek } from "@/config/folder";
import type { Metrics } from "@/hooks/useResponsiveSize";

export type FolderState = "idle" | "peek" | "open";

interface PaperFanProps {
  state: FolderState;
  /** Bertambah setiap kali kipas dibuka -> stagger keluar hanya saat baru dibuka. */
  openId: number;
  metrics: Metrics;
  /** Dipanggil (setelah animasi "membuka halaman") saat kertas diklik. */
  onSelect: (href: string) => void;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Kertas keluar dari saku folder. Tiap kertas berputar dari titik tengah-bawahnya (pivot di bawah),
 * jadi sudut berbeda per kertas membentuk kipas. Posisi relatif ke kotak folder:
 * y = posisi sisi atas kotak kertas (sebelum diskalakan) diukur dari sisi atas folder.
 */
export default function PaperFan({ state, openId, metrics, onSelect }: PaperFanProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  // Kipas sudah selesai keluar untuk sesi "open" ini -> hover & bobbing tanpa delay stagger
  const [readyId, setReadyId] = useState(-1);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const { pocketTop, paperHeight: ph, fanScale: s, fanStep } = metrics;
  const count = papers.length;
  const mid = (count - 1) / 2;
  const isOpen = state === "open";
  const ready = isOpen && readyId === openId;
  const activeHover = isOpen && selected === null ? hovered : null;
  // 0 di tengah, 1 di kertas paling luar
  const edgeOf = (i: number) => (mid === 0 ? 0 : Math.abs(i - mid) / mid);

  const pose = (i: number): TargetAndTransition => {
    // Menutup: urutan terbalik (kertas terakhir masuk duluan)
    if (state === "idle") {
      return {
        x: 0,
        y: pocketTop + ph * 0.03,
        rotate: 0,
        scale: 1,
        opacity: reduce ? 0 : 1,
        transition: reduce
          ? { duration: 0.2 }
          : { type: "spring", stiffness: 260, damping: 26, delay: (count - 1 - i) * fan.closeStagger },
      };
    }
    if (state === "peek") {
      return {
        x: (i - mid) * metrics.peekSpreadX,
        y: pocketTop - metrics.peekDistance,
        rotate: count === 1 ? 0 : lerp(peek.angles.start, peek.angles.end, i / (count - 1)),
        scale: 1,
        opacity: 1,
        transition: reduce ? { duration: 0.2 } : { type: "spring", ...peek.spring, delay: i * peek.stagger },
      };
    }

    // OPEN: pivot (sisi bawah kertas) masuk ke saku; bagian yang keluar = outRatio x tinggi kertas.
    // Kertas tengah sedikit lebih tinggi (centerLift) -> lengkung natural.
    const bottom =
      pocketTop + ph * s * (1 - metrics.fanOutRatio) - ph * s * fan.centerLift * (1 - edgeOf(i));
    const base = { x: (i - mid) * fanStep * s, y: bottom - ph, rotate: metrics.fanAngles[i], scale: s, opacity: 1 };

    // Quick spring untuk hover/klik; spring overshoot + stagger untuk keluar pertama kali
    const quick: Transition = reduce ? { duration: 0.2 } : { type: "spring", stiffness: 320, damping: 24 };
    const enter: Transition = reduce
      ? { duration: 0.25 }
      : { type: "spring", ...fan.spring, delay: ready ? 0 : i * fan.staggerDelay };

    if (selected !== null) {
      return i === selected
        ? { ...base, rotate: 0, y: base.y - metrics.paperHoverLift, scale: s * paper.selectScale, transition: quick }
        : { ...base, opacity: 0, transition: { duration: 0.2 } };
    }
    if (activeHover !== null) {
      return i === activeHover
        ? { ...base, rotate: 0, y: base.y - metrics.paperHoverLift, scale: s * paper.hover.scale, transition: quick }
        : {
            ...base,
            x: base.x + Math.sign(i - activeHover) * metrics.pushAway,
            opacity: paper.dimOpacity,
            transition: quick,
          };
    }
    return { ...base, transition: ready ? quick : enter };
  };

  const select = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    // Kertas membesar sebentar, lalu intro fade-out & pindah halaman
    timer.current = window.setTimeout(() => onSelect(papers[i].href), (reduce ? 0.05 : paper.selectDelay) * 1000);
  };

  return (
    <>
      {papers.map((item, i) => {
        const lifted = activeHover === i || selected === i;
        return (
          <motion.div
            key={item.id}
            className="pointer-events-none absolute top-0"
            style={{
              left: "50%",
              marginLeft: -metrics.paperWidth / 2,
              width: metrics.paperWidth,
              height: ph,
              transformOrigin: "50% 100%",
              // Kertas tengah di atas kertas pinggir supaya label tiap kertas tetap terbaca
              zIndex: lifted ? 40 : 10 + Math.round((mid - Math.abs(i - mid)) * 2) * 2 + (i > mid ? 1 : 0),
            }}
            initial={{ x: 0, y: pocketTop + ph * 0.03, rotate: 0, scale: 1, opacity: reduce ? 0 : 1 }}
            animate={pose(i)}
            onAnimationComplete={() => {
              // Kertas terakhir selesai keluar -> kipas siap (hover & bobbing tanpa delay)
              if (isOpen && i === count - 1) setReadyId(openId);
            }}
          >
            {/* Kertas hanya menerima klik saat kipas terbuka; selain itu klik tembus ke folder */}
            <motion.button
              type="button"
              aria-label={item.label}
              tabIndex={isOpen ? 0 : -1}
              className="block cursor-pointer rounded-sm outline-offset-4"
              style={{ pointerEvents: isOpen && selected === null ? "auto" : "none" }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
              onClick={(e) => {
                e.stopPropagation();
                select(i);
              }}
              // Melayang sangat pelan dengan fase berbeda tiap kertas setelah kipas terbuka
              animate={ready && !lifted && !reduce ? { y: [0, -metrics.bob, 0] } : { y: 0 }}
              transition={
                ready && !lifted && !reduce
                  ? { duration: 2.8 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
                  : { duration: 0.2 }
              }
            >
              <Paper
                variant={item.variant}
                label={item.label}
                width={metrics.paperWidth}
                height={ph}
                accent={item.accent}
                tape={item.tape}
                lifted={lifted}
              />
            </motion.button>
          </motion.div>
        );
      })}
    </>
  );
}
