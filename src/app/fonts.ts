// Satu-satunya tempat untuk mengganti font. Tiap font diekspos sebagai CSS variable
// yang dipakai di globals.css (@theme) -> class font-pixel / font-hand / font-sans / font-mono.
import { Gochi_Hand, Inter, Jersey_10, Space_Mono } from "next/font/google";

// PIXEL untuk judul besar. Alternatif: ganti dengan Pixelify_Sans (weight "700").
export const pixelFont = Jersey_10({
  variable: "--font-pixel-face",
  weight: "400",
  subsets: ["latin"],
});

// HANDWRITING untuk bio & catatan kecil. Alternatif: Caveat, Patrick_Hand.
export const handFont = Gochi_Hand({
  variable: "--font-hand-face",
  weight: "400",
  subsets: ["latin"],
});

// SANS untuk body & UI.
export const sansFont = Inter({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

// MONO untuk label kecil uppercase (nav, tanggal, status). Bukan Geist (font default create-next-app).
export const monoFont = Space_Mono({
  variable: "--font-mono-face",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const fontVariables = [pixelFont, handFont, sansFont, monoFont]
  .map((f) => f.variable)
  .join(" ");
