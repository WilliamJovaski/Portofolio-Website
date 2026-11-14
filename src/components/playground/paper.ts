import type { CSSProperties } from "react";

// Kertas notebook /playground sebagai inline style (bukan class di globals.css) supaya lembar
// selalu buram walau CSS global belum termuat/ter-cache lama -> gallery tidak bisa "tembus".
const lines =
  "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, var(--color-paper-line) 27px, var(--color-paper-line) 28px)";
const margin = (side: "right" | "left") =>
  `linear-gradient(to ${side}, transparent 44px, color-mix(in srgb, var(--color-pink) 45%, transparent) 44px, color-mix(in srgb, var(--color-pink) 45%, transparent) 45.5px, transparent 45.5px)`;

/** Sisi depan / halaman gallery: margin pink di kiri. */
export const sheetPaperStyle: CSSProperties = {
  backgroundColor: "var(--color-paper-light)",
  backgroundImage: `${margin("right")}, ${lines}`,
};

/** Sisi belakang lembar: margin pink di kanan. */
export const sheetPaperBackStyle: CSSProperties = {
  backgroundColor: "var(--color-paper-light)",
  backgroundImage: `${margin("left")}, ${lines}`,
};
