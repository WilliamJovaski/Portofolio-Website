import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "accent";

// Hierarki tombol untuk seluruh website:
// - solid   : Tombol utama (Primary CTA) — Sunny Morning (#FECF02) + teks Deep Navy (#001E42) (kontras 11.18:1)
// - outline : Tombol sekunder — White (#FFFFFF) + teks & border Sky Blue (#0153B3) (kontras 7.27:1), hover tint biru
// - accent  : Tombol aksen biru — Sky Blue (#0153B3) + teks kuning Sunny Morning (#FECF02) (kontras 4.89:1)
const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 border-[1.5px] px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider shadow-hard transition-[translate,box-shadow,background-color,color,border-color] duration-200 hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  solid:
    "border-ink bg-primary text-ink hover:bg-primary-hover hover:text-ink active:bg-primary-active active:text-ink",
  outline:
    "border-link bg-white text-link hover:border-ink hover:bg-sky hover:text-ink active:bg-peach active:text-ink",
  accent:
    "border-ink bg-blue text-primary hover:bg-green hover:text-primary active:bg-ink active:text-primary",
};

/** className tombol bertema (untuk <a>, <Link>, atau <button>). */
export const buttonClass = (variant: ButtonVariant = "outline", className?: string) =>
  cn(base, variants[variant], className);
