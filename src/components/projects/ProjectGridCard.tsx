"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { accentBg } from "@/components/ui/colors";
import ImageSlot from "@/components/ui/ImageSlot";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import ProjectActionButtons from "./ProjectActionButtons";

// Tab dengan potongan diagonal di sisi kanan
const tabClip = "polygon(0 0, calc(100% - 24px) 0, 100% 100%, 0 100%)";

interface ProjectGridCardProps {
  project: Project;
  index: number;
}

/** Kartu proyek berdampingan untuk /case-study: tab tanggal + frame berwarna, caption judul & tombol di bawah. */
export default function ProjectGridCard({ project, index }: ProjectGridCardProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const color = accentBg[project.theme ?? project.cardColor];
  const coverSrc = project.image || project.images.cover.src;

  return (
    <motion.article
      onClick={() => {
        if (project.hasCaseStudy) router.push(`/case-study/${project.slug}`);
      }}
      className={cn("group block", project.hasCaseStudy && "cursor-pointer")}
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={
        reduce ? { duration: 0.4 } : { type: "spring", stiffness: 120, damping: 20, delay: (index % 2) * 0.1 }
      }
    >
      <div
        className={cn(
          "relative pt-9 transition-transform duration-300 group-hover:-translate-y-1.5 motion-reduce:transform-none",
          index % 2 ? "group-hover:rotate-[0.6deg]" : "group-hover:-rotate-[0.6deg]"
        )}
      >
        <span
          className={cn(
            "absolute top-0 left-0 inline-flex h-9 items-center gap-2 pr-11 pl-4 font-mono text-[11px] uppercase tracking-[0.14em]",
            color
          )}
          style={{ clipPath: tabClip }}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          {project.date}
        </span>
        <div
          className={cn(
            "p-3 shadow-paper transition-shadow duration-300 group-hover:shadow-paper-lg",
            color
          )}
        >
          <div className="relative overflow-hidden">
            <ImageSlot
              {...project.images.cover}
              src={coverSrc}
              variant={project.variant}
              fit="contain"
              className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
            />
            {project.isUpcoming && !coverSrc && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <span className="-rotate-3 rounded-md border-2 border-ink bg-yellow px-3.5 py-1.5 font-pixel text-xl uppercase tracking-wider text-ink shadow-hard">
                  On Progress
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <h2 className="mt-5 text-center font-sans text-lg font-medium tracking-tight md:text-xl">{project.title}</h2>
      <p className="mx-auto mt-1 line-clamp-2 max-w-[40ch] text-center text-sm text-ink/80">{project.description}</p>
      <ProjectActionButtons
        slug={project.slug}
        title={project.title}
        repoUrl={project.repoUrl}
        showViewProject={project.hasCaseStudy}
        isUpcoming={project.isUpcoming}
        className="mt-4 justify-center"
      />
    </motion.article>
  );
}
