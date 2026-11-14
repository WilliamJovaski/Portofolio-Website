import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import Avatar from "@/components/ui/Avatar";
import Chip from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icons";
import PixelHeading from "@/components/ui/PixelHeading";
import SelectionBox from "@/components/ui/SelectionBox";
import StickyNote from "@/components/ui/StickyNote";
import { buttonClass } from "@/components/ui/button";
import { hero, site } from "@/data/site";
import { cn } from "@/lib/cn";

// Posisi sticky note relatif terhadap kotak nama (desktop). Note bawah berada DI LUAR sudut kotak,
// diberi jarak selebar panah (mr-9 / ml-9) supaya tidak menimpa handle maupun teks nama.
const slotPosition = {
  "top-left": "right-full top-0 mr-4 -translate-y-1/2",
  "top-right": "left-full top-0 ml-4 -translate-y-1/2",
  "bottom-left": "right-full top-full mr-9 mt-3",
  "bottom-right": "left-full top-full ml-9 mt-3",
} as const;

function Note({ note }: { note: (typeof hero.notes)[number] }) {
  return note.variant === "pill" ? (
    <Chip color={note.color} rotate={note.rotate}>
      {note.text}
    </Chip>
  ) : (
    <StickyNote
      color={note.color}
      rotate={note.rotate}
      className="whitespace-nowrap px-3.5 py-2 font-hand text-[clamp(11px,1.2vw,15px)] sm:px-4 sm:py-2.5"
    >
      {note.text}
    </StickyNote>
  );
}

/** Layar 1: nama besar dalam kotak seleksi, sticky note + panah, tagline, CTA, avatar melayang. */
export default function Hero() {
  return (
    <section className="page-top relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-16 text-center md:pb-24">
      {/* Avatar melayang kiri & kanan (diperbesar 25% dari 48px ke 60px) */}
      <Avatar {...hero.avatars[0]} size={60} className="absolute left-[3%] top-[58%] hidden sm:block md:left-[8%] lg:left-[10%]" />
      <Avatar
        {...hero.avatars[1]}
        size={60}
        delay={1.5}
        className="absolute right-[3%] top-[64%] hidden sm:block md:right-[8%] lg:right-[10%]"
      />

      <p className="font-hand text-[clamp(13px,1.5vw,16px)] text-ink/80">
        {hero.byline}
        <svg aria-hidden="true" viewBox="0 0 80 8" className="mx-auto -mt-1 block w-16 text-ink">
          <path d="M2 5q10-4 20 0t20 0 20 0 16-1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </p>

      <div className="relative mx-auto mt-5 w-fit max-w-full sm:mt-6">
        {/* Sticky note + panah: absolute terhadap kotak nama, hanya di layar lebar */}
        {hero.notes.map((note) => (
          <div key={note.text} className={cn("absolute hidden lg:block", slotPosition[note.slot])}>
            <Note note={note} />
          </div>
        ))}
        <Arrow direction="up-right" className="absolute right-full top-full hidden h-7 w-9 lg:block" />
        <Arrow direction="up-left" className="absolute left-full top-full hidden h-7 w-9 lg:block" />

        <SelectionBox color="red" className="max-w-full">
          <PixelHeading
            as="h1"
            size="display"
            className="lg:whitespace-nowrap"
          >
            {site.name}
          </PixelHeading>
        </SelectionBox>
      </div>

      {/* Sticky note versi mobile/tablet: baris yang membungkus di bawah nama (tanpa panah) */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-7 sm:gap-3.5 lg:hidden">
        {hero.notes.map((note) => (
          <Note key={note.text} note={note} />
        ))}
      </div>

      <p className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-[clamp(11px,1.2vw,14px)] uppercase tracking-wider sm:mt-10 lg:mt-14">
        <Icon name="dot" size={10} className="shrink-0 text-pink" />
        <span>{site.status}</span>
      </p>

      {/* Headline 2 baris; ikon inline di ujung tiap baris (nbsp menjaga ikon tetap menempel ke kata terakhir) */}
      <p className="mx-auto mt-8 max-w-3xl font-sans text-[clamp(24px,3.5vw,42px)] font-semibold leading-[1.2] tracking-tight sm:mt-10 md:mt-12">
        {hero.tagline.map((line, i) => (
          <span key={i} className="block">
            {line.text}
            {" "}
            <Icon name={line.icon} className="inline-block h-[0.65em] w-[0.65em] align-middle" />
          </span>
        ))}
      </p>

      <Link
        href={hero.cta.href}
        className={buttonClass("solid", "mt-9 min-h-[48px] px-[28px] py-[14px] text-[15px] sm:mt-12")}
      >
        <span aria-hidden="true" className="size-3 bg-blue" />
        {hero.cta.label}
      </Link>
    </section>
  );
}
