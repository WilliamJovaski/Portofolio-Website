import type { Ref } from "react";

interface PageCurlProps {
  label: string;
  expanded: boolean;
  controls: string;
  onClick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

/** Ikon kamera kecil (SVG inline). */
function CameraIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.3l1.5-2h7.4l1.5 2h2.3A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

/**
 * Pojok kanan bawah lembar yang terlipat ("page curl"). Segitiga bawah = halaman di baliknya
 * (berisi label), segitiga atas = punggung kertas yang terlipat (gradient abu-krem + bayangan).
 */
export default function PageCurl({ label, expanded, controls, onClick, buttonRef }: PageCurlProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={`Buka ${label.toLowerCase()} foto`}
      onClick={onClick}
      className="group absolute right-0 bottom-0 z-20 size-[136px] cursor-pointer outline-offset-[-10px] sm:size-[120px]"
    >
      <span className="absolute inset-0 origin-bottom-right transition-transform duration-300 ease-out group-hover:scale-[1.12] group-focus-visible:scale-[1.12] group-active:scale-[1.06] motion-reduce:transition-none">
        {/* Halaman di bawah yang "terlihat" karena pojok terangkat */}
        <span aria-hidden="true" className="absolute inset-0 bg-ink" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
        <span className="absolute top-[70%] left-[70%] flex -translate-x-1/2 -translate-y-1/2 -rotate-45 items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.14em] whitespace-nowrap text-white uppercase">
          <CameraIcon />
          {label}
          <span aria-hidden="true">→</span>
        </span>
        {/* Lipatan kertas + bayangan lembut ke arah lembar */}
        <span aria-hidden="true" className="absolute inset-0 drop-shadow-[-3px_-3px_5px_color-mix(in_srgb,var(--color-ink)_18%,transparent)]">
          <span
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-beige), var(--color-ink) 8%) 0%, var(--color-beige) 22%, var(--color-paper-light) 44%, color-mix(in srgb, var(--color-beige), var(--color-ink) 4%) 50%)",
            }}
          />
        </span>
      </span>
    </button>
  );
}
