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

// Pasangan latar + teks dipilih agar kontras >= 4.5:1 (lihat palet di globals.css).
export const accentBg: Record<Accent, string> = {
  yellow: "bg-yellow text-ink",
  pink: "bg-pink text-white", // Crimson Blaze + putih (6.2:1)
  green: "bg-green text-white", // Gochujang Red + putih (11.7:1)
  blue: "bg-blue text-ink", // Blue Marble + Cosmos (4.75:1); putih hanya 3:1

  sky: "bg-sky text-ink",
  peach: "bg-peach text-ink",
  mint: "bg-mint text-ink",
  beige: "bg-beige text-ink",
  white: "bg-white text-ink",
  ink: "bg-ink text-white",
};
