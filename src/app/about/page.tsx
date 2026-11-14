import type { Metadata } from "next";
import CertificatesSection from "@/components/about/CertificatesSection";
import Decorations from "@/components/about/Decorations";
import OrganizationTimeline from "@/components/about/OrganizationTimeline";
import Arrow from "@/components/ui/Arrow";
import PixelHeading from "@/components/ui/PixelHeading";
import Polaroid from "@/components/ui/Polaroid";
import StickyNote from "@/components/ui/StickyNote";
import { about, profilePhoto } from "@/data/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pelajari profil, latar belakang pendidikan, perjalanan organisasi, serta keahlian AI dan data science William Jovaski.",
  alternates: {
    canonical: "https://williamjovaski.com/about",
  },
  openGraph: {
    title: "About · William Jovaski",
    description:
      "Pelajari profil, latar belakang pendidikan, perjalanan organisasi, serta keahlian AI dan data science William Jovaski.",
    url: "https://williamjovaski.com/about",
    type: "profile",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About · William Jovaski",
    description:
      "Pelajari profil, latar belakang pendidikan, perjalanan organisasi, serta keahlian AI dan data science William Jovaski.",
    images: ["/og-image.png"],
  },
};

// Kolom konten (judul + kartu). Kiri diberi ruang untuk tab di tepi layar saat layar >= md.
const column = "mx-auto w-full max-w-[960px] px-4 md:pr-4 md:pl-[170px] xl:px-4";

/** Layar 4: ABOUT besar, tab warna di tepi kiri, kartu bio transparan + polaroid, stiker tempelan. */
export default function AboutPage() {
  return (
    <div className="page-top pb-24">
      <div className={column}>
        <div className="relative w-fit">
          <PixelHeading as="h1" size="xl">
            {about.heading}
          </PixelHeading>
          <Decorations items={about.decorations} anchor="heading" />
        </div>
      </div>

      {/* Wrapper full-width */}
      <div className="relative mt-14 md:mt-20">
        <div className={column}>
          <div className="relative">
            {/* Label MAIN BIO menimpa garis atas kartu */}
            <span className="absolute top-0 left-6 z-10 -translate-y-1/2 md:left-8">
              <span className="inline-block -rotate-2 rounded-[4px] bg-yellow px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider border-[1.5px] border-ink shadow-hard-sm">
                {about.bioLabel}
              </span>
            </span>

            {/* Kartu hampir transparan: garis notebook tetap terlihat */}
            <article className="grid gap-10 rounded-md border-[1.5px] border-yellow/60 bg-white/35 p-6 pt-12 pb-16 md:p-10 md:pb-14 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:gap-8">
              {/* Teks: di mobile di bawah polaroid */}
              <div className="order-2 lg:order-1">
                <p className="font-hand text-[clamp(1.3rem,2.2vw,1.7rem)] leading-relaxed">{about.bioHand}</p>
                {about.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-5 text-sm leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </div>

              {/* Polaroid di pojok kanan atas kartu (desktop: 320px, tablet: 260px, mobile: 200px di tengah) */}
              <div className="relative order-1 mx-auto mb-12 w-[200px] self-start sm:w-[260px] lg:order-2 lg:-mt-16 lg:-mr-14 lg:mb-0 lg:ml-auto lg:w-[320px] lg:max-w-[320px]">
                <Polaroid
                  {...profilePhoto}
                  caption={about.polaroid.caption}
                  rotate={about.polaroid.rotate}
                  fit="auto"
                  aspect="h-auto"
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 200px"
                />
                {/* Panah dari tag ke sudut kiri-bawah polaroid */}
                <Arrow direction="up-left" className="absolute top-full left-3 mt-1 hidden h-7 w-9 sm:block" />
                <div className="absolute top-full left-12 mt-5">
                  <StickyNote
                    color="yellow"
                    rotate={about.tag.rotate}
                    className="px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider"
                  >
                    {about.tag.text}
                  </StickyNote>
                </div>
              </div>
            </article>

            <Decorations items={about.decorations} anchor="card" />
          </div>

          <OrganizationTimeline />

          <CertificatesSection />
        </div>
      </div>
    </div>
  );
}
