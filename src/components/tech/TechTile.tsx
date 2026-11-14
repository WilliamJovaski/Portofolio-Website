import type { CSSProperties } from "react";
import type { Accent } from "@/components/ui/colors";
import Tape from "@/components/ui/Tape";
import { cn } from "@/lib/cn";
import TechLogo from "./TechLogo";
import type { TechTileData } from "./types";

interface TechTileProps extends TechTileData {
  color: Accent;
  /** Kemiringan kecil akhir (derajat). */
  tilt: number;
  tape?: boolean;
  className?: string;
}

/**
 * "Stiker" teknologi: tile persegi sudut sedikit membulat, latar pastel warna grup, border tinta 2px,
 * bayangan keras, logo di tengah, nama mono kecil di bawah. Hover: naik, lurus, bayangan menguat.
 */
export default function TechTile({ name, badge, logo, color, tilt, tape, className }: TechTileProps) {
  return (
    <div className={cn("group/tile flex flex-col items-center gap-2", className)}>
      <div
        className="relative grid size-[var(--tile)] rotate-(--tilt) place-items-center rounded-lg border-2 border-ink shadow-hard transition-[rotate,translate,box-shadow] duration-200 group-hover/tile:-translate-y-1.5 group-hover/tile:rotate-0 group-hover/tile:shadow-hard-lg motion-reduce:transition-none"
        style={
          {
            "--tilt": `${tilt}deg`,
            background: `color-mix(in srgb, var(--color-${color}) 25%, var(--color-paper-light))`,
          } as CSSProperties
        }
      >
        {tape && <Tape corner="tr" tint="white" className="-top-1.5! -right-3! h-3.5! w-10!" />}
        <TechLogo logo={logo} badge={badge} className="size-[calc(var(--tile)*0.46)]" />
      </div>
      <span className="max-w-[calc(var(--tile)+1.5rem)] text-center font-mono text-[10px] leading-tight font-bold tracking-wider uppercase">
        {name}
      </span>
    </div>
  );
}
