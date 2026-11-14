// Konten & dekorasi halaman /about. Foto profil di sini juga dipakai di Home ("what's up") dan Contact.
import type { CSSProperties } from "react";
import type { Accent } from "@/components/ui/colors";
import type { IconName } from "@/components/ui/Icons";
import { site, type Picture } from "./site";

/**
 * FOTO PROFIL: taruh file di public/images/ (lihat public/images/README.md), lalu ganti `src`.
 * Kalau file belum ada / src kosong, otomatis tampil placeholder gradient.
 * objectPosition menggeser fokus foto, mis. "center 20%" = sedikit ke atas (wajah).
 */
export const profilePhoto: Picture = {
  src: "/images/me.jpeg",
  alt: "Foto William Jovaski",
  objectPosition: "center 20%",
  tone: "ocean",
};

const linkedin = site.socials.find((s) => s.id === "linkedin")?.href ?? "#";

type DecorationKind = "postcard" | "stamp" | "star";

export interface Decoration {
  kind: DecorationKind;
  /** "card" = relatif ke kartu bio, "heading" = relatif ke judul ABOUT. */
  anchor: "card" | "heading";
  /** Posisi absolute (px) terhadap anchor: left/right/top/bottom. Nilai negatif = keluar dari garis. */
  position: Pick<CSSProperties, "left" | "right" | "top" | "bottom">;
  rotate: number;
  /** Sembunyikan di layar kecil supaya tidak sesak. */
  hideOnMobile?: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
  width: number;
  height: number;
  href?: string;
  color: Accent;
}

export const about = {
  heading: "About",
  bioLabel: "Main bio",
  bioHand:
    "I’m a Data Scientist & AI Engineer who turns messy data into AI people actually use. I care about the small details and ship work that works outside the notebook. 🤖",
  paragraphs: [
    "I’m a Computer Science student at BINUS, specializing in Data Science. I’ve built a real-time waste-sorting smart bin, a diabetes risk screener with explainable AI, and a Japanese handwriting recognizer. I learned that a good model is only half the job; the rest is clean data and solid deployment.",
    "I thrive in fast-moving, collaborative teams, shaped by Agile sprints and leading at BNCC and as a Google Student Ambassador. I love problems where data meets people. Outside of code, you’ll find me hiking mountains, playing volleyball, or strumming my guitar. ⛰️🏐🎸.",
  ],
  polaroid: { caption: "hi, it's me", rotate: 3.5 },
  // Tag kecil di bawah polaroid (ada panah ke sudut kiri-bawah foto)
  tag: { text: "hello!", rotate: -6 },
  // Tab warna yang menempel di tepi kiri layar. width = lebar tab (px) di layar >= sm.
  tabs: [
    // Resume: taruh file PDF di public/resume.pdf (atau ganti href ke link Google Drive)
    { label: "Email for resume", href: `mailto:${site.email}`, icon: "mail", color: "blue", width: 150 },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/william-jovaski", icon: "linkedin", color: "pink", width: 136 },
  ] satisfies { label: string; href: string; icon: IconName; color: Accent; width: number }[],
  // Sertifikat di bawah kartu bio. Klik kartu untuk melihat foto sertifikat penuh (lightbox).
  certificates: {
    label: "Certificates",
    note: "proof I did the homework",
    items: [
      {
        id: "cert-aws-trainee-badge",
        title: "AWS Academy Graduate - Cloud Architecting - Training Badge",
        issuer: "AWS Academy",
        year: "2026",
        image: "/images/certificates/aws-cloud-architecting.png",
        width: 1024,
        height: 791,
        color: "yellow",
      },
      {
        id: "cert-hackerrank-sql",
        title: "SQL (Advanced) Certificate of Accomplishment",
        issuer: "HackerRank",
        year: "2026",
        image: "/images/certificates/hackerrank-sql-advanced.png",
        width: 1024,
        height: 780,
        color: "mint",
      },
      {
        id: "cert-microsoft-ai-900",
        title: "Microsoft AI-900 Preparation: Azure AI Fundamentals",
        issuer: "Microsoft & GreatNusa (BINUS University)",
        year: "2026",
        image: "/images/certificates/microsoft-ai-900-prep.png",
        width: 1024,
        height: 724,
        color: "sky",
      },
      {
        id: "cert-hands-on-ai",
        title: "Bootcamp Practical AI: Hands-On AI Deployment",
        issuer: "HIMTI BINUS University Malang",
        year: "2025",
        image: "/images/certificates/hands-on-ai.png",
        width: 1024,
        height: 723,
        color: "peach",
      },
      {
        id: "cert-backend-dev-bncc",
        title: "Back-End Development (Distinction)",
        issuer: "BNCC (Bina Nusantara Computer Club)",
        year: "2025",
        image: "/images/certificates/backend-dev-bncc.png",
        width: 979,
        height: 696,
        color: "yellow",
      },
      {
        id: "cert-beelingua-c",
        title: "Beelingua Verified Certificate: Advanced English (CEFR C2.1)",
        issuer: "Beelingua - BINUS University",
        year: "2026",
        image: "/images/certificates/beelingua-c.png",
        width: 1024,
        height: 726,
        color: "mint",
      },
      {
        id: "cert-beelingua-b",
        title: "Beelingua Verified Certificate: English Independent User (CEFR B2.2)",
        issuer: "Beelingua - BINUS University",
        year: "2026",
        image: "/images/certificates/beelingua-b.png",
        width: 1024,
        height: 726,
        color: "sky",
      },
    ] satisfies CertificateItem[],
  },
  // Stiker tempelan. Ubah posisi/rotasi di sini; maksimal 3-4 supaya tidak ramai.
  decorations: [
    { kind: "postcard", anchor: "card", position: { left: -34, bottom: -46 }, rotate: -8 },
    { kind: "stamp", anchor: "card", position: { right: -30, bottom: -54 }, rotate: 6, hideOnMobile: true },
    { kind: "star", anchor: "heading", position: { left: "100%", top: -6 }, rotate: 12, hideOnMobile: true },
  ] satisfies Decoration[],
};
