import { cn } from "@/lib/cn";
import ImageSlot, { type Tone } from "./ImageSlot";

interface AvatarProps {
  alt: string;
  src?: string;
  objectPosition?: string;
  tone?: Tone;
  size?: number;
  /** Delay animasi melayang (detik), supaya beberapa avatar tidak bergerak serempak. */
  delay?: number;
  className?: string;
}

/** Avatar bulat kecil, border putih + ring pink, melayang pelan. */
export default function Avatar({
  alt,
  src,
  objectPosition = "center 20%",
  tone = "sunset",
  size = 44,
  delay = 0,
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "animate-float overflow-hidden rounded-full border-[3px] border-white shadow-paper ring-2 ring-pink",
        className
      )}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    >
      <ImageSlot
        alt={alt}
        src={src}
        objectPosition={objectPosition}
        tone={tone}
        className="size-full"
        sizes={`${size}px`}
      />
    </div>
  );
}
