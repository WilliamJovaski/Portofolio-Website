// Data proyek: dipakai di Home (kartu bertumpuk), /case-study (kartu berdampingan) dan /case-study/[slug].
// Tambah proyek baru = tambah objek di array `projects`. Urutan tampil diatur lewat field `order` (terkecil di paling atas).
import type { Accent } from "@/components/ui/colors";
import type { Picture } from "./site";

export type ProjectVariant = "phones" | "photo";

/** Satu file gambar lokal yang dipakai bersama sebagai placeholder proyek baru. */
export const PROJECT_PLACEHOLDER_IMAGE = "/images/Projects/proyek1-cover.png";

export interface Project {
  /** Angka urut tampil: diurutkan `.sort((a, b) => a.order - b.order)` (angka terkecil tampil paling atas). */
  order: number;
  /** Bagian URL: /case-study/<slug> dan dipakai sebagai React `key={slug}`. */
  slug: string;
  /** Teks pada tab folder di tepi atas blok (huruf besar, mis. "HOLY-BIN"). */
  folderName: string;
  title: string;
  date: string; // tampil apa adanya, mis. "MAY , 2026"
  /** Teks preview singkat (maksimal 2 baris) untuk kartu di Home & /case-study. */
  description: string;
  /** Teks lengkap profesional untuk halaman detail (/case-study/[slug]). */
  detailDescription?: string;
  /** Path lokal gambar utama kartu proyek (kosongkan "" jika proyek masih upcoming). */
  image: string;
  /** URL YouTube embed preview khusus proyek tertentu (opsional, mis. "https://www.youtube.com/embed/PLACEHOLDER_ID?autoplay=1"). */
  videoUrl?: string;
  /** URL repository GitHub proyek (opsional; jika kosong tombol View Repository tidak ditampilkan). */
  repoUrl?: string;
  /** Apakah proyek memiliki halaman detail Case Study (mengatur tampil/tidaknya tombol View Project). */
  hasCaseStudy: boolean;
  /** Tandai true jika proyek masih On Progress / Upcoming (menampilkan badge On Progress). */
  isUpcoming?: boolean;
  /** Warna latar utama blok proyek (Home & Case Study). Teks otomatis putih di warna gelap (ink, blue, pink). */
  theme: Accent;
  /** Warna kartu (alias sinkron dengan `theme`). */
  cardColor: Accent;
  /** Warna tab trapesium di atas kartu bertumpuk (Home). */
  tabColor: Accent;
  /** Label tab kompatibilitas (sinkron dengan `folderName`). */
  tabLabel: string;
  /** "phones" = mockup dua HP, "photo" = foto/gradient. Berlaku untuk placeholder cover. */
  variant: ProjectVariant;
  /** Gambar cover & galeri untuk halaman detail Case Study. */
  images: { cover: Picture; gallery: Picture[] };
  category: string[];
  /** Teknologi yang dipakai: nama persis seperti di src/data/techstack.ts (logo ikut otomatis). */
  stack: string[];
  meta: { label: string; value: string; color: Accent }[];
  resultsIntro: string;
  stats: { value: string; label: string; color: Accent }[];
}

