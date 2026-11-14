import { cn } from "@/lib/cn";
import FallbackImage from "./FallbackImage";

// Preset gradient untuk gambar placeholder, semuanya diturunkan dari warna palet (globals.css).
export type Tone = "sunset" | "night" | "ocean" | "lemon" | "mono" | "rose" | "forest" | "red";

const tones: Record<Tone, string> = {
  sunset: "linear-gradient(160deg, var(--color-peach) 0%, var(--color-pink) 55%, color-mix(in srgb, var(--color-pink), var(--color-ink) 55%) 100%)",
  night: "linear-gradient(160deg, color-mix(in srgb, var(--color-green), var(--color-ink) 72%) 0%, color-mix(in srgb, var(--color-green), var(--color-ink) 90%) 60%, var(--color-ink) 100%)",
  ocean: "linear-gradient(170deg, var(--color-sky) 0%, var(--color-blue) 55%, color-mix(in srgb, var(--color-blue), var(--color-ink) 55%) 100%)",
  lemon: "linear-gradient(160deg, color-mix(in srgb, var(--color-yellow), white 55%) 0%, var(--color-yellow) 60%, color-mix(in srgb, var(--color-yellow), var(--color-ink) 25%) 100%)",
  mono: "linear-gradient(160deg, var(--color-paper) 0%, color-mix(in srgb, var(--color-paper), var(--color-ink) 40%) 55%, color-mix(in srgb, var(--color-paper), var(--color-ink) 78%) 100%)",
  rose: "linear-gradient(160deg, color-mix(in srgb, var(--color-pink), white 70%) 0%, var(--color-pink) 60%, color-mix(in srgb, var(--color-pink), var(--color-ink) 50%) 100%)",
  forest: "linear-gradient(170deg, color-mix(in srgb, var(--color-mint), white 45%) 0%, var(--color-green) 55%, color-mix(in srgb, var(--color-green), var(--color-ink) 60%) 100%)",
  red: "linear-gradient(150deg, var(--color-peach) 0%, color-mix(in srgb, var(--color-pink), var(--color-ink) 18%) 45%, color-mix(in srgb, var(--color-pink), var(--color-ink) 62%) 100%)",
};

export interface ImageSlotProps {
  /** Wajib: deskripsi gambar untuk screen reader. */
  alt: string;
  /**
   * Isi dengan path gambar asli (mis. "/images/foto.jpg" di folder public) untuk mengganti placeholder.
   * Gambar otomatis memakai next/image dengan object-cover.
   */
  src?: string;
  /** Fokus foto (CSS object-position), mis. "center 20%". Default "center". */
  objectPosition?: string;
  tone?: Tone;
  /** "phones" menggambar mockup dua HP di atas gradient. */
  variant?: "photo" | "phones";
  /** Mode pas gambar: default "cover", "contain", atau "auto" (mengikuti rasio asli gambar). */
  fit?: "cover" | "contain" | "auto";
  quality?: number;
  /** Atur ukuran / aspect ratio lewat className (mis. "aspect-[4/3] w-full"). */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Slot gambar tunggal untuk seluruh website. Tanpa `src` -> placeholder CSS/SVG.
 * Dengan `src` -> next/image; kalau file tidak ada / gagal dimuat, otomatis kembali ke placeholder.
 * Cukup ganti di data (src/data) tanpa menyentuh komponen.
 */
export default function ImageSlot({
  alt,
  src,
  objectPosition = "center",
  tone = "mono",
  variant = "photo",
  fit = "cover",
  quality,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
}: ImageSlotProps) {
  const placeholder = (
    <div
      role="img"
      aria-label={alt}
      className={cn(fit === "auto" ? "relative aspect-[16/10] w-full" : "absolute inset-0")}
      style={fit === "auto" ? { background: tones[tone] } : undefined}
    >
      {variant === "phones" ? <PhoneMockup /> : <PhotoShapes />}
    </div>
  );

  return (
    // Gradient selalu jadi latar dasar (kecuali mode "auto" yang tingginya pas mengikuti gambar asli)
    <div
      className={cn("relative overflow-hidden", className)}
      style={fit === "auto" ? undefined : { background: tones[tone] }}
    >
      {src ? (
        <FallbackImage
          key={src}
          src={src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          objectPosition={objectPosition}
          fit={fit}
          quality={quality}
          fallback={placeholder}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}

/** Bentuk samar (matahari + bukit) supaya placeholder terasa seperti foto. */
function PhotoShapes() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full opacity-30 mix-blend-soft-light"
    >
      <circle cx="72" cy="28" r="12" fill="#fff" />
      <path d="M0 78 28 52l18 16 22-24 32 34v22H0z" fill="var(--color-ink)" />
    </svg>
  );
}

/** Dua HP saling tumpang tindih, miring berlawanan; bagian bawahnya terpotong tepi frame. */
function PhoneMockup() {
  const phones = [
    { className: "left-[16%] top-[16%] w-[34%] -rotate-8", screen: "from-mint to-green/80" },
    { className: "left-[44%] top-[7%] z-10 w-[36%] rotate-6", screen: "from-green/80 to-mint/70" },
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Cahaya lembut di belakang HP */}
      <div className="absolute top-[10%] left-1/2 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-green/15 blur-2xl" />
      {phones.map((p, i) => (
        <div
          key={i}
          className={cn(
            "absolute aspect-[9/18] max-w-[190px] rounded-[1.5rem] border-[5px] border-ink bg-ink p-[5%] shadow-[0_20px_40px_color-mix(in_srgb,var(--color-ink)_55%,transparent)]",
            p.className
          )}
        >
          <div className="mx-auto mb-[8%] h-1.5 w-1/4 rounded-full bg-white/10" />
          <div className={cn("mb-[8%] h-[9%] rounded-md bg-linear-to-r", p.screen)} />
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded bg-white/20" />
            <div className="h-2 w-1/2 rounded bg-white/20" />
            <div className="mt-3 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((k) => (
                <div key={k} className="aspect-square rounded-full bg-white/10" />
              ))}
            </div>
            <div className="h-2 w-2/3 rounded bg-white/20" />
            <div className="h-10 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
