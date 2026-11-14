// Semua angka & teks intro folder ada di file ini.
// Ukuran fisik cukup diatur lewat folder.size; SEMUA jarak/ukuran lain berupa RASIO terhadap
// lebar folder (atau lebar/tinggi kertas, kalau disebutkan), jadi ikut membesar/mengecil.
// Sudut dalam derajat, durasi dalam detik.
import type { Accent } from "@/components/ui/colors";

export type PaperVariant = "polaroid" | "notebook" | "sticky" | "postcard";
export type TapeTint = "yellow" | "blue" | "pink" | "white";

export interface PaperItem {
  id: string;
  label: string;
  /** Halaman tujuan saat kertas diklik. */
  href: string;
  /** Desain kertas: polaroid | notebook | sticky | postcard (bisa ditukar bebas). */
  variant: PaperVariant;
  /** Warna stabilo di belakang label (dan warna kertas untuk variant "sticky"). */
  accent: Accent;
  /** Warna selotip di pojok atas kertas. */
  tape: TapeTint;
}

/** Kertas yang keluar dari folder. Tambah/kurangi item = sudut & jarak kipas menyesuaikan otomatis. */
export const papers: readonly PaperItem[] = [
  { id: "about", label: "About", href: "/about", variant: "polaroid", accent: "yellow", tape: "blue" },
  { id: "work", label: "Work", href: "/case-study", variant: "notebook", accent: "pink", tape: "yellow" },
  { id: "play", label: "Play", href: "/playground", variant: "sticky", accent: "pink", tape: "white" },
  { id: "contact", label: "Contact", href: "/contact", variant: "postcard", accent: "yellow", tape: "pink" },
];

export const folder = {
  size: { desktop: 360, mobile: 260 }, // lebar folder (px): satu-satunya angka px utama
  mobileBreakpoint: 640, // lebar layar (px) di bawah ini dianggap mobile
  aspect: 0.8, // tinggi / lebar; harus sama dengan viewBox 120 x 96 di Folder.tsx
  frontTop: 30 / 96, // tepi atas saku depan (0-1 dari tinggi folder); sama dengan Folder.tsx
  colors: {
    // Semua diturunkan dari kuning palet (--color-yellow) supaya seragam dengan website
    back: "color-mix(in srgb, var(--color-yellow), var(--color-ink) 14%)", // panel belakang + tab
    backLight: "color-mix(in srgb, var(--color-yellow), var(--color-ink) 4%)", // gradient atas panel belakang
    front: "var(--color-yellow)", // saku depan
    frontLight: "color-mix(in srgb, var(--color-yellow), white 30%)", // gradient atas saku
    frontDark: "color-mix(in srgb, var(--color-yellow), var(--color-ink) 7%)", // gradient bawah saku
    fold: "color-mix(in srgb, var(--color-yellow), var(--color-ink) 40%)", // garis lipatan
  },
  glowColor: "color-mix(in srgb, var(--color-yellow) 45%, transparent)", // glow hangat di belakang folder
  floatDistance: 0.014, // folder melayang naik-turun sekian (x lebar folder) saat idle
  floatDuration: 3, // satu siklus melayang (detik)
  hoverTilt: -2, // kemiringan folder saat di-hover (derajat)
  hoverLift: 0.02, // folder naik sekian saat di-hover (x lebar folder)
  pocketOpenTilt: -16, // saku depan "terbuka" (rotateX, derajat) saat kertas keluar
} as const;

export const paper = {
  widthRatio: 0.6, // lebar kertas (x lebar folder)
  heightRatio: 1.22, // tinggi kertas (x lebar kertas) -> potret
  labelScale: 0.15, // ukuran font label (x lebar kertas)
  hover: { lift: 0.067, scale: 1.08 }, // hover kertas: naik (x lebar folder) & membesar
  dimOpacity: 0.85, // kertas lain meredup saat satu kertas di-hover
  pushAway: 0.03, // kertas lain sedikit menjauh saat satu kertas di-hover (x lebar folder)
  selectScale: 1.15, // kertas yang diklik membesar sebentar sebelum pindah halaman
  selectDelay: 0.32, // jeda (detik) sebelum navigasi setelah kertas diklik
  bob: 0.009, // kertas melayang pelan saat kipas terbuka (x lebar folder)
} as const;

/** Hover pada folder: kertas mengintip sedikit dari atas saku. */
export const peek = {
  distance: 0.15, // kertas muncul sekian di atas tepi saku (x lebar folder)
  angles: { start: -5, end: 6 }, // kemiringan kertas pertama & terakhir
  spreadX: 0.03, // geser horizontal antar kertas (x lebar folder)
  stagger: 0.04, // jeda antar kertas (detik)
  spring: { stiffness: 240, damping: 22, mass: 0.8 },
} as const;

/** Klik pada folder: kertas mengembang seperti kipas. */
export const fan = {
  angles: { start: -32, end: 32 }, // sudut kertas pertama & terakhir; sisanya dibagi rata (4 kertas: -32,-11,11,32)
  spacing: 0.5, // jarak horizontal antar pivot kertas (x lebar kertas)
  outRatio: 0.68, // bagian kertas yang keluar dari saku (x tinggi kertas)
  // Override khusus layar kecil (kipas lebih rapat & kertas keluar lebih tinggi supaya label terbaca)
  mobile: { angles: { start: -24, end: 24 }, spacing: 0.52, outRatio: 0.8 },
  centerLift: 0.07, // kertas tengah lebih tinggi dari pinggir (x tinggi kertas) -> lengkung natural
  edgePadding: 14, // jarak minimal kipas ke tepi layar (px); kipas otomatis mengecil di layar sempit
  staggerDelay: 0.1, // jeda antar kertas saat membuka (detik)
  closeStagger: 0.05, // jeda antar kertas saat menutup (urutan terbalik, detik)
  spring: { stiffness: 260, damping: 14, mass: 0.9 }, // sedikit overshoot
} as const;

export const timing = {
  introDuration: 0.9, // slide-in + fade-in folder (detik)
  introSlideOffset: 0.25, // folder mulai sekian di bawah posisi akhir (x lebar folder)
} as const;

export const hint = {
  text: "Click it",
  fontSize: 0.068, // ukuran font (x lebar folder)
  gap: 0.09, // jarak dari folder (x lebar folder)
  delay: 0.2, // jeda setelah folder berhenti sebelum teks muncul (detik)
  pulseDuration: 1.8, // satu siklus pulse (detik)
} as const;

/** Dekorasi samar di background intro. x/y = posisi (% layar), size = x lebar folder. */
export const introDecor: {
  kind: "star" | "ring" | "squiggle" | "tape" | "sparkle";
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  hideOnMobile?: boolean;
}[] = [
  { kind: "star", x: 14, y: 20, size: 0.13, rotate: -12, opacity: 0.7 },
  { kind: "ring", x: 84, y: 24, size: 0.1, rotate: 0, opacity: 0.6 },
  { kind: "squiggle", x: 10, y: 74, size: 0.22, rotate: -8, opacity: 0.55, hideOnMobile: true },
  { kind: "tape", x: 82, y: 76, size: 0.2, rotate: 24, opacity: 0.7 },
  { kind: "sparkle", x: 70, y: 10, size: 0.07, rotate: 10, opacity: 0.6, hideOnMobile: true },
];
