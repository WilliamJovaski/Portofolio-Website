import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Size = "display" | "xl" | "lg" | "md";

// Ukuran responsif dengan clamp(min, ideal-vw, max)
const sizes: Record<Size, string> = {
  // Nama di hero: skala responsif otomatis dari mobile (48px) ke desktop (hingga 96px)
  display: "text-[clamp(48px,7vw,96px)]",
  xl: "text-[clamp(3.75rem,15vw,10rem)]",
  lg: "text-[clamp(3rem,10vw,7rem)]",
  md: "text-[clamp(2.25rem,6vw,4.25rem)]",
};

interface PixelHeadingProps {
  as?: ElementType;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/** Judul besar font pixel, hitam, uppercase. */
export default function PixelHeading({
  as: Tag = "h2",
  size = "lg",
  className,
  children,
}: PixelHeadingProps) {
  return (
    <Tag className={cn("font-pixel uppercase leading-[0.85] tracking-tight text-ink", sizes[size], className)}>
      {children}
    </Tag>
  );
}
