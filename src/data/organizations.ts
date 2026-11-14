// Data pengalaman organisasi untuk section ORGANIZATION EXPERIENCE di halaman /about.
// Taruh foto asli di public/images/organizations/ (lihat public/images/organizations/README.md).
// Selama file foto belum ada, <Polaroid> otomatis menampilkan placeholder gradient dari `tone`.
import type { Accent } from "@/components/ui/colors";
import type { Tone } from "@/components/ui/ImageSlot";

export interface OrganizationPhoto {
  src: string;
  alt: string;
  /** Fokus foto (CSS object-position), mis. "center 20%". */
  objectPosition?: string;
  /** Caption tulisan tangan di bawah polaroid. */
  caption?: string;
  /** Warna placeholder gradient kalau file foto belum ada. */
  tone?: Tone;
  /** Aspect ratio bingkai polaroid (default aspect-[4/5]). */
  aspect?: string;
  /** Mode pas gambar (default "cover", bisa "contain" agar tidak terpotong sama sekali). */
  fit?: "cover" | "contain" | "auto";
}

export interface OrganizationEntry {
  id: string;
  role: string;
  organization: string;
  location?: string;
  period: string;
  current?: boolean;
  description: string;
  tags?: string[];
  color: Accent;
  photos: OrganizationPhoto[];
}

export const organizationSection = {
  label: "Organization Experience",
  note: "where I've been involved",
  heading: "Organizations",
  currentNote: "still going!",
  nowBadge: "NOW",
} as const;

