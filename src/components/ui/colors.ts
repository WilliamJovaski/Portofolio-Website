// Nama warna aksen yang boleh dipakai di data (src/data). Nilai hex-nya ada di globals.css (@theme).
// Class ditulis lengkap (bukan dirakit dari string) supaya Tailwind bisa mendeteksinya.
export type Accent =
  | "yellow"
  | "pink"
  | "green"
  | "blue"
  | "sky"
  | "peach"
  | "mint"
  | "beige"
  | "white"
  | "ink";

// Pasangan latar + teks dipilih agar kontras >= 4.5:1 (WCAG AA):
// - Light Blue (#0EA5E9 / bg-blue) dipasangkan dengan Black (#0F172A / text-ink) -> 6.44:1
// - Blue (#0077CC / bg-pink) dipasangkan dengan White (#FFFFFF / text-white) -> 4.66:1
// - Dark Blue (#004A80 / bg-green) dipasangkan dengan White (#FFFFFF / text-white) -> 9.17:1
// - Black (#0F172A / bg-ink) dipasangkan dengan White (#FFFFFF / text-white) -> 17.85:1
export const accentBg: Record<Accent, string> = {
  yellow: "bg-yellow text-ink",
  pink: "bg-pink text-white",
  green: "bg-green text-white",
  blue: "bg-blue text-ink",
  sky: "bg-sky text-ink",
  peach: "bg-peach text-ink",
  mint: "bg-mint text-ink",
  beige: "bg-beige text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-white",
};
