import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icons";
import { accentBg } from "@/components/ui/colors";
import { about } from "@/data/about";
import { cn } from "@/lib/cn";

/**
 * Floating sidebar kiri global (Resume, LinkedIn, Email):
 * - Posisi fixed di sisi kiri layar, tengah vertikal (top-1/2 -translate-y-1/2), z-40.
 * - Di mobile (< 768px) disembunyikan (hidden md:block) agar tidak menutupi konten utama.
 */
export default function SideTabs({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Link cepat"
      className={cn("fixed top-1/2 left-0 z-40 hidden -translate-y-1/2 md:block", className)}
    >
      <ul className="flex flex-col items-start gap-2.5">
        {about.tabs.map((tab) => {
          const external = tab.href.startsWith("http");
          return (
            <li key={tab.label}>
              <a
                href={tab.href}
                aria-label={tab.label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "flex items-center gap-2 rounded-r-xl border-2 border-l-0 border-ink py-2 pr-3 pl-3 shadow-hard transition-transform duration-200 hover:translate-x-2 focus-visible:translate-x-2 sm:w-[var(--tab-w)] sm:pl-4",
                  accentBg[tab.color]
                )}
                style={{ "--tab-w": `${tab.width}px` } as CSSProperties}
              >
                <Icon name={tab.icon} size={13} />
                <span className="hidden font-mono text-[11px] font-medium uppercase tracking-wider sm:inline">
                  {tab.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
