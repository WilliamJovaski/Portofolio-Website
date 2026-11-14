import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { accentBg, type Accent } from "./colors";
import { tornClipPath } from "./torn";

interface StickyNoteProps {
  color?: Accent;
  /** Kemiringan dalam derajat. */
  rotate?: number;
  /** Tepi bawah sobek (zig-zag). */
  torn?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Kotak pastel sedikit miring dengan bayangan tipis, seperti post-it. */
export default function StickyNote({
  color = "yellow",
  rotate = 0,
  torn = false,
  as: Tag = "div",
  className,
  children,
}: StickyNoteProps) {
  return (
    // Bayangan pakai drop-shadow di wrapper supaya tetap terlihat walau clip-path aktif
    <div
      className="drop-shadow-note"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Tag
        className={cn("px-3 py-2", accentBg[color], torn && "pb-4", className)}
        style={torn ? { clipPath: tornClipPath({ bottom: true, teeth: 22, depth: 6 }) } : undefined}
      >
        {children}
      </Tag>
    </div>
  );
}
