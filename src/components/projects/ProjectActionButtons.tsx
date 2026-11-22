"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { caseStudy } from "@/data/site";
import { cn } from "@/lib/cn";

interface ProjectActionButtonsProps {
  slug: string;
  title: string;
  repoUrl?: string;
  /** Di kartu proyek tampilkan keduanya; di halaman detail Case Study cukup tombol repo. */
  showViewProject?: boolean;
  /** Jika proyek masih Upcoming / On Progress, tampilkan badge status. */
  isUpcoming?: boolean;
  className?: string;
}

const btnBase =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider shadow-hard-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

/** Tombol aksi proyek: "View Project" (Primary CTA: Blue solid) & "View Repository" (Secondary: White outline). */
export default function ProjectActionButtons({
  slug,
  title,
  repoUrl,
  showViewProject = true,
  isUpcoming = false,
  className,
}: ProjectActionButtonsProps) {
  const hasRepo = Boolean(repoUrl && repoUrl.trim().length > 0);
  if (!showViewProject && !hasRepo && !isUpcoming) return null;

  return (
    <div className={cn("relative z-10 flex flex-wrap items-center gap-3", className)}>
      {isUpcoming && !showViewProject && !hasRepo && (
        <span className="inline-flex min-h-10 items-center gap-2.5 rounded-full border-[1.5px] border-dashed border-ink bg-paper-light px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink">
          <span aria-hidden="true" className="size-2.5 rounded-full border border-ink bg-blue" />
          <span>Upcoming · On Progress</span>
        </span>
      )}

      {showViewProject && (
        <Link
          href={`/case-study/${slug}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            btnBase,
            "border-ink bg-primary text-white hover:bg-primary-hover active:bg-ink"
          )}
        >
          <span>{caseStudy.viewLabel}</span>
          <Icon name="arrow-up-right" size={14} />
        </Link>
      )}

      {hasRepo && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View repository for ${title} on GitHub`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            btnBase,
            "border-primary bg-white text-primary-hover hover:border-ink hover:bg-sky hover:text-ink active:bg-yellow"
          )}
        >
          <GitHubIcon size={16} />
          <span>View Repository</span>
        </a>
      )}
    </div>
  );
}
