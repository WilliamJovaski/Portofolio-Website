"use client";

import { useCallback, useSyncExternalStore } from "react";

/** true kalau media query cocok. Saat render server selalu false. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

const noopSubscribe = () => () => {};

/** Perangkat kecil & lemah (CPU <= 4 core atau RAM <= 2GB): animasi berat diganti yang ringan. */
export function useLowPowerDevice() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      const small = window.matchMedia("(max-width: 639px)").matches;
      return small && ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2);
    },
    () => false
  );
}

/** true setelah hydrate di browser (aman untuk createPortal ke document.body). */
export function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

/**
 * Seperti useReducedMotion dari Framer, tapi aman untuk hydration: saat render server & hydrate
 * bernilai false, lalu diperbarui di browser. Pakai ini kalau nilainya mengubah struktur DOM.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
