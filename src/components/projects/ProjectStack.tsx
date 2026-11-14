import ProjectStackCard from "./ProjectStackCard";
import { projects } from "@/data/projects";

/** Home: kartu proyek bertumpuk tanpa judul section (judul hanya untuk screen reader). */
export default function ProjectStack() {
  const orderedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y mx-auto max-w-6xl px-4">
      <h2 id="projects-title" className="sr-only">
        Proyek
      </h2>
      <ol>
        {orderedProjects.map((p, i) => (
          // Kartu berikutnya di atas kartu sebelumnya; tab-nya menimpa 40px bagian bawah kartu sebelumnya
          <li key={p.slug} className="relative" style={{ zIndex: i + 1 }}>
            <ProjectStackCard project={p} index={i} />
          </li>
        ))}
      </ol>
    </section>
  );
}
