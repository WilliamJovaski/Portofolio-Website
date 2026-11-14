// HANYA dipanggil dari Server Component: paket simple-icons (~5MB) tidak ikut ke bundle browser.
// Client component cukup menerima hasilnya ({ path, color }).
import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import type { ResolvedLogo, TechGroupData } from "@/components/tech/types";
import type { TechGroup, TechItem } from "@/data/techstack";

const icons = simpleIcons as unknown as Record<string, SimpleIcon | undefined>;

/** Luminansi relatif (0 = hitam, 1 = putih) dari hex "RRGGBB". */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Warna merek, atau hitam tinta kalau terlalu pucat untuk latar pastel. */
function logoColor(hex: string) {
  return luminance(hex) > 0.42 ? "var(--color-ink)" : `#${hex}`;
}

/** slug simple-icons -> path + warna; null kalau ikon tidak ada (pakai monogram). */
export function resolveLogo(slug?: string): ResolvedLogo | null {
  if (!slug) return null;
  const icon = icons[`si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`];
  return icon?.path ? { path: icon.path, color: logoColor(icon.hex) } : null;
}

export const resolveItem = (item: TechItem) => ({ name: item.name, badge: item.badge, logo: resolveLogo(item.icon) });

export const resolveGroups = (groups: TechGroup[]): TechGroupData[] =>
  groups.map(({ items, ...group }) => ({ ...group, items: items.map(resolveItem) }));
