"use client";

import { useRef, useState, type RefObject } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Icon, Smiley } from "@/components/ui/Icons";
import ImageSlot from "@/components/ui/ImageSlot";
import Polaroid from "@/components/ui/Polaroid";
import StickyNote from "@/components/ui/StickyNote";
import type { CollageItem } from "@/data/playground";
import { useCollageMemory } from "./CollageMemory";

function ItemContent({ item }: { item: CollageItem }) {
  switch (item.kind) {
    case "polaroid":
      return <Polaroid {...item.picture} caption={item.caption} />;
    case "image":
      return (
        <ImageSlot
          {...item.picture}
          className={`${item.aspect} w-full border-[6px] border-white shadow-paper`}
          sizes="260px"
        />
      );
    case "note":
      return (
        <StickyNote color={item.color} className="font-hand text-lg">
          {item.text}
        </StickyNote>
      );
    case "sticker":
      if (item.shape === "smiley") return <Smiley size={item.w} />;
      if (item.shape === "ring") return <Icon name="ring" size={item.w} />;
      return (
        <svg viewBox="0 0 100 100" width="100%" aria-hidden="true">
          <path
            d="M50 4 61 37h35L68 58l11 34-29-21-29 21 11-34L4 37h35z"
            fill="var(--color-pink)"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

interface CollageItemViewProps {
  item: CollageItem;
  index: number;
  areaRef: RefObject<HTMLDivElement | null>;
  zIndex: number;
  saved?: { x: number; y: number };
  animateIn: boolean;
  onPress: () => void;
  onSave: (x: number, y: number) => void;
}

/** Satu item kolase. Offset drag (x, y) dimulai dari posisi tersimpan supaya tidak reset setelah mount ulang. */
function CollageItemView({ item, index, areaRef, zIndex, saved, animateIn, onPress, onSave }: CollageItemViewProps) {
  const x = useMotionValue(saved?.x ?? 0);
  const y = useMotionValue(saved?.y ?? 0);
  const save = () => onSave(x.get(), y.get());

  return (
    <motion.div
      data-collage-item={item.id}
      drag
      dragConstraints={areaRef}
      dragElastic={0.12}
      dragMomentum={false}
      onPointerDown={onPress}
      onDragEnd={save}
      // Setelah dilepas di luar batas, item memantul kembali -> simpan posisi akhirnya juga
      onDragTransitionEnd={save}
      initial={animateIn ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      whileDrag={{ scale: 1.06 }}
      transition={{ delay: animateIn ? index * 0.04 : 0, type: "spring", stiffness: 260, damping: 20 }}
      className="absolute cursor-grab touch-none active:cursor-grabbing"
      style={{
        x,
        y,
        // Jangan sampai item keluar sisi kanan area di layar sempit
        left: `min(${item.x}%, calc(100% - ${item.w}px * var(--s) - 8px))`,
        top: `${item.y}%`,
        width: `calc(${item.w}px * var(--s))`,
        rotate: item.rotate,
        zIndex,
      }}
    >
      {/* Konten tidak menangkap pointer supaya drag selalu ke wrapper */}
      <div className="pointer-events-none select-none [&>svg]:h-auto [&>svg]:w-full">
        <ItemContent item={item} />
      </div>
    </motion.div>
  );
}

/**
 * Area kolase: setiap item bisa di-drag (Framer Motion) di dalam batas area.
 * Item yang disentuh/di-drag naik ke paling atas lewat urutan z-index.
 * `isolate` membuat z-index item hanya berlaku di dalam area ini (tidak bocor ke lapisan lain).
 */
export default function Collage({ items, label }: { items: CollageItem[]; label: string }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const memory = useCollageMemory();
  // Urutan tumpukan: id terakhir = paling atas. Disimpan di memory kalau ada (bertahan saat unmount).
  const [localOrder, setLocalOrder] = useState(() => items.map((i) => i.id));
  const order = memory?.order ?? localOrder;

  const bringToFront = (id: string) => {
    if (order[order.length - 1] === id) return;
    const next = [...order.filter((x) => x !== id), id];
    if (memory) memory.setOrder(next);
    else setLocalOrder(next);
  };

  return (
    <div
      ref={areaRef}
      role="region"
      aria-label={label}
      // --s = skala ukuran item: lebih kecil di layar sempit
      className="relative isolate z-0 mt-10 h-[600px] w-full overflow-hidden rounded-2xl border border-dashed border-ink/20 [--s:0.55] sm:h-[680px] sm:[--s:0.75] lg:h-[760px] lg:[--s:1]"
    >
      {items.map((item, i) => (
        <CollageItemView
          key={item.id}
          item={item}
          index={i}
          areaRef={areaRef}
          zIndex={order.indexOf(item.id) + 1}
          saved={memory?.offsets[item.id]}
          animateIn={!memory?.returning}
          onPress={() => bringToFront(item.id)}
          onSave={(x, y) => memory?.save(item.id, x, y)}
        />
      ))}
    </div>
  );
}
