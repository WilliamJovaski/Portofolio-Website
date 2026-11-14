import { cn } from "@/lib/cn";

type Corner = "tl" | "tr" | "tc";
type Tint = "yellow" | "blue" | "pink" | "white" | "gray";

const tints: Record<Tint, string> = {
  yellow: "bg-yellow/45",
  blue: "bg-sky/70",
  pink: "bg-pink/35",
  white: "bg-white/75",
  gray: "bg-ink/15 backdrop-blur-[1px]",
};

// Posisi + rotasi default tiap pojok
const corners: Record<Corner, { className: string; rotate: number }> = {
  tl: { className: "-left-4 -top-2", rotate: -38 },
  tr: { className: "-right-4 -top-2", rotate: 38 },
  tc: { className: "left-1/2 -top-3 -ml-8", rotate: -3 },
};

interface TapeProps {
  corner?: Corner;
  tint?: Tint;
  /** Override rotasi (derajat). */
  rotate?: number;
  className?: string;
}

/** Potongan selotip semi-transparan. Parent harus `relative`. */
export default function Tape({ corner = "tl", tint = "yellow", rotate, className }: TapeProps) {
  const c = corners[corner];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 h-5 w-16 shadow-[0_1px_1px_var(--color-paper-line)]",
        tints[tint],
        c.className,
        className
      )}
      style={{ transform: `rotate(${rotate ?? c.rotate}deg)` }}
    />
  );
}