export const projects: Project[] = [
  // 1. Holy-Bin
  {
    order: 1,
    slug: "Holy-Bin",
    folderName: "HOLY-BIN",
    title: "Holy-Bin",
    date: "MARCH , 2026",
    description: "An AI-powered IoT smart bin system for automated waste sorting and real-time analytics.",
    detailDescription:
      "Holy-Bin is an end-to-end smart waste-sorting ecosystem that integrates YOLO-powered ESP32/MicroPython camera nodes with Flask and OpenCV edge computing. Each classification streams directly into a Next.js and Firebase web platform, enabling real-time waste tracking, operational monitoring, and actionable sustainability analytics.",
    image: "/images/Projects/proyek1-cover.png",
    videoUrl: "https://www.youtube.com/shorts/3Gqq4N6ulWk",
    repoUrl: "https://github.com/WilliamJovaski/Holy-Bin",
    hasCaseStudy: true,
    theme: "beige",
    cardColor: "beige",
    tabColor: "blue",
    tabLabel: "HOLY-BIN",
    variant: "photo",
    images: {
      cover: { src: "/images/Projects/proyek1-cover.png", alt: "Foto cover Holy-Bin", tone: "red" },
      gallery: [
        {
          src: "/images/Projects/holybin-1.jpeg",
          alt: "Tampilan sistem Holy-Bin",
          tone: "ocean",
        },
        {
          src: "/images/Projects/holybin-2.png",
          alt: "Hasil pengujian Holy-Bin",
          tone: "sunset",
        },
      ],
    },
    category: ["Mobility", "Consumer App"],
    stack: ["Next.js", "React", "Firebase"],
    meta: [
      { label: "Role", value: "ML Engineer", color: "sky" },
      { label: "Timeline", value: "3 Months", color: "yellow" },
      { label: "Platform", value: "Web & Mobile", color: "pink" },
    ],
    resultsIntro:
      "Ringkas hasil proyek di sini: masalah apa yang terselesaikan, metrik apa yang naik, dan pelajaran apa yang kamu bawa ke proyek berikutnya.",
    stats: [
      { value: "70%", label: "Detection accuracy", color: "sky" },
      { value: "2.04S", label: "Response time", color: "yellow" },
      { value: "A fully working end-to-end", label: "", color: "mint" },
    ],
  },

  // 2. HiraDraw
  {
    order: 2,
    slug: "HiraDraw",
    folderName: "HIRADRAW",
    title: "HiraDraw",
    date: "APRIL , 2026",
    description: "An interactive AI web app for practicing Japanese handwriting with real-time stroke recognition.",
    detailDescription:
      "HiraDraw is an interactive, AI-driven web application designed to help learners master Japanese scripts (Hiragana and Katakana). Powered by Computer Vision and Machine Learning models, the platform analyzes handwritten strokes on a digital canvas in real time and delivers instant character predictions with detailed accuracy scores.",
    image: "/images/Projects/hiradraw-cover.png",
    videoUrl: "https://youtu.be/SDILmfL2Ax0?si=dj7Xa4Mihhjq-Gcm?autoplay=1",
    repoUrl: "https://github.com/WilliamJovaski/Katakana",
    hasCaseStudy: true,
    theme: "ink",
    cardColor: "ink",
    tabColor: "ink",
    tabLabel: "HIRADRAW",
    variant: "phones",
    images: {
      cover: { src: "/images/Projects/hiradraw-cover.png", alt: "Mockup aplikasi HiraDraw", tone: "night" },
      gallery: [
        {
          src: "/images/Projects/hiradraw-1.png",
          alt: "Tampilan sistem HiraDraw",
          tone: "ocean",
        },
        {
          src: "/images/Projects/hiradraw-2.png",
          alt: "Hasil pengujian HiraDraw",
          tone: "sunset",
        },
      ],
    },
    category: ["Education", "AI / Machine Learning", "Web Application"],
    stack: ["Python", "CSS"],
    meta: [
      { label: "Role", value: "Data Pre-Processing", color: "sky" },
      { label: "Timeline", value: "4 Months", color: "yellow" },
      { label: "Platform", value: "iOS & Android", color: "peach" },
    ],
    resultsIntro:
      "Ringkas hasil proyek di sini: apa yang berubah setelah fitur dirilis, bagaimana pengguna merespons, dan angka apa yang paling penting.",
    stats: [
      { value: "97.3%", label: "Accuration of the best model(CNN)", color: "sky" },
      { value: "<100ms", label: "inference Real-time", color: "yellow" },
      { value: "69.0★", label: "SUS Score rating", color: "mint" },
    ],
  },

  // 3. AnabulNet
  {
    order: 3,
    slug: "AnabulNet",
    folderName: "ANABULNET",
    title: "AnabulNet",
    date: "OCTOBER , 2025",
    description:
      "A Java desktop application for pet shop management featuring interactive virtual pet browsing and dual user workflows.",
    detailDescription:
      "Anabul Net is a comprehensive Java-based desktop application designed to streamline pet shop operations and enhance the customer experience. Built with a Swing UI and integrated with a MySQL database via JDBC, the platform features tailored dual workflows: a secure admin dashboard for managing animal inventory, and an interactive customer portal where users can seamlessly browse, virtually interact with (feed, view info, and hear sounds), and purchase pets.",
    image: "/images/Projects/Cover_Anet.png",
    repoUrl: "https://github.com/WilliamJovaski/Java-Petshop_Project",
    hasCaseStudy: true,
    theme: "yellow",
    cardColor: "yellow",
    tabColor: "yellow",
    tabLabel: "ANABULNET",
    variant: "photo",
    images: {
      cover: { src: "/images/Projects/Cover_Anet.png", alt: "Cover AnabulNet", tone: "night" },
      gallery: [
        { src: "/images/Projects/Anet-1.png", alt: "Tampilan AnabulNet 1", tone: "lemon" },
        { src: "/images/Projects/Anet-2.png", alt: "Hasil AnabulNet 2", tone: "ocean" },
        { src: "/images/Projects/Anet-3.png", alt: "Hasil AnabulNet 3", tone: "ocean" },
        { src: "/images/Projects/Anet-4.png", alt: "Hasil AnabulNet 4", tone: "ocean" },
        { src: "/images/Projects/Anet-5.png", alt: "Hasil AnabulNet 5", tone: "ocean" },
        { src: "/images/Projects/Anet-6.png", alt: "Hasil AnabulNet 6", tone: "ocean" },
        { src: "/images/Projects/Anet-7.png", alt: "Hasil AnabulNet 7", tone: "ocean" },
        { src: "/images/Projects/Anet-8.png", alt: "Hasil AnabulNet 8", tone: "ocean" },
      ],
    },
    category: ["Management System", "Desktop App"],
    stack: ["Java", "MySql", "JDBC", "Java Swing"],
    meta: [
      { label: "Role", value: "Solo Developer", color: "sky" },
      { label: "Timeline", value: "2 Months", color: "yellow" },
      { label: "Platform", value: "Desktop", color: "peach" },
    ],
    resultsIntro:
      "Delivered a centralized platform that simplifies pet inventory management for admins, while providing customers with an interactive virtual experience before purchasing.",
    stats: [
      { value: "Live", label: "Database & inventory updates", color: "sky" },
      { value: "3", label: "Interactive virtual pet features (feed, view, listen)", color: "yellow" },
      { value: "Dual", label: "Secure Admin & Customer portals", color: "mint" },
    ],
  },

  // 4. Pioner
  {
    order: 4,
    slug: "Pioner",
    folderName: "PIONER",
    title: "Pioner",
    date: "MAY , 2026",
    description:
      "An exploratory data mining and visualization project analyzing European tourism trends and destinations.",
    detailDescription:
      "PIONER is a data-driven analytical project focused on extracting actionable insights from European travel destinations. By conducting in-depth Exploratory Data Analysis (EDA) and clustering, this project uncovers hidden tourism trends and destination patterns to support smarter travel strategies.",
    image: "/images/Projects/Pion-Cover.png",
    repoUrl: "https://github.com/WilliamJovaski/Pioner",
    hasCaseStudy: true,
    theme: "sky",
    cardColor: "sky",
    tabColor: "sky",
    tabLabel: "Pioner",
    variant: "photo",
    images: {
      cover: { src: "/images/Projects/Pion-Cover.png", alt: "Cover Pioner", tone: "night" },
      gallery: [
        { src: "/images/Projects/Pion-1.png", alt: "Tampilan Pioner 1", tone: "lemon" },
        { src: "/images/Projects/Pion-2.png", alt: "Hasil Pioner 2", tone: "ocean" },
        { src: "/images/Projects/Pion-3.png", alt: "Hasil Pioner 3", tone: "ocean" },
        { src: "/images/Projects/Pion-4.png", alt: "Hasil Pioner 4", tone: "ocean" },
        { src: "/images/Projects/Pion-5.png", alt: "Hasil Pioner 5", tone: "ocean" },
        { src: "/images/Projects/Pion-6.png", alt: "Hasil Pioner 6", tone: "ocean" },
        { src: "/images/Projects/Pion-7.png", alt: "Hasil Pioner 7", tone: "ocean" },
        { src: "/images/Projects/Pion-8.png", alt: "Hasil Pioner 8", tone: "ocean" },
      ],
    },
    category: ["Data Mining", "Data Visualization"],
    stack: ["Python", "Matplotlib & Seaborn", "Scikit-Learn"],
    meta: [
      { label: "Role", value: "Travel Data Analyst", color: "sky" },
      { label: "Timeline", value: "2 Months", color: "yellow" },
      { label: "Dataset", value: "Europe Destinations(Kaggle)", color: "mint" },
    ],
    resultsIntro:
      "Extracted key destination clusters and seasonal tourism patterns across Europe through exploratory data analysis and visual storytelling.",
    stats: [
      { value: "EDA", label: "In-depth exploratory data analysis", color: "sky" },
      { value: "Trends", label: "Mapped hidden European travel patterns", color: "yellow" },
      { value: "Cluster", label: "Grouped destinations by characteristics", color: "mint" },
    ],
  },

  // 5. Digital.In (slug tanpa titik agar routing Next.js aman, title tetap "Digital.In")
  {
    order: 5,
    slug: "Digital-In",
    folderName: "DIGITAL.IN",
    title: "Digital.In",
    date: "OCTOBER , 2026",
    description:
      "A platform connecting Indonesian SMEs with student talent, with built-in escrow and role-based access.",
    detailDescription:
      "Digital.in bridges the gap between small businesses and students looking for real-world experience. Business owners can post projects, students apply and deliver, and payments are held in escrow until both sides confirm — reducing trust risk on both sides. The platform supports role-based workflows for students, business owners, and admins, with OTP authentication and file upload for project deliverables.",
    image: "/images/Projects/Dig-Cover.png",
    repoUrl: "https://github.com/WilliamJovaski/Digitalin",
    hasCaseStudy: true,
    theme: "mint",
    cardColor: "mint",
    tabColor: "mint",
    tabLabel: "DigitalIn",
    variant: "photo",
    images: {
      cover: {
        src: "/images/Projects/Dig-Cover.png",
        alt: "Digital.In",
        tone: "ocean",
      },
      gallery: [
        { src: "/images/Projects/Dig-1.png", alt: "Tampilan Digital.In 1", tone: "lemon" },
        { src: "/images/Projects/Dig-2.png", alt: "Hasil Digital.In 2", tone: "ocean" },
        { src: "/images/Projects/Dig-3.png", alt: "Hasil Digital.In 3", tone: "ocean" },
        { src: "/images/Projects/Dig-4.png", alt: "Hasil Digital.In 4", tone: "ocean" },
        { src: "/images/Projects/Dig-5.png", alt: "Hasil Digital.In 5", tone: "ocean" },
        { src: "/images/Projects/Dig-6.png", alt: "Hasil Digital.In 6", tone: "ocean" },
        { src: "/images/Projects/Dig-7.png", alt: "Hasil Digital.In 7", tone: "ocean" },
        { src: "/images/Projects/Dig-8.png", alt: "Hasil Digital.In 8", tone: "ocean" },
      ],
    },
    category: ["Web Application"],
    stack: ["Next.js", "Laravel", "PostgreSQL"],
    meta: [
      { label: "Role", value: "Full Stack", color: "sky" },
      { label: "Timeline", value: "2 Months", color: "yellow" },
    ],
    resultsIntro:
      "Digital.in was built to solve a real trust problem between SMEs and students. Here’s what the platform delivers.",
    stats: [
      { value: "Escrow", label: "Secure Payment System", color: "sky" },
      { value: "3", label: "User roles supported", color: "yellow" },
      { value: "Full-Stack", label: "End-to-end implementation", color: "mint" },
    ],
  },

  // 6. Proyek 6 — UPCOMING / ON PROGRESS
  {
    order: 6,
    slug: "upcoming-project-6",
    folderName: "UPCOMING · 06",
    title: "Upcoming Project",
    date: "ON PROGRESS · 2026",
    description:
      "Currently in progress — building, testing, and documenting this project. Full case study and repository coming soon!",
    detailDescription:
      "This project is currently under active development. Stay tuned for the full case study, architecture breakdown, and repository.",
    image: "",
    repoUrl: "",
    hasCaseStudy: false,
    isUpcoming: true,
    theme: "peach",
    cardColor: "peach",
    tabColor: "peach",
    tabLabel: "UPCOMING · 06",
    variant: "photo",
    images: {
      cover: {
        alt: "Upcoming Project 06 — On Progress",
        tone: "sunset",
      },
      gallery: [],
    },
    category: ["Upcoming", "On Progress"],
    stack: ["Python"],
    meta: [
      { label: "Status", value: "On Progress", color: "yellow" },
      { label: "Release", value: "Coming Soon", color: "sky" },
    ],
    resultsIntro: "Proyek ini sedang dalam tahap pengerjaan (On Progress).",
    stats: [
      { value: "WIP", label: "In active development", color: "yellow" },
      { value: "2026", label: "Target completion", color: "sky" },
      { value: "Soon", label: "Case study & repo", color: "mint" },
    ],
  },

  // 7. Proyek 7 — UPCOMING / ON PROGRESS
  {
    order: 7,
    slug: "upcoming-project-7",
    folderName: "UPCOMING · 07",
    title: "Upcoming Project",
    date: "ON PROGRESS · 2026",
    description:
      "Currently in progress — exploring new datasets, model architectures, and end-to-end deployment. Stay tuned!",
    detailDescription:
      "This project is currently under active development. Stay tuned for the full case study, architecture breakdown, and repository.",
    image: "",
    repoUrl: "",
    hasCaseStudy: false,
    isUpcoming: true,
    theme: "pink",
    cardColor: "pink",
    tabColor: "pink",
    tabLabel: "UPCOMING · 07",
    variant: "phones",
    images: {
      cover: {
        alt: "Upcoming Project 07 — On Progress",
        tone: "rose",
      },
      gallery: [],
    },
    category: ["Upcoming", "On Progress"],
    stack: ["Python"],
    meta: [
      { label: "Status", value: "On Progress", color: "yellow" },
      { label: "Release", value: "Coming Soon", color: "sky" },
    ],
    resultsIntro: "Proyek ini sedang dalam tahap pengerjaan (On Progress).",
    stats: [
      { value: "WIP", label: "In active development", color: "yellow" },
      { value: "2026", label: "Target completion", color: "sky" },
      { value: "Soon", label: "Case study & repo", color: "mint" },
    ],
  },

  // 8. Proyek 8 — UPCOMING / ON PROGRESS
  {
    order: 8,
    slug: "upcoming-project-8",
    folderName: "UPCOMING · 08",
    title: "Upcoming Project",
    date: "ON PROGRESS · 2026",
    description:
      "Currently in progress — full write-up, evaluation metrics, and GitHub repository will be published soon.",
    detailDescription:
      "This project is currently under active development. Stay tuned for the full case study, architecture breakdown, and repository.",
    image: "",
    repoUrl: "",
    hasCaseStudy: false,
    isUpcoming: true,
    theme: "blue",
    cardColor: "blue",
    tabColor: "blue",
    tabLabel: "UPCOMING · 08",
    variant: "photo",
    images: {
      cover: {
        alt: "Upcoming Project 08 — On Progress",
        tone: "ocean",
      },
      gallery: [],
    },
    category: ["Upcoming", "On Progress"],
    stack: ["Python"],
    meta: [
      { label: "Status", value: "On Progress", color: "yellow" },
      { label: "Release", value: "Coming Soon", color: "sky" },
    ],
    resultsIntro: "Proyek ini sedang dalam tahap pengerjaan (On Progress).",
    stats: [
      { value: "WIP", label: "In active development", color: "yellow" },
      { value: "2026", label: "Target completion", color: "sky" },
      { value: "Soon", label: "Case study & repo", color: "mint" },
    ],
  },
];

/** Semua proyek diurutkan berdasarkan `order` (angka terkecil = paling atas). */
export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

/** Kartu bertumpuk di Home menampilkan semua proyek sesuai urutan `order`. */
export const HOME_PROJECT_LIMIT = projects.length;
export const homeProjects = sortedProjects;
