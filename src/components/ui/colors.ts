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
// - Latar kuning lembut (bg-yellow #FFEB95) wajib berteks biru sangat gelap (text-ink #001E42 -> 13.90:1).
// - Latar biru solid (bg-blue #0153B3, bg-pink #014BA2, bg-green #013A7D, bg-ink #001E42) berteks putih (#FFFFFF -> 7.27:1 s/d 16.61:1).
// - Latar tint biru pucat (sky, peach, mint, beige, white) berteks biru sangat gelap (text-ink #001E42 -> 11.78:1 s/d 16.61:1).
export const accentBg: Record<Accent, string> = {
  yellow: "bg-yellow text-ink",
  pink: "bg-pink text-white",
  green: "bg-green text-white",
  blue: "bg-blue text-white",
  sky: "bg-sky text-ink",
  peach: "bg-peach text-ink",
  mint: "bg-mint text-ink",
  beige: "bg-beige text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-white",
};
