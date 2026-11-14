"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import Folder from "@/components/folder/Folder";
import PaperFan, { type FolderState } from "@/components/folder/PaperFan";
import IntroDecorations from "@/components/intro/IntroDecorations";
import Arrow from "@/components/ui/Arrow";
import { folder, hint, timing } from "@/config/folder";
import { useResponsiveSize } from "@/hooks/useResponsiveSize";

/**
 * Folder slide-in ke tengah layar.
 * State: idle <-> peek (hover) dan open (klik). Hover TIDAK pernah menimpa "open".
 * Klik folder lagi / klik di luar / Esc = menutup.
 */
export default function FolderIntro({ onSelect }: { onSelect: (href: string) => void }) {
  const metrics = useResponsiveSize();
  const reduce = useReducedMotion();
  const [state, setState] = useState<FolderState>("idle");
  // Bertambah tiap kali kipas dibuka (dipakai PaperFan untuk stagger keluar)
  const [openId, setOpenId] = useState(0);
  // "Click it" muncul setelah folder berhenti, dan hilang setelah pertama kali diklik.
  const [settled, setSettled] = useState(false);
  const [dismissedHint, setDismissedHint] = useState(false);
  // Apakah mouse masih di atas folder (untuk kembali ke peek setelah menutup)
  const hoveringRef = useRef(false);

  // Esc menutup kipas
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setState((s) => (s === "open" ? "idle" : s));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Toggle idle/peek <-> open.
  const toggle = () => {
    setDismissedHint(true);
    if (state === "open") {
      setState(hoveringRef.current ? "peek" : "idle");
    } else {
      setOpenId((n) => n + 1);
      setState("open");
    }
  };

  // stopPropagation penting: tanpa ini klik naik ke handler "klik di luar" di stage
  // dan langsung menutup kipas pada klik yang sama (open -> idle).
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggle();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  // Gerak folder: idle melayang pelan, hover miring & naik, open diam
  const folderMotion: TargetAndTransition =
    state === "peek"
      ? { y: -metrics.hoverLift, rotate: folder.hoverTilt, transition: { type: "spring", stiffness: 260, damping: 20 } }
      : state === "open" || reduce
        ? { y: 0, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
        : {
            y: [0, -metrics.floatDistance, 0],
            rotate: 0,
            transition: { y: { duration: folder.floatDuration, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 0.3 } },
          };

  return (
    <div
      className="notebook-bg fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      // Klik di luar area folder menutup kipas
      onClick={() => setState((s) => (s === "open" ? "idle" : s))}
    >
      <IntroDecorations folderWidth={metrics.folderWidth} />

      {/* Satu wrapper = area klik utama. Turun setengah tinggi kipas supaya grup folder+kipas di tengah layar */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Open folder"
        aria-expanded={state === "open"}
        className="relative cursor-pointer outline-offset-8"
        style={{ width: metrics.folderWidth, height: metrics.folderHeight, top: metrics.offsetY }}
        initial={{ opacity: 0, y: metrics.introSlideOffset }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: timing.introDuration, ease: "easeOut" }}
        onAnimationComplete={() => setSettled(true)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        // Hover hanya aktif untuk mouse; di layar sentuh langsung ke klik
        onHoverStart={() => {
          hoveringRef.current = true;
          setState((s) => (s === "idle" ? "peek" : s));
        }}
        onHoverEnd={() => {
          hoveringRef.current = false;
          setState((s) => (s === "peek" ? "idle" : s));
        }}
      >
        {/* Area klik tak terlihat di atas folder, tempat kertas mengintip */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-full"
          style={{ height: metrics.peekDistance * 1.5 }}
        />

        <motion.div animate={folderMotion}>
          <Folder width={metrics.folderWidth} height={metrics.folderHeight} open={state === "open"}>
            <PaperFan state={state} openId={openId} metrics={metrics} onSelect={onSelect} />
          </Folder>
        </motion.div>

        {/* "Click it" tulisan tangan + panah sketsa ke folder */}
        <AnimatePresence>
          {settled && !dismissedHint && (
            <motion.p
              key="hint"
              className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 items-end gap-1 whitespace-nowrap font-hand text-ink/80"
              style={{ marginTop: metrics.hintGap, fontSize: metrics.hintFontSize }}
              initial={{ opacity: 0 }}
              animate={{ opacity: reduce ? 1 : [0.45, 1, 0.45] }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={
                reduce
                  ? { duration: 0.3, delay: hint.delay }
                  : { duration: hint.pulseDuration, ease: "easeInOut", repeat: Infinity, delay: hint.delay }
              }
            >
              <Arrow direction="up-right" className="mb-[0.35em] h-[1.3em] w-[1.6em]" />
              {hint.text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
