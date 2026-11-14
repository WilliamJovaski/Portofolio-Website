import { cn } from "@/lib/cn";
import ImageSlot, { type Tone } from "./ImageSlot";
import Tape from "./Tape";

export interface PolaroidProps {
  alt: string;
  /** Foto asli di /public (mis. "/images/me.jpg"); kosong/tidak ada -> placeholder gradient. */
  src?: string;
  /** Fokus foto, mis. "center 20%". */
  objectPosition?: string;
  tone?: Tone;
  caption?: string;
  rotate?: number;
  /** Aspect ratio foto, default potret 4/5. */
  aspect?: string;
  /** Mode pas gambar: default "cover", bisa diisi "contain" atau "auto" (tinggi mengikuti rasio asli). */
  fit?: "cover" | "contain" | "auto";
  sizes?: string;
  className?: string;
}

/** Foto berbingkai putih (bawah lebih tebal), caption tulisan tangan, dua selotip di pojok atas. */
export default function Polaroid({
  alt,
  src,
  objectPosition,
  tone = "ocean",
  caption,
  rotate = 0,
  aspect = "aspect-[4/5]",
  fit = "cover",
  sizes = "(min-width: 1024px) 240px, 50vw",
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cn("relative bg-white p-2 shadow-paper", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Tape corner="tl" tint="blue" />
      <Tape corner="tr" tint="yellow" />
      <ImageSlot
        alt={alt}
        src={src}
        objectPosition={objectPosition}
        tone={tone}
        fit={fit}
        className={cn("w-full", aspect)}
        sizes={sizes}
      />
      <figcaption className="min-h-7 pt-2 text-center font-hand text-sm text-ink/80">
        {caption}
      </figcaption>
    </figure>
  );
}
