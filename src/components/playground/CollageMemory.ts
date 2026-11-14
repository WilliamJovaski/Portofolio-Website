"use client";

import { createContext, useContext } from "react";

/**
 * Posisi drag & urutan tumpukan item kolase, disimpan di luar <Collage>.
 * Kolase di-unmount saat gallery tampil; saat di-mount lagi posisinya tidak reset.
 */
export interface CollageMemory {
  offsets: Record<string, { x: number; y: number }>;
  /** Urutan tumpukan (id terakhir = paling atas); null = urutan data. */
  order: string[] | null;
  /** Kolase sudah pernah tampil -> saat di-mount ulang tidak perlu animasi masuk. */
  returning: boolean;
  save: (id: string, x: number, y: number) => void;
  setOrder: (order: string[]) => void;
}

export const CollageMemoryContext = createContext<CollageMemory | null>(null);

export const useCollageMemory = () => useContext(CollageMemoryContext);
