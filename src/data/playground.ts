// Item kolase di /playground. x & y = posisi awal dalam % dari area kolase, w = lebar (px, desktop).
import type { Accent } from "@/components/ui/colors";
import type { Picture } from "./site";

interface Base {
  id: string;
  x: number;
  y: number;
  w: number;
  rotate: number;
}

export type CollageItem =
  | (Base & { kind: "polaroid"; picture: Picture; caption: string })
  | (Base & { kind: "image"; picture: Picture; aspect: string })
  | (Base & { kind: "note"; text: string; color: Accent })
  | (Base & { kind: "sticker"; shape: "smiley" | "star" | "ring"; color: Accent });

export const collageItems: CollageItem[] = [
  {
    id: "p1",
    kind: "polaroid",
    x: 3,
    y: 4,
    w: 210,
    rotate: -7,
    picture: {
      src: "/images/playground/P1010872.jpeg",
      alt: "Candid late-night digicam flash portrait outdoors",
      objectPosition: "center 35%",
      tone: "night",
    },
    caption: "late night flash ✨",
  },
  {
    id: "i1",
    kind: "image",
    x: 33,
    y: 8,
    w: 260,
    rotate: 2,
    aspect: "aspect-[4/3]",
    picture: {
      src: "/images/playground/rector-cup-volley.jpg",
      alt: "Volleyball teams celebrating with medals and prize boards at the BINUS Rector Cup",
      objectPosition: "center center",
      tone: "mono",
    },
  },
  { id: "n1", kind: "note", x: 30, y: 2, w: 120, rotate: -8, text: "hello world", color: "sky" },
  {
    id: "p2",
    kind: "polaroid",
    x: 72,
    y: 3,
    w: 170,
    rotate: 6,
    picture: {
      src: "/images/playground/puncak-arjuno.jpg",
      alt: "Standing on the rocky peak of Mount Arjuno holding the 3339 MDPL summit sign",
      objectPosition: "center 60%",
      tone: "rose",
    },
    caption: "arjuno 3339 mdpl 🏔️",
  },
  { id: "n2", kind: "note", x: 84, y: 36, w: 120, rotate: 5, text: "what is this", color: "mint" },
  {
    id: "i2",
    kind: "image",
    x: 56,
    y: 44,
    w: 230,
    rotate: -4,
    aspect: "aspect-square",
    picture: {
      src: "/images/playground/blu-ambassador.jpg",
      alt: "Portrait in front of the Welcome to blUnion bluAmbassador Jabodetabek screen",
      objectPosition: "center 25%",
      tone: "rose",
    },
  },
  { id: "s1", kind: "sticker", x: 22, y: 58, w: 96, rotate: -10, shape: "smiley", color: "yellow" },
  {
    id: "i3",
    kind: "image",
    x: 2,
    y: 50,
    w: 230,
    rotate: 3,
    aspect: "aspect-[4/3]",
    picture: {
      src: "/images/playground/study-session-crew.jpg",
      alt: "Group selfie with university friends working on laptops over iced coffee",
      objectPosition: "center center",
      tone: "ocean",
    },
  },
  { id: "n3", kind: "note", x: 44, y: 76, w: 130, rotate: -3, text: "100% for fun", color: "peach" },
  { id: "s2", kind: "sticker", x: 88, y: 70, w: 80, rotate: 12, shape: "star", color: "pink" },
  {
    id: "p3",
    kind: "polaroid",
    x: 34,
    y: 40,
    w: 160,
    rotate: -2,
    picture: {
      src: "/images/playground/maybank-marathon.jpg",
      alt: "Holding finisher medals by the beach after completing the Maybank Marathon",
      objectPosition: "center 35%",
      tone: "night",
    },
    caption: "marathon finisher 🏅",
  },
  { id: "s3", kind: "sticker", x: 74, y: 80, w: 70, rotate: 0, shape: "ring", color: "green" },
  { id: "n4", kind: "note", x: 12, y: 84, w: 120, rotate: 4, text: "drag me!", color: "yellow" },
];
