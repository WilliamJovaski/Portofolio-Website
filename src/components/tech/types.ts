import type { Accent } from "@/components/ui/colors";

/** Logo yang sudah di-resolve di server: path SVG simple-icons + warna isi. */
export interface ResolvedLogo {
  path: string;
  color: string;
}

/** Item tech siap tampil (tanpa ketergantungan ke paket simple-icons). */
export interface TechTileData {
  name: string;
  badge: string;
  logo: ResolvedLogo | null;
}

export interface TechGroupData {
  id: string;
  label: string;
  note: string;
  color: Accent;
  arrow?: boolean;
  items: TechTileData[];
}
