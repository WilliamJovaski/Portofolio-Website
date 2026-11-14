import type { Metadata } from "next";
import ProjectGridCard from "@/components/projects/ProjectGridCard";
import PixelHeading from "@/components/ui/PixelHeading";
import { projects } from "@/data/projects";
import { caseStudy } from "@/data/site";

export const metadata: Metadata = {
  title: "Case Study",
  description:
    "Koleksi studi kasus proyek AI, Machine Learning, dan Computer Vision yang dikerjakan oleh William Jovaski secara mendalam dan terstruktur.",
  alternates: {
    canonical: "https://williamjovaski.com/case-study",
  },
  openGraph: {
    title: "Case Study · William Jovaski",
    description:
      "Koleksi studi kasus proyek AI, Machine Learning, dan Computer Vision yang dikerjakan oleh William Jovaski secara mendalam dan terstruktur.",
    url: "https://williamjovaski.com/case-study",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study · William Jovaski",
    description:
      "Koleksi studi kasus proyek AI, Machine Learning, dan Computer Vision yang dikerjakan oleh William Jovaski secara mendalam dan terstruktur.",
    images: ["/og-image.png"],
  },
};

/** Featured Works: label tulisan tangan, judul pixel, lalu semua proyek berdampingan (2 kolom di desktop). */
export default function CaseStudyPage() {
  const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className="page-top mx-auto max-w-6xl px-4 pb-6">
      <p className="font-hand text-lg text-ink/80">{caseStudy.label}</p>
      <PixelHeading as="h1" size="lg" className="mt-1">
        {caseStudy.heading}
      </PixelHeading>

      <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {orderedProjects.map((p, i) => (
          <li key={p.slug}>
            <ProjectGridCard project={p} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
