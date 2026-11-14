"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "framer-motion";
import Arrow from "@/components/ui/Arrow";
import { galleryText } from "@/data/gallery";
import { useLowPowerDevice, useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { CollageMemoryContext, type CollageMemory } from "./CollageMemory";
import FlipSheet from "./FlipSheet";
import GalleryView from "./GalleryView";
import PageCurl from "./PageCurl";
import { sheetPaperStyle } from "./paper";

/**
 * closed    : kolase di depan, gallery di-clip + inert
 * opening   : scroll ke atas stage, lalu lembar berputar 0 -> -180
 * open      : lembar disembunyikan, gallery bebas (tinggi halaman mengikuti gallery)
 * pre-close : scroll ke atas stage dulu (layout masih seperti "open")
 * closing   : gallery di-clip lagi, lembar muncul di -180 lalu berputar kembali ke 0
 */
type Phase = "closed" | "opening" | "open" | "pre-close" | "closing";

const GALLERY_ID = "playground-gallery";
const HEADING_ID = "playground-gallery-heading";
const URL_EVENT = "playground:view";
const EASE = [0.645, 0.045, 0.355, 1] as const;

const readUrlOpen = () => new URLSearchParams(window.location.search).get("view") === "gallery";

function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

/**
 * Selama entri ?view=gallery aktif, browser tidak boleh memulihkan posisi scroll sendiri saat Back
 * (itu membuat halaman melompat sebelum lembar sempat menutup). Dikembalikan ke "auto" setelah tertutup.
 */
const manualScroll = (on: boolean) => {
  window.history.scrollRestoration = on ? "manual" : "auto";
};

function setUrl(open: boolean, mode: "push" | "replace") {
  const url = open ? `${window.location.pathname}?view=gallery` : window.location.pathname;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event(URL_EVENT));
}

/** Scroll sampai sisi atas stage tepat di bawah navbar; selesai saat scroll berhenti. */
function scrollToStage(el: HTMLElement | null, smooth: boolean): Promise<void> {
  if (!el) return Promise.resolve();
  const navOffset = 72; // sama dengan scroll-padding-top di globals.css
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
  const distance = Math.abs(window.scrollY - target);
  if (distance < 4) return Promise.resolve();
  if (!smooth) {
    window.scrollTo({ top: target, behavior: "instant" });
    return Promise.resolve();
  }
  // Dari jauh di bawah: lompat dulu ke dekat atas supaya smooth scroll tetap singkat
  if (distance > window.innerHeight * 2) {
    window.scrollTo({ top: target + window.innerHeight, behavior: "instant" });
  }
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener("scrollend", done);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(done, 1200);
    window.addEventListener("scrollend", done);
    window.scrollTo({ top: target, behavior: "smooth" });
  });
}

/**
 * /playground sebagai buku: lembar depan = kolase (children), di baliknya = gallery.
 * Tampilan tercermin di URL (?view=gallery); tombol Back browser menutup lembar kembali.
 */
