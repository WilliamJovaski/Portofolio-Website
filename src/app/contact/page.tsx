import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icons";
import PixelHeading from "@/components/ui/PixelHeading";
import Polaroid from "@/components/ui/Polaroid";
import SelectionBox from "@/components/ui/SelectionBox";
import StickyNote from "@/components/ui/StickyNote";
import { buttonClass } from "@/components/ui/button";
import { profilePhoto } from "@/data/about";
import { contact, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hubungi William Jovaski untuk kolaborasi proyek kecerdasan buatan, konsultasi data science, atau peluang karier profesional.",
  alternates: {
    canonical: "https://williamjovaski.com/contact",
  },
  openGraph: {
    title: "Contact · William Jovaski",
    description:
      "Hubungi William Jovaski untuk kolaborasi proyek kecerdasan buatan, konsultasi data science, atau peluang karier profesional.",
    url: "https://williamjovaski.com/contact",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact · William Jovaski",
    description:
      "Hubungi William Jovaski untuk kolaborasi proyek kecerdasan buatan, konsultasi data science, atau peluang karier profesional.",
    images: ["/og-image.png"],
  },
};

/** Layar 10: CONTACT dalam kotak seleksi, kartu kuning + tombol email, polaroid, link sosial. */
export default function ContactPage() {
  // Polaroid kiri = foto profil (diganti sekali di src/data/about.ts)
  const left = { ...contact.polaroids[0], ...profilePhoto };
  const right = contact.polaroids[1];
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(contact.emailSubject)}`;

  return (
    <div className="page-top relative mx-auto max-w-6xl px-4 text-center">
      {/* Polaroid samping (desktop) */}
      <div className="absolute top-16 left-4 hidden w-52 lg:block">
        <Polaroid {...left} rotate={-6} />
      </div>
      <div className="absolute top-72 right-4 hidden w-48 lg:block">
        <Polaroid {...right} rotate={5} />
      </div>

      <p className="font-hand text-lg text-ink/80">{contact.label}</p>
      <SelectionBox color="blue" className="mt-2">
        <PixelHeading as="h1" size="lg">
          {contact.heading}
        </PixelHeading>
      </SelectionBox>

      <div className="mx-auto mt-10 max-w-xl">
        <StickyNote color="yellow" rotate={-1.5} className="p-6 text-left md:p-8">
          <p className="font-mono text-[13px] uppercase leading-relaxed tracking-wide">{contact.cardText}</p>
          <a
            href={mailto}
            className={buttonClass("solid", "mt-6")}
          >
            <Icon name="mail" size={13} />
            {contact.button}
          </a>
        </StickyNote>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 font-hand text-lg">
        <svg aria-hidden="true" viewBox="0 0 40 20" className="w-9 text-ink">
          <path d="M2 4q14 14 34 8m-6-6 6 6-7 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {contact.note}
      </p>

      {/* Polaroid versi mobile/tablet */}
      <div className="mt-10 flex justify-center gap-6 lg:hidden">
        <Polaroid {...left} rotate={-5} className="w-36" />
        <Polaroid {...right} rotate={4} className="w-36" />
      </div>

      <ul className="mx-auto mt-12 flex w-fit gap-1 rounded-md border-[1.5px] border-ink bg-white p-1.5 shadow-hard">
        {site.socials.map((s) => (
          <li key={s.id}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1 rounded-sm px-4 py-2 transition-colors hover:bg-yellow"
            >
              <Icon name={s.icon} size={18} />
              <span className="font-mono text-[10px] uppercase tracking-wider">{s.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
