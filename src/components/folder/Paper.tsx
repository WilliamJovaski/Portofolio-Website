"use client";

import { useId, type ReactNode } from "react";
import Image from "next/image";
import type { Accent } from "@/components/ui/colors";
import { tornClipPath } from "@/components/ui/torn";
import { paper, type PaperVariant, type TapeTint } from "@/config/folder";
import { cn } from "@/lib/cn";

interface PaperProps {
  variant: PaperVariant;
  label: string;
  width: number;
  height: number;
  accent: Accent;
  tape: TapeTint;
  /** Bayangan lebih kuat (saat di-hover). */
  lifted?: boolean;
}

// Warna stabilo di belakang label (semi transparan)
const highlight: Record<Accent, string> = {
  yellow: "bg-yellow/75",
  pink: "bg-pink/30",
  green: "bg-green/25",
  blue: "bg-blue/35",
  sky: "bg-sky/80",
  peach: "bg-peach",
  mint: "bg-mint",
  beige: "bg-beige",
  white: "bg-white",
  ink: "bg-ink/20",
};

// Warna kertas untuk variant "sticky": versi pastel dari warna aksen palet
const stickyBg = (accent: Accent) => `color-mix(in srgb, var(--color-${accent}) 28%, var(--color-paper))`;

// Kertas krem (kartu pos, perangko) diturunkan dari beige palet
const CREAM = "color-mix(in srgb, var(--color-beige) 40%, white)";

const tapeColor: Record<TapeTint, string> = {
  yellow: "color-mix(in srgb, var(--color-yellow) 55%, transparent)",
  blue: "color-mix(in srgb, var(--color-sky) 80%, transparent)",
  pink: "color-mix(in srgb, var(--color-pink) 40%, transparent)",
  white: "color-mix(in srgb, white 82%, transparent)",
};

// Kemiringan selotip & ujung kertas unik per variant
const tapeTilt: Record<PaperVariant, number> = { polaroid: -6, notebook: 4, sticky: -2, postcard: 7 };

/** Label tulisan tangan besar dengan stabilo di belakangnya. */
function Label({ text, accent, size }: { text: string; accent: Accent; size: number }) {
  return (
    <span className="relative inline-block whitespace-nowrap font-hand leading-none text-ink" style={{ fontSize: size }}>
      <span
        aria-hidden="true"
        className={cn("absolute -inset-x-[8%] bottom-[4%] h-[46%] -skew-x-6 rounded-[2px]", highlight[accent])}
      />
      <span className="relative" style={{ WebkitTextStroke: `${Math.max(0.3, size * 0.018)}px currentColor` }}>
        {text}
      </span>
    </span>
  );
}

/**
 * Kertas di dalam folder. Tipe ditentukan `variant` dari config/folder.ts:
 * polaroid (About), notebook (Work), sticky (Play), postcard (Contact).
 */