export default function PlaygroundBook({ children }: { children: ReactNode }) {
  // Versi aman-hydration: mode menentukan struktur DOM (sisi belakang lembar, bayangan)
  const reduce = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const lowPower = useLowPowerDevice();
  const mode = reduce || lowPower ? "fade" : "flip";

  const urlOpen = useSyncExternalStore(subscribeUrl, readUrlOpen, () => false);
  const [phase, setPhase] = useState<Phase>("closed");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Dibuka langsung lewat ?view=gallery: tampil terbuka tanpa animasi
  const effective: Phase = phase === "closed" && urlOpen ? "open" : phase;
  // Tampilan ditentukan dari state, bukan dari callback animasi:
  // galleryStatic = gallery tampil & tidak animasi -> lembar disembunyikan total, kolase di-unmount
  // collageStatic = kolase tampil & tidak animasi -> gallery disembunyikan total
  const galleryStatic = effective === "open" || effective === "pre-close";
  const collageStatic = effective === "closed";

  // Posisi item kolase disimpan di sini supaya tidak reset saat kolase di-mount ulang
  const [collage, setCollage] = useState<Pick<CollageMemory, "offsets" | "order" | "returning">>({
    offsets: {},
    order: null,
    returning: false,
  });
  const collageMemory = useMemo<CollageMemory>(
    () => ({
      ...collage,
      save: (id, x, y) => setCollage((c) => ({ ...c, offsets: { ...c.offsets, [id]: { x, y } } })),
      setOrder: (order) => setCollage((c) => ({ ...c, order })),
    }),
    [collage]
  );
  // Kolase akan di-mount ulang setelah ini -> tanpa animasi masuk
  const markReturning = () => setCollage((c) => (c.returning ? c : { ...c, returning: true }));

  const progress = useMotionValue(0);
  const galleryShadow = useTransform(progress, [0, 0.4, 1], [0, 1, 0]);

  const stageRef = useRef<HTMLDivElement>(null);
  const curlRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const phaseRef = useRef(phase);
  const prevPhaseRef = useRef(phase);
  /** Entri history ?view=gallery dibuat oleh tombol kita -> menutup cukup history.back(). */
  const pushedRef = useRef(false);
  /** Lembar harus mulai dari posisi terbuka penuh saat menutup (mis. setelah dibuka langsung via URL). */
  const startOpenRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  });

  const openGallery = () => {
    if (effective !== "closed") return;
    pushedRef.current = true;
    manualScroll(true);
    setUrl(true, "push");
    markReturning();
    setPhase("opening");
  };

  const closeGallery = () => {
    if (effective !== "open") return;
    if (phase === "closed") startOpenRef.current = true;
    markReturning();
    setPhase("pre-close");
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      setUrl(false, "replace");
    }
  };

  // Tombol Back/Forward browser
  useEffect(() => {
    const onPop = () => {
      const open = readUrlOpen();
      const p = phaseRef.current;
      if (!open && (p === "open" || p === "opening")) {
        setCollage((c) => (c.returning ? c : { ...c, returning: true }));
        setPhase("pre-close");
      } else if (open && (p === "closed" || p === "closing" || p === "pre-close")) {
        pushedRef.current = true;
        manualScroll(true);
        setCollage((c) => (c.returning ? c : { ...c, returning: true }));
        setPhase("opening");
      }
    };
    window.addEventListener("popstate", onPop);
    // Halaman bisa disembunyikan lalu ditampilkan lagi (state dipertahankan) dengan URL berbeda
    const id = window.requestAnimationFrame(() => {
      if (phaseRef.current === "open" && !readUrlOpen()) {
        progress.jump(0);
        setPhase("closed");
      }
    });
    return () => {
      window.removeEventListener("popstate", onPop);
      window.cancelAnimationFrame(id);
      manualScroll(false);
    };
  }, [progress]);

  // Jalankan animasi sesuai fase
  useEffect(() => {
    let cancelled = false;
    let controls: AnimationPlaybackControls | undefined;
    const transition = mode === "fade" ? { duration: 0.25, ease: "easeOut" as const } : { duration: 1, ease: EASE };

    async function run() {
      if (phase === "opening") {
        await scrollToStage(stageRef.current, !reduce);
        if (cancelled) return;
        controls = animate(progress, 1, transition);
        await controls;
        if (!cancelled) setPhase("open");
      } else if (phase === "pre-close") {
        await scrollToStage(stageRef.current, !reduce);
        if (cancelled) return;
        if (startOpenRef.current) {
          startOpenRef.current = false;
          progress.jump(1);
        }
        setPhase("closing");
      } else if (phase === "closing") {
        controls = animate(progress, 0, transition);
        await controls;
        if (!cancelled) setPhase("closed");
      }
    }
    void run();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [phase, mode, reduce, progress]);

  // Fokus: setelah terbuka -> judul GALLERY, setelah tertutup -> tombol lipatan
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (phase === "open" && prev === "opening") headingRef.current?.focus({ preventScroll: true });
    if (phase === "closed" && prev === "closing") {
      curlRef.current?.focus({ preventScroll: true });
      manualScroll(false);
    }
  }, [phase]);

  // Esc menutup gallery (kecuali lightbox sedang terbuka; Esc milik lightbox)
  useEffect(() => {
    if (effective !== "open" || lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      ref={stageRef}
      // overflow-y: clip -> proyeksi 3D lembar yang sedang berputar tidak menambah tinggi halaman
      className="relative grid overflow-y-clip perspective-[1400px] sm:perspective-[2000px]"
    >
      {/* Layer bawah (z-0): gallery. Tersembunyi saat kolase diam; saat animasi terlihat tapi di-clip
          setinggi lembar & inert; bebas hanya setelah lembar selesai terbuka. */}
      <section
        id={GALLERY_ID}
        aria-labelledby={HEADING_ID}
        inert={!galleryStatic}
        aria-hidden={!galleryStatic || undefined}
        className="relative z-0 col-start-1 row-start-1 rounded-sm border border-ink/10 shadow-paper"
        style={{
          ...sheetPaperStyle,
          ...(galleryStatic ? null : { contain: "size", overflow: "hidden" }),
          visibility: collageStatic ? "hidden" : "visible",
        }}
      >
        <GalleryView
          headingId={HEADING_ID}
          headingRef={headingRef}
          onBack={closeGallery}
          onLightboxChange={setLightboxOpen}
        />
        {/* Bayangan lembar yang sedang terangkat jatuh ke halaman gallery */}
        {mode === "flip" && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink/35 via-ink/10 to-transparent"
            style={{ opacity: galleryShadow }}
          />
        )}
      </section>

      {/* Layer atas (z-10): lembar kolase. Saat gallery diam, isinya tidak dirender sama sekali. */}
      <FlipSheet
        progress={progress}
        mode={mode}
        lift={!isMobile}
        hidden={galleryStatic}
        interactive={collageStatic}
        frontClassName="min-h-svh px-3 pt-10 pb-40 sm:px-6 md:px-10 md:pt-14 md:pb-36"
      >
        {galleryStatic ? null : (
          <CollageMemoryContext value={collageMemory}>
            {children}
            {/* Catatan + panah ke lipatan kertas */}
            <p className="pointer-events-none absolute right-[196px] bottom-[70px] -rotate-3 font-hand text-lg text-ink/80 sm:right-[184px] sm:bottom-16 sm:text-xl">
              {galleryText.curlNote}
              <Arrow direction="up-right" className="absolute top-4 -right-14 h-8 w-12 rotate-[58deg]" />
            </p>
            <PageCurl
              buttonRef={curlRef}
              label={galleryText.curl}
              expanded={effective !== "closed"}
              controls={GALLERY_ID}
              onClick={openGallery}
            />
          </CollageMemoryContext>
        )}
      </FlipSheet>
    </div>
  );
}
