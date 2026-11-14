// Tech stack: SATU-SATUNYA sumber konten section TECH STACK di Home dan chip stack di /case-study/[slug].
// Tambah teknologi = tambah satu objek di `items`. Hapus = hapus objeknya.
//   icon  : slug simple-icons (lihat https://simpleicons.org, mis. "nextdotjs" untuk Next.js).
//           Kalau slug tidak ada di simple-icons, otomatis tampil monogram dari `badge` (build tidak gagal).
//   badge : 1-3 huruf untuk monogram cadangan.
import type { Accent } from "@/components/ui/colors";

export interface TechItem {
  name: string;
  icon?: string;
  badge: string;
}

export interface TechGroup {
  id: string;
  label: string;
  /** Catatan tulisan tangan kecil di samping label grup. */
  note: string;
  /** Warna chip label & latar pastel tile. */
  color: Accent;
  /** Tampilkan panah kecil di catatan grup ini (pakai di satu grup saja). */
  arrow?: boolean;
  items: TechItem[];
}

export const techStack = {
  label: "what I build with",
  heading: "Tech Stack",
  groups: [
    {
      id: "languages",
      label: "Languages",
      note: "where it all starts",
      color: "yellow",
      arrow: true,
      items: [
        { name: "Python", icon: "python", badge: "Py" },
        // Java tidak ada di simple-icons -> monogram
        { name: "Java", icon: "java", badge: "JV" },
        { name: "C", icon: "c", badge: "C" },
        { name: "C++", icon: "cplusplus", badge: "C++" },
        { name: "JavaScript", icon: "javascript", badge: "JS" },
      ],
    },
    {
      id: "frameworks",
      label: "Frameworks & Libraries",
      note: "the building blocks",
      color: "mint",
      items: [
        { name: "Next.js", icon: "nextdotjs", badge: "N" },
        { name: "React", icon: "react", badge: "Re" },
        { name: "Node.js", icon: "nodedotjs", badge: "No" },
        { name: "Flask", icon: "flask", badge: "Fl" },
        { name: "Streamlit", icon: "streamlit", badge: "St" },
        { name: "Pandas", icon: "pandas", badge: "Pd" },
        { name: "NumPy", icon: "numpy", badge: "Np" },
        { name: "OpenCV", icon: "opencv", badge: "CV" },
        { name: "Ultralytics YOLO", icon: "ultralytics", badge: "YO" },
        // XGBoost tidak ada di simple-icons -> monogram
        { name: "XGBoost", icon: "xgboost", badge: "XGB" },
      ],
    },
    {
      id: "tools",
      label: "Tools & Platforms",
      note: "everything around the code",
      color: "sky",
      items: [
        { name: "Git", icon: "git", badge: "Git" },
        { name: "GitHub", icon: "github", badge: "GH" },
        { name: "Firebase", icon: "firebase", badge: "Fb" },
        // AWS & Microsoft Excel tidak ada di simple-icons -> monogram
        { name: "AWS", icon: "amazonwebservices", badge: "AWS" },
        { name: "MySQL", icon: "mysql", badge: "SQL" },
        { name: "Microsoft Excel", icon: "microsoftexcel", badge: "XL" },
        { name: "ESP32", icon: "espressif", badge: "ESP" },
        { name: "MicroPython", icon: "micropython", badge: "µPy" },
      ],
    },
  ] satisfies TechGroup[],
};

/** Cari teknologi berdasarkan nama (untuk chip stack per proyek). */
export function findTech(name: string): TechItem & { color: Accent } {
  for (const group of techStack.groups) {
    const item = group.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (item) return { ...item, color: group.color };
  }
  return { name, badge: name.slice(0, 2), color: "white" };
}
