import { cn } from "@/lib/cn";

interface ArrowProps {
  /** Arah ujung panah. "up-left" = cermin dari "up-right". */
  direction?: "up-right" | "up-left";
  /** Ukuran & posisi (mis. "absolute left-0 top-full h-7 w-9"). */
  className?: string;
}

/** Panah sketsa tipis sedikit melengkung, dari kiri-bawah ke kanan-atas. Warna = currentColor. */
export default function Arrow({ direction = "up-right", className }: ArrowProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 30"
      fill="none"
      className={cn("pointer-events-none overflow-visible text-ink", direction === "up-left" && "-scale-x-100", className)}
    >
      {/* Batang melengkung */}
      <path
        d="M3 27C10 25 22 20 34 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Kepala panah kecil */}
      <path
        d="M26 6 34.5 4.5 33 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
