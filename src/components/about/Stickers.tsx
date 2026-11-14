// Stiker tempelan dekoratif (SVG inline, tanpa gambar eksternal). Semua aria-hidden & tidak menangkap klik.
import { useId } from "react";
import Tape from "@/components/ui/Tape";

const PAPER = "var(--color-paper-light)";

/** Lingkaran kecil sewarna latar di sepanjang tepi kotak -> efek perforasi perangko. */
function Perforation({ x, y, w, h, r = 1.6, gap = 4.5 }: { x: number; y: number; w: number; h: number; r?: number; gap?: number }) {
  const dots: { cx: number; cy: number }[] = [];
  for (let i = x; i <= x + w + 0.1; i += gap) dots.push({ cx: i, cy: y }, { cx: i, cy: y + h });
  for (let j = y + gap; j < y + h; j += gap) dots.push({ cx: x, cy: j }, { cx: x + w, cy: j });
  return (
    <g fill={PAPER}>
      {dots.map((d) => (
        <circle key={`${d.cx}-${d.cy}`} cx={d.cx} cy={d.cy} r={r} />
      ))}
    </g>
  );
}

/** Kartu pos mini ala airmail: border diagonal merah-biru, perangko bergerigi, garis tulisan abstrak. */
export function PostcardSticker() {
  const id = useId();
  return (
    <div aria-hidden="true" className="pointer-events-none relative drop-shadow-paper">
      <Tape corner="tc" tint="white" className="h-4! w-12! -ml-6! -top-2!" />
      <svg viewBox="0 0 110 75" width="110" height="75" className="block">
        <defs>
          <pattern id={`${id}-air`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="14" height="14" fill={PAPER} />
            <rect width="3.5" height="14" fill="var(--color-pink)" />
            <rect x="7" width="3.5" height="14" fill="var(--color-blue)" />
          </pattern>
        </defs>
        <rect width="110" height="75" rx="3" fill={`url(#${id}-air)`} />
        <rect x="5" y="5" width="100" height="65" rx="1.5" fill={PAPER} />
        {/* Perangko */}
        <rect x="80" y="10" width="19" height="23" fill="var(--color-peach)" />
        <circle cx="89.5" cy="20" r="4.5" fill="var(--color-pink)" />
        <path d="M82 31l5-6 4 4 3-3 5 5z" fill="var(--color-green)" />
        <Perforation x={80} y={10} w={19} h={23} r={1.3} gap={3.8} />
        {/* Pembatas tengah + garis tulisan */}
        <path d="M58 14v48" stroke="color-mix(in srgb, var(--color-ink) 15%, transparent)" strokeWidth="1" />
        <g stroke="color-mix(in srgb, var(--color-ink) 22%, transparent)" strokeWidth="2" strokeLinecap="round">
          <path d="M12 20h38M12 28h32M12 36h36M12 44h24" />
          <path d="M64 44h34M64 52h30M64 60h26" />
        </g>
      </svg>
    </div>
  );
}

/** Perangko bergerigi (mint) dengan stempel pos bulat menimpa sebagian. */
export function StampSticker() {
  const id = useId();
  return (
    <svg aria-hidden="true" viewBox="0 0 104 92" width="104" height="92" className="pointer-events-none block drop-shadow-paper">
      <defs>
        <path id={`${id}-ring`} d="M62 60m-25 0a25 25 0 1 1 50 0a25 25 0 1 1 -50 0" />
      </defs>
      {/* Perangko */}
      <rect x="6" y="8" width="56" height="68" fill={PAPER} />
      <rect x="11" y="13" width="46" height="58" fill="var(--color-mint)" />
      <path d="M16 62l12-16 8 9 6-6 11 13z" fill="var(--color-green)" />
      <circle cx="42" cy="28" r="6" fill="var(--color-yellow)" />
      <text x="15" y="24" fontFamily="monospace" fontSize="8" fontWeight="700" fill="var(--color-ink)">
        26
      </text>
      <Perforation x={6} y={8} w={56} h={68} r={2.2} gap={5.6} />
      {/* Stempel pos */}
      <g opacity="0.6" stroke="var(--color-ink)" fill="none">
        <circle cx="62" cy="60" r="29" strokeWidth="1.4" />
        <circle cx="62" cy="60" r="19" strokeWidth="1" />
        <path d="M86 52q6 3 12 0t12 0M86 60q6 3 12 0t12 0M86 68q6 3 12 0t12 0" strokeWidth="1.2" />
      </g>
      <text opacity="0.6" fontFamily="monospace" fontSize="7" letterSpacing="1.5" fill="var(--color-ink)">
        <textPath href={`#${id}-ring`}>JAKARTA · 2026 · AIR MAIL ·</textPath>
      </text>
      <text x="62" y="63" opacity="0.6" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="700" fill="var(--color-ink)">
        HELLO
      </text>
    </svg>
  );
}

/** Stiker bintang pink dengan tepi putih ala stiker. */
export function StarSticker() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" width="64" height="64" className="pointer-events-none block drop-shadow-paper">
      <path
        d="M50 6 61 37h33L67 57l10 33-27-20-27 20 10-33L6 37h33z"
        fill="var(--color-pink)"
        stroke="#fff"
        strokeWidth="7"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
      <path
        d="M50 6 61 37h33L67 57l10 33-27-20-27 20 10-33L6 37h33z"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
