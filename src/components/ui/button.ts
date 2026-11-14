import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "accent";

// Satu gaya tombol untuk seluruh website: border tinta tipis + bayangan keras + label mono uppercase + min 44px touch target
const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 border-[1.5px] border-ink px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider shadow-hard transition-[translate,box-shadow,background-color] duration-200 hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-hard-sm motion-reduce:transition-none";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-ink text-white",
  outline: "bg-white text-ink hover:bg-yellow",
  accent: "bg-yellow text-ink",
};

/** className tombol bertema (untuk <a>, <Link>, atau <button>). */
export const buttonClass = (variant: ButtonVariant = "outline", className?: string) =>
  cn(base, variants[variant], className);
