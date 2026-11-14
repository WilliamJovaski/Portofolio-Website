import type { Metadata } from "next";
import Collage from "@/components/playground/Collage";
import PlaygroundBook from "@/components/playground/PlaygroundBook";
import PixelHeading from "@/components/ui/PixelHeading";
import { collageItems } from "@/data/playground";
import { playground } from "@/data/site";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Eksplorasi eksperimental, ide visual, prototipe interaktif, dan karya kreatif William Jovaski di luar proyek formal.",
  alternates: {
    canonical: "https://williamjovaski.com/playground",
  },
  openGraph: {
    title: "Playground · William Jovaski",
    description:
      "Eksplorasi eksperimental, ide visual, prototipe interaktif, dan karya kreatif William Jovaski di luar proyek formal.",
    url: "https://williamjovaski.com/playground",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground · William Jovaski",
    description:
      "Eksplorasi eksperimental, ide visual, prototipe interaktif, dan karya kreatif William Jovaski di luar proyek formal.",
    images: ["/og-image.png"],
  },
};

/** Kolase yang bisa di-drag di depan; gallery foto di "balik halaman" (?view=gallery). */
export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 pt-6 pb-4 sm:px-4 md:pt-10">
      <PlaygroundBook>
        <div className="text-center">
          <p className="font-hand text-lg text-ink/80">{playground.label}</p>
          <PixelHeading as="h1" size="lg" className="mt-1">
            {playground.heading}
          </PixelHeading>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink/80">{playground.hint}</p>
          <Collage items={collageItems} label={playground.hint} />
        </div>
      </PlaygroundBook>
    </div>
  );
}
