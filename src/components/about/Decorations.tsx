import type { Decoration } from "@/data/about";
import { cn } from "@/lib/cn";
import { PostcardSticker, StampSticker, StarSticker } from "./Stickers";

const stickers = {
  postcard: PostcardSticker,
  stamp: StampSticker,
  star: StarSticker,
} as const;

/** Render stiker dari data (src/data/about.ts) untuk satu anchor. Parent harus `relative`. */
export default function Decorations({ items, anchor }: { items: Decoration[]; anchor: Decoration["anchor"] }) {
  return (
    <>
      {items
        .filter((d) => d.anchor === anchor)
        .map((d) => {
          const Sticker = stickers[d.kind];
          return (
            <div
              key={d.kind}
              aria-hidden="true"
              className={cn("pointer-events-none absolute z-10", d.hideOnMobile && "hidden md:block")}
              style={{ ...d.position, transform: `rotate(${d.rotate}deg)` }}
            >
              <Sticker />
            </div>
          );
        })}
    </>
  );
}
