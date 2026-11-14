import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SelectionBoxProps {
  color?: "red" | "blue";
  className?: string;
  children: ReactNode;
}

const colors = {
  red: "border-pink",
  blue: "border-blue",
} as const;

const handles = ["-left-1.5 -top-1.5", "-right-1.5 -top-1.5", "-left-1.5 -bottom-1.5", "-right-1.5 -bottom-1.5"];

/** Kotak seleksi ala Figma: border tipis + 4 handle kotak kecil di pojok. */
export default function SelectionBox({ color = "red", className, children }: SelectionBoxProps) {
  const border = colors[color];
  return (
    <div className={cn("relative inline-block border-[1.5px] px-5 pt-3.5 pb-2.5 sm:px-7 sm:pt-4 sm:pb-3 md:px-9 md:pt-5 md:pb-3.5", border, className)}>
      {children}
      {handles.map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={cn("absolute size-2.5 border-[1.5px] bg-white", border, pos)}
        />
      ))}
    </div>
  );
}
