"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icons";
import { introDecor } from "@/config/folder";
import { cn } from "@/lib/cn";

/** Dekorasi kecil samar di background intro, bergerak sangat pelan. Tidak menangkap klik. */
export default function IntroDecorations({ folderWidth }: { folderWidth: number }) {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {introDecor.map((d, i) => {
        const size = folderWidth * d.size;
        return (
          <motion.div
            key={`${d.kind}-${i}`}
            className={cn("absolute", d.hideOnMobile && "hidden sm:block")}
            style={{ left: `${d.x}%`, top: `${d.y}%`, width: size, opacity: d.opacity }}
            initial={{ rotate: d.rotate, y: 0 }}
            animate={reduce ? { rotate: d.rotate } : { y: [0, -8, 0], rotate: [d.rotate, d.rotate + 5, d.rotate] }}
            transition={reduce ? undefined : { duration: 7 + i * 1.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
          >
            <Decor kind={d.kind} size={size} />
          </motion.div>
        );
      })}
    </div>
  );
}

function Decor({ kind, size }: { kind: (typeof introDecor)[number]["kind"]; size: number }) {
  switch (kind) {
    case "star":
      return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <path
            d="M50 6 61 37h33L67 57l10 33-27-20-27 20 10-33L6 37h33z"
            fill="var(--color-pink)"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "ring":
      return <Icon name="ring" size={size} />;
    case "sparkle":
      return <Icon name="sparkle" size={size} className="text-blue" />;
    case "squiggle":
      return (
        <svg viewBox="0 0 120 30" width={size} height={size / 4}>
          <path d="M3 15q10-12 20 0t20 0 20 0 20 0 20 0 14-2" fill="none" stroke="var(--color-blue)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "tape":
      return <span className="block bg-sky/70" style={{ width: size, height: size * 0.3 }} />;
  }
}
