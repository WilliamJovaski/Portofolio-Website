import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "accent";

// Hierarki tombol untuk seluruh website:
// - solid   : Tombol utama (Primary CTA) — paling menonjol (Blue #0077CC -> hover Dark Blue #004A80, teks White #FFFFFF)
// - outline : Tombol sekunder — permukaan White (#FFFFFF), teks Dark Blue (#004A80), border Blue (#0077CC), hover tint Sky
// - accent  : Tombol aksen — Light Blue (#0EA5E9) dengan teks Black (#0F172A) (kontras 6.44:1)
const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 border-[1.5px] px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider shadow-hard transition-[translate,box-shadow,background-color,color,border-color] duration-200 hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  solid: "border-ink bg-primary text-white hover:bg-primary-hover active:bg-ink",
  outline:
    "border-primary bg-white text-primary-hover hover:border-ink hover:bg-sky hover:text-ink active:bg-yellow",
  accent: "border-ink bg-blue text-ink hover:bg-yellow active:bg-sky",
};

/** className tombol bertema (untuk <a>, <Link>, atau <button>). */
export const buttonClass = (variant: ButtonVariant = "outline", className?: string) =>
  cn(base, variants[variant], className);
