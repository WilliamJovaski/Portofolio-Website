"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { accentBg } from "@/components/ui/colors";
import { Icon } from "@/components/ui/Icons";
import ImageSlot from "@/components/ui/ImageSlot";
import Tape from "@/components/ui/Tape";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import ProjectActionButtons from "./ProjectActionButtons";

type Align = "left" | "center" | "right";
const ALIGNS: Align[] = ["left", "center", "right"];

// Tab trapesium: sisi yang menempel tepi kartu lurus, sisi lainnya dipotong diagonal
const tabShape: Record<Align, { clip: string; className: string }> = {
  left: { clip: "polygon(0 0, calc(100% - 26px) 0, 100% 100%, 0 100%)", className: "left-0 pr-11 pl-5" },
  center: {
    clip: "polygon(22px 0, calc(100% - 22px) 0, 100% 100%, 0 100%)",
    className: "left-[14%] px-10 sm:left-[24%]",
  },
  right: { clip: "polygon(26px 0, 100% 0, 100% 100%, 0 100%)", className: "right-0 pr-5 pl-11" },
};

// Kemiringan akhir frame gambar per kartu (derajat)
const FRAME_TILT = [-1.5, 1.8, -1.2];

const spring = { type: "spring", stiffness: 120, damping: 18, mass: 0.9 } as const;

interface ProjectStackCardProps {
  project: Project;
  index: number;
}

/**
 * Kartu proyek besar untuk tumpukan di Home: tab trapesium berwarna, teks kiri, frame gambar kanan
 * yang sedikit miring dan keluar dari kartu. Seluruh kartu adalah link ke /case-study/[slug].
 */
export default function ProjectStackCard({ project, index }: ProjectStackCardProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Parallax: frame bergerak sedikit lebih lambat dari teks saat scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  const align = ALIGNS[index % ALIGNS.length];
  const tab = tabShape[align];
  const tilt = FRAME_TILT[index % FRAME_TILT.length];
  // Posisikan polaroid di tengah vertikal kolom kanan dengan jarak aman agar tidak menabrak kartu di atas/bawah maupun tab kanan
  const frameMargin = "md:self-center md:my-4";

  const card: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: spring } };

  const text: Variants = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } };

  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 22 } },
      };

  const frame: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, rotate: tilt } }
    : {
        hidden: { opacity: 0, rotate: 4, scale: 0.96, y: 24 },
        show: { opacity: 1, rotate: tilt, scale: 1, y: 0, transition: { ...spring, delay: 0.1 } },
        hover: {
          y: -8,
          rotate: tilt + Math.sign(tilt) * 1.5,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        },
      };

  const tabMotion: Variants = reduce
    ? {}
    : {
        show: { x: 0 },
        hover: { x: align === "right" ? -8 : 8, transition: { type: "spring", stiffness: 300, damping: 20 } },
      };

  const rawCardAccent = project.theme ?? project.cardColor;
  const cardAccent = rawCardAccent === "yellow" ? "sky" : rawCardAccent;
  const tabAccent = project.tabColor ?? project.theme ?? project.cardColor;
  const folderText = (project.folderName || project.tabLabel).toUpperCase();
  const coverSrc = project.image || project.images.cover.src;

  return (
    <motion.article
      ref={ref}
      onClick={() => {
        if (project.hasCaseStudy) router.push(`/case-study/${project.slug}`);
      }}
      className={cn(
        "group relative block",
        project.hasCaseStudy && "cursor-pointer",
        accentBg[cardAccent]
      )}
      variants={card}
      initial="hidden"
      whileInView="show"
      whileHover="hover"
      whileFocus="hover"
      viewport={{ once: true, amount: 0.25 }}
    >
      {/* Tab menonjol di atas kartu -> menimpa bagian bawah kartu sebelumnya */}
      <motion.span
        variants={tabMotion}
        className={cn(
          "absolute bottom-[calc(100%-1px)] inline-flex h-10 items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em]",
          accentBg[tabAccent],
          tab.className
        )}
        style={{ clipPath: tab.clip }}
      >
        <Icon name="star" size={10} />
        {folderText}
      </motion.span>

      <div className="grid gap-10 px-6 pt-12 pb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-12 md:px-12 md:py-20">
        <motion.div variants={text} className="flex flex-col md:self-center">
          <motion.p
            variants={item}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {project.date}
          </motion.p>
          <motion.h3
            variants={item}
            className="mt-4 font-sans text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.02em]"
          >
            {project.title}
          </motion.h3>
          <motion.p variants={item} className="mt-4 line-clamp-2 max-w-[36ch] text-[15px] leading-relaxed">
            {project.description}
          </motion.p>
          <motion.div variants={item} className="mt-8">
            <ProjectActionButtons
              slug={project.slug}
              title={project.title}
              repoUrl={project.repoUrl}
              showViewProject={project.hasCaseStudy}
              isUpcoming={project.isUpcoming}
            />
          </motion.div>
        </motion.div>

        {/* Parallax di luar, animasi masuk/hover di dalam */}
        <motion.div style={{ y: reduce ? 0 : parallaxY }} className={cn("relative", frameMargin)}>
          <motion.div variants={frame} className="relative bg-white p-1.5 shadow-paper-lg">
            <Tape corner="tl" tint="gray" />
            <Tape corner="tr" tint="gray" />
            <div className="relative">
              <ImageSlot
                {...project.images.cover}
                src={coverSrc}
                variant={project.variant}
                fit="contain"
                className="aspect-[4/3] w-full"
                sizes="(min-width: 768px) 55vw, 100vw"
              />
              {project.isUpcoming && !coverSrc && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <span className="-rotate-3 rounded-md border-2 border-ink bg-yellow px-4 py-2 font-pixel text-2xl uppercase tracking-wider text-ink shadow-hard sm:text-3xl">
                    On Progress
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}
