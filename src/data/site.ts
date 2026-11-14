// SEMUA teks website (selain proyek & playground) ada di file ini. Ganti placeholder sesuka kamu.
import type { Accent } from "@/components/ui/colors";
import type { IconName } from "@/components/ui/Icons";
import type { Tone } from "@/components/ui/ImageSlot";

/** Gambar: isi `src` dengan path di folder /public (mis. "/images/me.jpg") untuk mengganti placeholder. */
export interface Picture {
  alt: string;
  src?: string;
  /** Fokus foto (CSS object-position), mis. "center 20%". */
  objectPosition?: string;
  tone?: Tone;
}

export const site = {
  name: "William Jovaski",
  metaTitle: "William Jovaski · Portfolio",
  metaDescription: "Portfolio NAMA KAMU: desain produk, case study, dan eksperimen kecil.",
  role: "AI & Data Science Enthusiast",
  location: "Jakarta, Indonesia",
  email: "william.jovaskii.com",
  status: "Open to new work and good problems",
  copyrightYear: 2026, // tahun di footer (statis, ubah manual)
  socials: [
    // color = warna tombol bulat di navbar
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/williamjovaski", icon: "instagram", color: "pink" },
    { id: "github", label: "GitHub", href: "https://github.com/WilliamJovaski", icon: "github", color: "yellow" },
  ] satisfies { id: string; label: string; href: string; icon: IconName; color: Accent }[],
};

/** Menu navbar. Item aktif ditentukan dari URL. */
export const nav: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/about", label: "About", icon: "user" },
  { href: "/case-study", label: "Case Study", icon: "grid" },
  { href: "/playground", label: "Playground", icon: "diamond" },
];

export const navContact = { href: "/contact", label: "Contact", icon: "heart" as IconName };

// ---------------------------------------------------------------- HOME

type NoteSlot = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const hero = {
  byline: "my name is",
  // Sticky note kecil di sekitar nama. slot = posisi relatif terhadap kotak nama (desktop).
  notes: [
    { text: "Make things", color: "mint", rotate: -4, slot: "top-left", variant: "pill" },
    { text: "Sweat the details", color: "peach", rotate: 3, slot: "top-right", variant: "pill" },
    { text: "AI & Data Scientist", color: "yellow", rotate: -3, slot: "bottom-left", variant: "note" },
    { text: "Jakarta, Indonesia", color: "mint", rotate: 4, slot: "bottom-right", variant: "note" },
  ] satisfies { text: string; color: Accent; rotate: number; slot: NoteSlot; variant: "pill" | "note" }[],
  // Tagline dua baris; ikon kecil muncul di akhir tiap baris.
  tagline: [
    { text: "Code, data, and", icon: "ring" },
    { text: "a bit of curiosity.", icon: "asterisk" },
  ] satisfies { text: string; icon: IconName }[],
  cta: { label: "Contact me", href: "/contact" },
  avatars: [
    {
      src: "/images/jojo-1.jpg",
      alt: "Foto profil William Jovaski 1",
      objectPosition: "center 20%",
      tone: "sunset",
    },
    {
      src: "/images/jojo-2.jpg",
      alt: "Foto profil William Jovaski 2",
      objectPosition: "center 20%",
      tone: "ocean",
    },
  ] satisfies Picture[],
};

export const whatsUp = {
  label: "about me!",
  chip: "what's up",
  bio: "I work across data science and AI, turning messy data into models people can actually use. ✨ I sweat the small stuff, especially the outliers most people skip.",
  polaroids: [
    // Polaroid pertama memakai foto profil dari src/data/about.ts (profilePhoto); di sini cukup caption-nya
    { alt: "Foto diri di luar ruangan", tone: "ocean", caption: "2026" },
    {src:"/images/workspace.jpeg",alt:"Foto meja kerja",tone: "night", caption: "my workspace"},
    { alt: "Foto meja kerja", tone: "night", caption: "my workspace" },
  ] satisfies (Picture & { caption: string })[],
  skills: [
    { label: "Machine Learning", color: "yellow" },
    { label: "Computer Vision", color: "green" },
    { label: "Data Analysis", color: "pink" },
    { label: "Model Deployment", color: "blue" },
  ] satisfies { label: string; color: Accent }[],
};

export const letsTalk = {
  heading: "Let's Talk",
  text: "Got a project, an interesting challenge, or just want to chat? Drop a message, I reply to everything.",
  cta: { label: "Say hello", href: "/contact" },
};

// ---------------------------------------------------------------- CASE STUDY

export const caseStudy = {
  label: "explore my work!",
  heading: "Featured Works",
  viewLabel: "View project",
  resultsLabel: "the results",
  resultsHeading: "The results",
  nextLabel: "Next project",
};

// ---------------------------------------------------------------- PLAYGROUND

export const playground = {
  label: "playground",
  heading: "Just for fun",
  hint: "psst, semua item di bawah bisa di-drag",
};

// ---------------------------------------------------------------- CONTACT

export const contact = {
  label: "say hi :)",
  heading: "Contact",
  cardText:
    "Have an opportunity, a project proposal, or just want to connect? My inbox is always open",
  button: "Send email",
  emailSubject: "william.jovaskii@gmail.com",
  note: "Open to new work, and good problems",
  polaroids: [
    // Polaroid pertama memakai foto profil dari src/data/about.ts (profilePhoto); di sini cukup caption-nya
    { alt: "Foto suasana senja", tone: "sunset", caption: "that's me" },
    {
      src: "/images/little-things.jpg",
      alt: "Foto suasana little things",
      tone: "mono",
      caption: "little things",
    },
  ] satisfies (Picture & { caption: string })[],
};

export const footer = {
  note: "Dream, build, scale.",
};
