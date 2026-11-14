import type { ResolvedLogo } from "./types";

interface TechLogoProps {
  logo: ResolvedLogo | null;
  /** Huruf monogram kalau logo tidak tersedia. */
  badge: string;
  /** Ukuran px; kosongkan kalau diatur lewat className. */
  size?: number;
  className?: string;
}

/** Logo merek (SVG inline dari simple-icons) atau monogram cadangan bergaya stiker. */
export default function TechLogo({ logo, badge, size, className }: TechLogoProps) {
  if (logo) {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill={logo.color} className={className}>
        <path d={logo.path} />
      </svg>
    );
  }
  const fontSize = badge.length >= 3 ? 6.4 : badge.length === 2 ? 8.4 : 11;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} className={className}>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="var(--color-paper-light)" stroke="var(--color-ink)" strokeWidth="1.6" />
      <text
        x="12"
        y="12.6"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        fontWeight="700"
        fontSize={fontSize}
        fill="var(--color-ink)"
      >
        {badge}
      </text>
    </svg>
  );
}
