"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface IntroContextValue {
  /** true setelah intro selesai/di-skip, atau kalau halaman pertama yang dibuka bukan "/". */
  introDone: boolean;
  finishIntro: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

/**
 * Status intro disimpan di memori (React state di root layout), tanpa localStorage.
 * Intro hanya tampil kalau halaman PERTAMA yang dibuka adalah "/". Reload penuh = intro tampil lagi.
 */
export function IntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Nilai awal hanya dihitung sekali saat load pertama
  const [introDone, setIntroDone] = useState(() => pathname !== "/");
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const value = useMemo(() => ({ introDone, finishIntro }), [introDone, finishIntro]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro harus dipakai di dalam <IntroProvider>");
  return ctx;
}