export default function Paper({ variant, label, width: w, height: h, accent, tape, lifted = false }: PaperProps) {
  const labelSize = w * paper.labelScale;
  const labelEl = <Label text={label} accent={accent} size={labelSize} />;

  let body: ReactNode;
  if (variant === "polaroid") body = <PolaroidPaper w={w} h={h} label={labelEl} />;
  else if (variant === "notebook") body = <NotebookPaper w={w} label={labelEl} />;
  else if (variant === "sticky") body = <StickyPaper w={w} accent={accent} label={labelEl} />;
  else body = <PostcardPaper w={w} label={labelEl} />;

  return (
    <div
      className="relative transition-[filter] duration-300"
      style={{
        width: w,
        height: h,
        // drop-shadow (bukan box-shadow) supaya tetap terlihat pada kertas ber-clip-path
        filter: lifted
          ? "drop-shadow(0 18px 22px color-mix(in srgb, var(--color-ink) 22%, transparent))"
          : "drop-shadow(0 6px 10px color-mix(in srgb, var(--color-ink) 13%, transparent))",
      }}
    >
      {body}
      {/* Selotip di tepi atas */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 z-10 shadow-[0_1px_1px_var(--color-paper-line)]"
        style={{
          top: -w * 0.045,
          width: w * 0.36,
          height: w * 0.1,
          marginLeft: -w * 0.18,
          background: tapeColor[tape],
          transform: `rotate(${tapeTilt[variant]}deg)`,
        }}
      />
    </div>
  );
}

/**
 * About: mini polaroid, menampilkan foto profil jojo-1.
 * Label di atas foto (bagian bawah kertas tersembunyi di dalam saku folder).
 */
function PolaroidPaper({ w, h, label }: { w: number; h: number; label: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-[2px] bg-white" style={{ padding: w * 0.06 }}>
      <div className="flex items-center justify-center" style={{ height: h * 0.18 }}>
        {label}
      </div>
      <div className="relative flex-1 overflow-hidden bg-paper-light">
        <Image
          src="/images/jojo-1.jpg"
          alt="Foto profil William Jovaski"
          fill
          sizes={`${w}px`}
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
        />
      </div>
      {/* Tepi bawah polaroid yang lebih tebal */}
      <div style={{ height: h * 0.12 }} />
    </div>
  );
}

/** Work: halaman notebook bergaris + margin merah, thumbnail proyek hitam & chip PROJECT. */
function NotebookPaper({ w, label }: { w: number; label: ReactNode }) {
  const line = w * 0.085;
  const fold = w * 0.15;
  return (
    <div
      className="relative h-full"
      style={{
        backgroundColor: "var(--color-paper-light)",
        backgroundImage: [
          "linear-gradient(to right, transparent 16%, color-mix(in srgb, var(--color-pink) 65%, transparent) 16%, color-mix(in srgb, var(--color-pink) 65%, transparent) calc(16% + 1.5px), transparent calc(16% + 1.5px))",
          `repeating-linear-gradient(to bottom, transparent 0, transparent ${line - 1}px, color-mix(in srgb, var(--color-blue) 25%, transparent) ${line - 1}px, color-mix(in srgb, var(--color-blue) 25%, transparent) ${line}px)`,
        ].join(", "),
        // Sudut kanan bawah terlipat
        clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${fold}px), calc(100% - ${fold}px) 100%, 0 100%)`,
        paddingTop: w * 0.16,
        paddingLeft: w * 0.22,
        paddingRight: w * 0.08,
      }}
    >
      {/* Lubang spiral di margin kiri */}
      {[0.22, 0.5, 0.78].map((t) => (
        <span key={t} aria-hidden="true" className="absolute rounded-full bg-ink/15" style={{ left: w * 0.05, top: `${t * 100}%`, width: w * 0.05, height: w * 0.05 }} />
      ))}
      {label}
      <div className="relative mt-[12%] rounded-[3px] bg-ink" style={{ width: "88%", aspectRatio: "4 / 3" }}>
        <span aria-hidden="true" className="absolute rounded-sm bg-linear-to-r from-mint to-green" style={{ left: "10%", right: "10%", top: "14%", height: "16%" }} />
        <span aria-hidden="true" className="absolute rounded-sm bg-white/25" style={{ left: "10%", width: "55%", top: "40%", height: "8%" }} />
        <span aria-hidden="true" className="absolute rounded-sm bg-white/25" style={{ left: "10%", width: "38%", top: "54%", height: "8%" }} />
        <span
          className="absolute -bottom-[14%] -left-[6%] -rotate-3 rounded-[3px] border border-ink bg-yellow font-mono font-medium uppercase tracking-wider"
          style={{ fontSize: Math.max(7, w * 0.055), padding: `${w * 0.012}px ${w * 0.03}px` }}
        >
          Project
        </span>
      </div>
      {/* Lipatan sudut */}
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0"
        style={{ width: fold, height: fold, background: "linear-gradient(315deg, transparent 50%, var(--color-beige) 50%)" }}
      />
    </div>
  );
}

/** Play: sticky note dengan tepi bawah sobek + doodle SVG. */
function StickyPaper({ w, accent, label }: { w: number; accent: Accent; label: ReactNode }) {
  return (
    <div
      className="relative flex h-full flex-col items-center"
      style={{
        background: stickyBg(accent),
        clipPath: tornClipPath({ bottom: true, teeth: 14, depth: Math.max(4, w * 0.035) }),
        paddingTop: w * 0.17,
      }}
    >
      {/* Strip lem di atas (sedikit lebih gelap) */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 bg-ink/5" style={{ height: w * 0.1 }} />
      {label}
      <svg aria-hidden="true" viewBox="0 0 100 100" className="mt-[10%] w-[82%]" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {/* bintang */}
        <path d="M24 10l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="var(--color-yellow)" />
        {/* spiral */}
        <path d="M72 30c0-4 6-4 6 0s-10 7-11 0 9-12 16-6 3 18-8 17-15-10-9-19" />
        {/* logo */}
        <circle cx="40" cy="72" r="15" fill="var(--color-white)" stroke="var(--color-ink)" strokeWidth="1.2" />
        <image href="/images/logo.png" x="26" y="58" width="28" height="28" />
        {/* coretan kecil */}
        <path d="M70 70q5-6 10 0t10 0" />
      </svg>
    </div>
  );
}

/** Contact: mini kartu pos krem dengan border airmail, perangko bergerigi, garis alamat. */
function PostcardPaper({ w, label }: { w: number; label: ReactNode }) {
  const id = useId();
  const stripe = w * 0.045;
  return (
    <div
      className="h-full rounded-[2px]"
      style={{
        padding: w * 0.04,
        background: `repeating-linear-gradient(135deg, var(--color-pink) 0 ${stripe}px, ${CREAM} ${stripe}px ${stripe * 2}px, var(--color-blue) ${stripe * 2}px ${stripe * 3}px, ${CREAM} ${stripe * 3}px ${stripe * 4}px)`,
      }}
    >
      <div className="relative flex h-full flex-col" style={{ padding: w * 0.07, background: CREAM }}>
        {/* Perangko bergerigi + stempel */}
        <svg aria-hidden="true" viewBox="0 0 40 46" className="absolute" style={{ top: w * 0.05, right: w * 0.05, width: w * 0.26 }}>
          <defs>
            <path id={`${id}-pm`} d="M14 34m-11 0a11 11 0 1 1 22 0a11 11 0 1 1 -22 0" />
          </defs>
          <rect x="6" y="2" width="30" height="36" fill={CREAM} />
          <rect x="9" y="5" width="24" height="30" fill="var(--color-peach)" />
          <path d="M21 26s-7-4.5-7-9a3.6 3.6 0 0 1 7-1.4 3.6 3.6 0 0 1 7 1.4c0 4.5-7 9-7 9z" fill="var(--color-pink)" />
          <g fill={CREAM}>
            {[6, 10, 14, 18, 22, 26, 30, 34].map((x) => (
              <g key={x}>
                <circle cx={x + 1} cy="2" r="1.3" />
                <circle cx={x + 1} cy="38" r="1.3" />
              </g>
            ))}
            {[6, 10, 14, 18, 22, 26, 30, 34].map((y) => (
              <g key={`v${y}`}>
                <circle cx="6" cy={y} r="1.3" />
                <circle cx="36" cy={y} r="1.3" />
              </g>
            ))}
          </g>
          <g opacity="0.55" fill="none" stroke="var(--color-ink)">
            <circle cx="14" cy="34" r="11" strokeWidth="0.8" />
          </g>
          <text opacity="0.55" fontSize="4.2" fontFamily="monospace" fill="var(--color-ink)">
            <textPath href={`#${id}-pm`}>AIR MAIL · 2026 ·</textPath>
          </text>
        </svg>

        <div style={{ marginTop: w * 0.24 }}>{label}</div>

        {/* Garis alamat */}
        <div className="mt-auto ml-auto flex w-[62%] flex-col" style={{ gap: w * 0.06, marginBottom: w * 0.06 }}>
          {[100, 86, 70].map((p) => (
            <span key={p} aria-hidden="true" className="block h-[1.5px] bg-ink/20" style={{ width: `${p}%` }} />
          ))}
        </div>
        <span className="font-mono uppercase tracking-widest text-pink" style={{ fontSize: Math.max(7, w * 0.05) }}>
          Par avion
        </span>
      </div>
    </div>
  );
}
