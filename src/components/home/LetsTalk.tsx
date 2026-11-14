import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Icon, Smiley } from "@/components/ui/Icons";
import PixelHeading from "@/components/ui/PixelHeading";
import { letsTalk } from "@/data/site";

/** Penutup Home: smiley besar, LET'S TALK, ajakan menghubungi. */
export default function LetsTalk() {
  return (
    <section aria-labelledby="lets-talk" className="section-y mx-auto flex max-w-4xl flex-col items-center px-4 text-center">
      <Smiley size={120} />
      <PixelHeading className="mt-6" size="lg">
        <span id="lets-talk">{letsTalk.heading}</span>
      </PixelHeading>
      <p className="mt-4 max-w-md font-hand text-lg text-ink/80">{letsTalk.text}</p>
      <Link href={letsTalk.cta.href} className={buttonClass("outline", "mt-6")}>
        {letsTalk.cta.label}
        <Icon name="arrow-up-right" size={12} />
      </Link>
    </section>
  );
}
