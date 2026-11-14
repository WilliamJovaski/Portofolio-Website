import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { accentBg, type Accent } from "./colors";
import { tornClipPath } from "./torn";

export type ChipVariant = "pill" | "sticker" | "box";

interface ChipProps {
  color?: Accent;
  rotate?: number;
  /**
   * pill    : label kecil mono uppercase, rounded, border hitam (MADE THINGS, MOBILITY)
   * sticker : blok warna tepi sobek, teks sans tebal (chip skill)
   * box     : kotak putih border hitam (label "what's up")
   */
  variant?: ChipVariant;
  className?: string;
  children: ReactNode;
}

const variants: Record<ChipVariant, string> = {
  pill: "rounded-full border border-ink px-3.5 py-2 font-mono text-[clamp(11px,1.2vw,15px)] uppercase tracking-wider sm:px-4 sm:py-2.5",
  sticker: "px-[16px] py-[8px] font-sans font-semibold text-[clamp(12px,1.3vw,15px)]",
  box: "rounded-[4px] border-2 border-ink bg-white px-6 py-2.5 font-sans font-medium lowercase leading-none text-[clamp(20px,2.5vw,28px)] sm:px-7 sm:py-3",
};

/** Label kecil berwarna, sedikit miring. */
export default function Chip({
  color = "white",
  rotate = 0,
  variant = "pill",
  className,
  children,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        accentBg[color],
        variants[variant],
        className
      )}
      style={{
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        clipPath:
          variant === "sticker"
            ? tornClipPath({ top: true, bottom: true, teeth: 26, depth: 3 })
            : undefined,
      }}
    >
      {children}
    </span>
  );
}
