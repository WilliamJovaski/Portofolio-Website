"use client";

import { useSyncExternalStore } from "react";
import { fan, folder, hint, paper, papers, peek, timing } from "@/config/folder";

// Ukuran fallback untuk render di server (tanpa window).
const SERVER_WIDTH = 1280;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

const getWidth = () => window.innerWidth;
const getServerWidth = () => SERVER_WIDTH;

const rad = (deg: number) => (deg * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sudut kipas kertas ke-i, dibagi rata dari angles.start ke angles.end. */
function fanAngle(i: number, count: number, angles: { start: number; end: number }) {
  return count === 1 ? 0 : lerp(angles.start, angles.end, i / (count - 1));
}

/**
 * Semua ukuran dalam px, diturunkan dari folder.size (desktop/mobile) dengan rasio di config.
 * Juga menghitung skala kipas supaya tidak terpotong layar, dan offset vertikal supaya
 * grup folder + kipas terbuka tetap di tengah viewport.
 */
export function useResponsiveSize() {
  const width = useSyncExternalStore(subscribe, getWidth, getServerWidth);
  const isMobile = width < folder.mobileBreakpoint;

  const W = isMobile ? folder.size.mobile : folder.size.desktop;
  const H = W * folder.aspect;
  const pocketTop = H * folder.frontTop;
  const paperWidth = W * paper.widthRatio;
  const paperHeight = paperWidth * paper.heightRatio;

  // Pengaturan kipas (dengan override mobile)
  const fanCfg = isMobile ? { ...fan, ...fan.mobile } : fan;
  const count = papers.length;
  const mid = (count - 1) / 2;
  const fanAngles = papers.map((_, i) => fanAngle(i, count, fanCfg.angles));
  const fanStep = paperWidth * fanCfg.spacing;

  // Lebar setengah kipas (skala 1): pivot terjauh + sudut atas kertas yang diputar (w/2·cos + h·sin)
  let halfExtent = paperWidth / 2;
  for (let i = 0; i < count; i++) {
    const a = rad(Math.abs(fanAngles[i]));
    halfExtent = Math.max(
      halfExtent,
      Math.abs(i - mid) * fanStep + (paperWidth / 2) * Math.cos(a) + paperHeight * Math.sin(a)
    );
  }
  // Kipas mengecil otomatis di layar sempit
  const fanScale = Math.min(1, (width / 2 - fan.edgePadding) / halfExtent);

  // Seberapa tinggi kipas menjulang di atas sisi atas folder -> geser folder ke bawah setengahnya
  const hoverLift = W * paper.hover.lift;
  const fanRise = Math.max(
    0,
    paperHeight * fanScale * (fanCfg.outRatio + fan.centerLift) + hoverLift - pocketTop
  );

  return {
    viewportWidth: width,
    isMobile,
    folderWidth: W,
    folderHeight: H,
    pocketTop,
    paperWidth,
    paperHeight,
    fanScale,
    fanStep,
    fanAngles,
    fanOutRatio: fanCfg.outRatio,
    // Grup (kipas + folder) di tengah layar: folder turun setengah tinggi kipas
    offsetY: fanRise / 2,
    introSlideOffset: W * timing.introSlideOffset,
    floatDistance: W * folder.floatDistance,
    hoverLift: W * folder.hoverLift,
    paperHoverLift: hoverLift,
    pushAway: W * paper.pushAway,
    bob: W * paper.bob,
    peekDistance: W * peek.distance,
    peekSpreadX: W * peek.spreadX,
    hintFontSize: W * hint.fontSize,
    hintGap: W * hint.gap,
  };
}

export type Metrics = ReturnType<typeof useResponsiveSize>;
