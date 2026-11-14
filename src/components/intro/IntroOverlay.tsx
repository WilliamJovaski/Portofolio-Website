"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "@/components/preloader/Preloader";
import FolderIntro from "@/components/preloader/FolderIntro";
import { papers } from "@/config/folder";
import { useIntro } from "./IntroProvider";

// State machine intro: greeting -> folder-intro (buka/tutup folder dikelola di FolderIntro)
type Stage = "greeting" | "folder-intro";

/**
 * Overlay intro full-screen di atas website. Diletakkan di root layout (bukan di page)
 * supaya tetap hidup saat route berganti dan tidak terpengaruh transform animasi halaman.
 */
export default function IntroOverlay() {
  const { introDone, finishIntro } = useIntro();
  if (introDone) return null;
  return <IntroSequence onDone={finishIntro} />;
}

function IntroSequence({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("greeting");
  // exit.target: halaman tujuan (klik kertas) atau null (skip -> tetap di Home)
  const [exit, setExit] = useState<{ target: string | null } | null>(null);

  const leaving = exit !== null;
  // Backdrop putih baru memudar setelah halaman tujuan benar-benar tampil, jadi Home tidak sempat berkedip
  const arrived = exit !== null && (exit.target === null || pathname === exit.target);

  // Kunci scroll halaman di belakang selama intro tampil
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Prefetch halaman tujuan kertas begitu folder muncul, supaya navigasi instan
  useEffect(() => {
    if (stage === "folder-intro") papers.forEach((p) => router.prefetch(p.href));
  }, [stage, router]);

  const select = (href: string) => {
    if (leaving) return;
    setExit({ target: href });
    router.push(href);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-white"
      style={{ pointerEvents: leaving ? "none" : "auto" }}
      initial={false}
      animate={{ opacity: arrived ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (arrived) onDone();
      }}
    >
      {/* Konten intro (sapaan/folder) memudar duluan saat keluar */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 0.97 : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* mode="wait": sapaan fade-out dulu, baru folder masuk */}
        <AnimatePresence mode="wait">
          {stage === "greeting" ? (
            <motion.div key="greeting" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Preloader onComplete={() => setStage("folder-intro")} />
            </motion.div>
          ) : (
            <FolderIntro key="folders" onSelect={select} />
          )}
        </AnimatePresence>
      </motion.div>

      <button
        type="button"
        onClick={() => setExit({ target: null })}
        className="fixed right-4 bottom-4 z-[10000] rounded-full border-[1.5px] border-ink bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink shadow-hard-sm transition-colors hover:bg-yellow"
      >
        skip →
      </button>
    </motion.div>
  );
}
