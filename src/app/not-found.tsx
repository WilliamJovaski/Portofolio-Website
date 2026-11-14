import Link from "next/link";
import PixelHeading from "@/components/ui/PixelHeading";
import StickyNote from "@/components/ui/StickyNote";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-top mx-auto flex max-w-xl flex-col items-center px-4 text-center">
      <PixelHeading as="h1" size="xl">
        404
      </PixelHeading>
      <div className="mt-6">
        <StickyNote color="pink" rotate={-3} className="font-hand text-lg">
          halaman ini hilang di tumpukan kertas…
        </StickyNote>
      </div>
      <Link
        href="/"
        className={buttonClass("solid", "mt-10")}
      >
        Back home
      </Link>
    </div>
  );
}
