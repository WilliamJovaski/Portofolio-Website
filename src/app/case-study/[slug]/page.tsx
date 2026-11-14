import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudyGallery from "@/components/projects/CaseStudyGallery";
import ProjectActionButtons from "@/components/projects/ProjectActionButtons";
import ProjectVideoPreview from "@/components/projects/ProjectVideoPreview";
import Chip from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icons";
import ImageSlot from "@/components/ui/ImageSlot";
import PixelHeading from "@/components/ui/PixelHeading";
import StickyNote from "@/components/ui/StickyNote";
import TechLogo from "@/components/tech/TechLogo";
import { getProject, projects } from "@/data/projects";
import { caseStudy } from "@/data/site";
import { findTech } from "@/data/techstack";
import { resolveLogo } from "@/lib/techIcons";

// Semua halaman proyek di-prerender saat build (wajib minimal 1 param dengan Cache Components)
export function generateStaticParams() {
  const slugs = new Set<string>();
  projects.forEach((p) => {
    slugs.add(p.slug);
    slugs.add(p.slug.toLowerCase());
  });
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return {
      title: "Project Not Found",
      description: "Halaman studi kasus proyek tidak ditemukan.",
    };
  }

  const fullTitle = `${project.title} · William Jovaski`;
  const rawDesc =
    project.detailDescription ||
    project.description ||
    `Studi kasus proyek ${project.title} oleh William Jovaski.`;
  const description = rawDesc.length > 155 ? `${rawDesc.slice(0, 151).trim()}...` : rawDesc;
  const canonicalUrl = `https://williamjovaski.com/case-study/${project.slug}`;

  return {
    title: project.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og-image.png"],
    },
  };
}

const metaTilt = [-2, 2, 1.5, -1.5];
const statTilt = [-2, 1.5, -1];

/** Layar 7 & 8: header proyek + sticky note meta, gambar hero, hasil (statistik) dan galeri. */
export default async function CaseStudyDetailPage({ params }: PageProps<"/case-study/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const ordered = [...projects].sort((a, b) => a.order - b.order).filter((p) => p.hasCaseStudy && !p.isUpcoming);
  const index = ordered.indexOf(project);
  const next = ordered.length > 1 && index !== -1 ? ordered[(index + 1) % ordered.length] : undefined;

  return (
    <article className="page-top mx-auto max-w-6xl px-4">
      <Link
        href="/case-study"
        className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border-[1.5px] border-ink bg-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-hard-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-yellow hover:shadow-hard focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-ink"
      >
        <Icon
          name="arrow-right"
          size={15}
          className="rotate-180 transition-transform duration-150 group-hover:-translate-x-0.5"
        />
        {caseStudy.heading}
      </Link>

      {/* Layar 7: judul + meta */}
      <header className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
            <span aria-hidden="true">●</span>
            {project.date}
          </p>
          <PixelHeading as="h1" size="xl" className="mt-2">
            {project.title}
          </PixelHeading>
          <p className="mt-4 max-w-md text-ink/80">{project.detailDescription ?? project.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.category.map((c) => (
              <li key={c}>
                <Chip color="beige">{c}</Chip>
              </li>
            ))}
          </ul>
          {/* Stack: logo kecil dari simple-icons (monogram kalau tidak tersedia) */}
          <ul aria-label="Tech stack" className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((name) => {
              const tech = findTech(name);
              return (
                <li
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider uppercase shadow-hard-sm"
                  style={{ background: `color-mix(in srgb, var(--color-${tech.color}) 25%, var(--color-paper-light))` }}
                >
                  <TechLogo logo={resolveLogo(tech.icon)} badge={tech.badge} size={14} />
                  {tech.name}
                </li>
              );
            })}
          </ul>

          <ProjectActionButtons
            slug={project.slug}
            title={project.title}
            repoUrl={project.repoUrl}
            showViewProject={false}
            className="mt-6"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          {project.meta.map((m, i) => (
            <StickyNote key={m.label} color={m.color} rotate={metaTilt[i % metaTilt.length]} className="h-full">
              <p className="font-mono text-[10px] uppercase tracking-wider opacity-90">{m.label}</p>
              <p className="mt-1 text-sm font-semibold">{m.value}</p>
            </StickyNote>
          ))}
        </div>
      </header>

      {project.videoUrl ? (
        <ProjectVideoPreview
          {...project.images.cover}
          videoUrl={project.videoUrl}
          title={project.title}
          variant={project.variant}
          fit="contain"
          className="mt-12 aspect-[16/10] w-full rounded-sm border border-ink/15 shadow-paper md:aspect-[16/9]"
          sizes="100vw"
          priority
        />
      ) : (
        <ImageSlot
          {...project.images.cover}
          variant={project.variant}
          fit="contain"
          className="mt-12 aspect-[16/10] w-full rounded-sm border border-ink/15 shadow-paper md:aspect-[16/9]"
          sizes="100vw"
          priority
        />
      )}

      {/* Layar 8: hasil */}
      <section aria-labelledby="results" className="mt-20">
        <p className="font-hand text-base text-ink/80">{caseStudy.resultsLabel}</p>
        <h2 id="results" className="font-sans text-2xl font-semibold tracking-tight md:text-3xl">
          {caseStudy.resultsHeading}
        </h2>
        <p className="mt-3 max-w-2xl text-ink/80">{project.resultsIntro}</p>

        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {project.stats.map((s, i) => (
            <li key={s.label}>
              <StickyNote color={s.color} torn rotate={statTilt[i % statTilt.length]} className="px-5 pt-4 pb-9">
                <p className="font-pixel text-6xl leading-none">{s.value}</p>
                <p className="mt-2 text-sm">{s.label}</p>
              </StickyNote>
            </li>
          ))}
        </ul>

        <CaseStudyGallery images={project.images.gallery} />
      </section>

      {next && (
        <Link
          href={`/case-study/${next.slug}`}
          className="group mt-20 flex items-center justify-between border-t border-dashed border-ink/25 pt-6"
        >
          <span>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-ink/80">
              {caseStudy.nextLabel}
            </span>
            <span className="font-pixel text-4xl uppercase md:text-5xl">{next.title}</span>
          </span>
          <Icon name="arrow-right" size={28} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </article>
  );
}