export const organizations: OrganizationEntry[] = [
  {
    id: "bncc",
    role: "External Event Organizer - Staff",
    organization: "Bina Nusantara Computer Club (BNCC)",
    location: "Malang, Indonesia",
    period: "Jan 2025 - Present",
    current: true,
    description:
      "Spearheaded collaborative tech events by managing strategic stakeholder relationships and orchestrating end-to-end logistics, ensuring flawless program delivery and successful external partnerships.",
    tags: ["Events", "Partnerships", "Tech Community"],
    color: "yellow",
    photos: [
      {
        src: "/images/organizations/bncc-1.jpeg",
        alt: "Dokumentasi kegiatan kolaborasi komunitas BCC x BNCC",
        objectPosition: "center 25%",
        caption: "bncc events",
        tone: "ocean",
      },
      {
        src: "/images/organizations/bncc-2.jpeg",
        alt: "Sesi foto studio pengurus EEO 37 BNCC",
        objectPosition: "center 30%",
        caption: "event crew",
        tone: "lemon",
      },
      {
        src: "/images/organizations/bncc-3.jpg",
        alt: "Sesi briefing dan apresiasi bersama anggota tim EEO BNCC",
        objectPosition: "center 25%",
        caption: "eeo briefing",
        tone: "sunset",
        aspect: "aspect-[16/10]",
        fit: "contain",
      },
    ],
  },
  {
    id: "gsa",
    role: "Google Student Ambassador",
    organization: "Google",
    period: "Apr - Aug 2026",
    description:
      "Bridged the gap between student communities and technology solutions by spearheading campus engagement campaigns that successfully promoted practical AI applications.",
    tags: ["AI", "Community", "Campus Outreach"],
    color: "mint",
    photos: [
      {
        src: "/images/organizations/gsa-1.jpeg",
        alt: "Aktivasi Google Gemini Campus Tour bersama komunitas mahasiswa",
        objectPosition: "center 25%",
        caption: "gemini tour",
        tone: "forest",
      },
      {
        src: "/images/organizations/gsa-2.jpg",
        alt: "Pertemuan nasional #TeamGoogle Student Ambassador di panggung utama",
        objectPosition: "center 35%",
        caption: "team google",
        tone: "sunset",
        aspect: "aspect-[16/10]",
        fit: "contain",
      },
      {
        src: "/images/organizations/gsa-3.jpg",
        alt: "Google Student Ambassadors berkumpul memegang ID paspor di booth acara",
        objectPosition: "center 30%",
        caption: "gsa cohort",
        tone: "ocean",
        aspect: "aspect-[16/10]",
        fit: "contain",
      },
    ],
  },
  {
    id: "phinla",
    role: "Event Educator",
    organization: "PHINLA 2 Earth Day",
    period: "Apr - May 2026",
    description:
      "Facilitated environmental and waste-sorting education campaigns in collaboration with Divers Clean Action and Wahana Visi Indonesia to raise public awareness on sustainability.",
    tags: ["Education", "Sustainability", "Social Impact"],
    color: "sky",
    photos: [
      {
        src: "/images/organizations/phinla-1.jpg",
        alt: "Kampanye pemilahan sampah di Jakarta Car Free Day bersama tim PHINLA",
        objectPosition: "center 30%",
        caption: "cfd campaign",
        tone: "ocean",
      },
      {
        src: "/images/organizations/phinla-2.jpg",
        alt: "Edukasi lingkungan dan pembagian kipas kampanye kepada anak-anak",
        objectPosition: "center 25%",
        caption: "waste sorting",
        tone: "forest",
        aspect: "aspect-[16/10]",
        fit: "contain",
      },
      {
        src: "/images/organizations/phinla-3.jpg",
        alt: "Relawan PHINLA mengedukasi peserta CFD mengenai pemilahan sampah",
        objectPosition: "center 30%",
        caption: "green action",
        tone: "lemon",
      },
    ],
  },
  {
    id: "fep",
    role: "Freshmen Leader",
    organization: "Student Orientation Program",
    period: "Aug - Sep 2025",
    description:
      "Guided first-year students through their university transition by directing interactive sessions and delivering tailored academic advice, resulting in accelerated student adaptation and active campus engagement.",
    tags: ["Mentoring", "Leadership", "Orientation"],
    color: "peach",
    photos: [
      {
        src: "/images/organizations/fep-1.JPG",
        alt: "Karnaval budaya orientasi kampus bersama mahasiswa baru mengenakan hiasan kepala tradisional",
        objectPosition: "center 25%",
        caption: "cultural day",
        tone: "sunset",
      },
      {
        src: "/images/organizations/fep-2.jpg",
        alt: "Kebersamaan mentor First Year Program dengan kaos seragam saat movie break di bioskop",
        objectPosition: "center 30%",
        caption: "mentoring crew",
        tone: "rose",
      },
      {
        src: "/images/organizations/fep-3.jpg",
        alt: "Foto bersama seluruh tim Freshmen Leader berseragam almamater marun di lapangan kampus",
        objectPosition: "center 25%",
        caption: "freshmen leader",
        tone: "lemon",
      },
    ],
  },
  // {
  //   id: "volley",
  //   role: "Educator",
  //   organization: "Volley BINUS Malang",
  //   location: "Malang, Indonesia",
  //   period: "2025 - 2026",
  //   description:
  //     "Coached and mentored student members in fundamental techniques, court strategy, and team coordination through structured training sessions to build competitive readiness and sportsmanship.",
  //   tags: ["Sports", "Coaching", "Teamwork"],
  //   color: "yellow",
  //   photos: [
  //     {
  //       src: "/images/organizations/volley-1.jpg",
  //       alt: "Tim Volley BINUS Malang merayakan gelar juara Rector Cup di lapangan olahraga",
  //       objectPosition: "center 30%",
  //       caption: "rector cup champs",
  //       tone: "lemon",
  //     },
  //     {
  //       src: "/images/organizations/volley-2.jpg",
  //       alt: "Briefing strategi tim Volley BINUS Malang",
  //       objectPosition: "center 25%",
  //       caption: "team drill",
  //       tone: "sunset",
  //     },
  //     {
  //       src: "/images/organizations/volley-3.jpg",
  //       alt: "Pertandingan persahabatan anggota Volley BINUS Malang",
  //       objectPosition: "center 30%",
  //       caption: "game day",
  //       tone: "ocean",
  //     },
  //   ],
  //},
  {
    id: "blu",
    role: "BLU Ambassador",
    organization: "BCA Digital",
    location: "Malang, Indonesia",
    period: "2026 - 2027",
    description:
      "Represented blu by BCA Digital on campus through financial literacy campaigns, student community activations, and digital banking onboarding initiatives.",
    tags: ["Ambassador", "Digital Banking", "Community"],
    color: "mint",
    photos: [
      {
        src: "/images/organizations/blu-1.jpg",
        alt: "William di panggung Welcome to blUnion bluAmbassador Jabodetabek",
        objectPosition: "center 25%",
        caption: "blu ambassador",
        tone: "ocean",
      },
      {
        src: "/images/organizations/blu-2.jpg",
        alt: "Booth dan aktivasi komunitas kampus blu by BCA Digital",
        objectPosition: "center 30%",
        caption: "campus booth",
        tone: "forest",
      },
      {
        src: "/images/organizations/blu-3.jpg",
        alt: "Tim BLU Ambassador di acara mahasiswa",
        objectPosition: "center 25%",
        caption: "blu squad",
        tone: "lemon",
      },
    ],
  },
];
