// Ikon SVG inline (tanpa library). Semua memakai currentColor kecuali ikon dekoratif berwarna.
import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

export type IconName =
  | "home"
  | "user"
  | "grid"
  | "diamond"
  | "heart"
  | "mail"
  | "arrow-right"
  | "arrow-up-right"
  | "linkedin"
  | "instagram"
  | "github"
  | "dribbble"
  | "behance"
  | "ring"
  | "asterisk"
  | "sparkle"
  | "star"
  | "file"
  | "menu"
  | "close"
  | "dot";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  /** Isi kalau ikon berdiri sendiri (tanpa teks) supaya terbaca screen reader. */
  title?: string;
}

const paths: Record<IconName, ReactNode> = {
  home: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" />
    </>
  ),
  diamond: <path d="M12 2 22 12 12 22 2 12z" fill="currentColor" />,
  heart: (
    <path
      d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"
      fill="currentColor"
    />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  "arrow-right": (
    <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
  ),
  "arrow-up-right": (
    <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
    />
  ),
  dribbble: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 9c5 1 11 0 15-3M6 19c2-5 7-8 14-7M9 4c3 4 6 10 7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </>
  ),
  behance: (
    <path
      d="M3 6h6a3 3 0 0 1 0 6H3zm0 6h6.5a3 3 0 0 1 0 6H3zm11-5h6m-6.5 7a3.5 3.5 0 1 1 7 0h-7a3.5 3.5 0 0 0 6.3 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  ),
  // Ikon dekoratif berwarna (lingkaran hijau & asterisk pink seperti referensi)
  ring: (
    <>
      <circle cx="12" cy="12" r="10" fill="var(--color-green)" />
      <circle cx="12" cy="12" r="6" fill="var(--color-white)" />
      <circle cx="12" cy="12" r="3" fill="var(--color-ink)" />
    </>
  ),
  asterisk: (
    <g fill="var(--color-pink)">
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="10" y="2" width="4" height="20" rx="2" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  ),
  sparkle: <path d="M12 2c1 5 3 7 10 10-7 3-9 5-10 10-1-5-3-7-10-10 7-3 9-5 10-10z" fill="currentColor" />,
  star: <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7.1L12 17.3 5.8 21l1.6-7.1L2 9.2l7.1-.6z" fill="currentColor" />,
  file: (
    <>
      <path d="M6 2h8l5 5v15H6z" fill="currentColor" />
      <path d="M9 12h7M9 16h7" stroke="var(--color-yellow)" strokeWidth="1.8" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />,
  close: <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />,
  dot: <circle cx="12" cy="12" r="5" fill="currentColor" />,
};

export function Icon({ name, size = 14, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}

/** Logo William Jovaski (menggantikan smiley face). */
export function Smiley({
  size = 96,
  className,
}: {
  size?: number;
  color?: "yellow" | "pink";
  className?: string;
}) {
  return (
    <img
      src="/images/logo.png"
      alt="Logo"
      width={size}
      height={size}
      className={cn("inline-block object-contain select-none shrink-0", className)}
      style={{ width: size, height: size }}
      loading="eager"
      decoding="async"
    />
  );
}
