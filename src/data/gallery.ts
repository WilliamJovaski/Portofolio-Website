// Data gallery di /playground (di "balik halaman" kolase).
// Foto asli: taruh di public/images/gallery/<kategori>/<nama-file>.jpg lalu jalankan `npm run sync:gallery`.
// Script menulis gallery.generated.json; selama file itu kosong, gallery memakai placeholder di bawah.
import type { Tone } from "@/components/ui/ImageSlot";
import synced from "./gallery.generated.json";

export interface GalleryPhoto {
  id: string;
  /** Path di /public. Kosong = placeholder gradient (`tone`). */
  src?: string;
  alt: string;
  caption?: string;
  /** Nama folder kategori, mis. "travel". */
  category: string;
  width: number;
  height: number;
  tone?: Tone;
}

export const galleryText = {
  heading: "Gallery",
  note: "click a photo",
  back: "Playground",
  all: "All",
  loadMore: "Load more",
  /** Label tombol lipatan kertas di pojok kolase. */
  curl: "Gallery",
  /** Catatan kecil di kolase yang menunjuk ke lipatan kertas. */
  curlNote: "more photos here",
  /** Jumlah foto awal & tambahan per klik "Load more". */
  pageSize: 12,
  step: 8,
};

/** Label tampilan per kategori (nama folder). Kategori yang tidak ada di sini memakai nama foldernya. */
export const categoryLabels: Record<string, string> = {
  daily: "Daily",
  travel: "Travel",
  food: "Food",
  things: "Things",
};

/**
 * Teks opsional per foto hasil sync, kunci = id (lihat gallery.generated.json),
 * mis. { "travel-senja-di-pantai": { caption: "sore di pantai", alt: "Senja di pantai" } }.
 */
export const photoOverrides: Record<string, { alt?: string; caption?: string }> = {
  // Daily (9)
  "daily-balcony-ultrawide-selfie": {
    alt: "High-angle 0.5x group selfie with seven friends on a balcony overlooking green fields",
    caption: "0.5x chaos w/ the gang ✌️",
  },
  "daily-birthday-cake-surprise": {
    alt: "Birthday surprise photo outdoors holding a chocolate cake with frosting smeared on the face",
    caption: "birthday cake ambush 🎂",
  },
  "daily-cfd-phinla-campaign": {
    alt: "Group photo holding environmental waste-sorting campaign signs at Jakarta Car Free Day",
    caption: "cfd waste-sorting campaign 🌱",
  },
  "daily-childhood-throwback": {
    alt: "Nostalgic childhood throwback photo with grandma holding two babies",
    caption: "day one throwback 👶",
  },
  "daily-cultural-day-campus": {
    alt: "Group of students wearing traditional Indonesian batik and golden cultural headpieces outdoors",
    caption: "cultural day on campus ✨",
  },
  "daily-fyp-cinema-break": {
    alt: "Five friends in matching BINUS First Year Program shirts posing in a cinema hallway",
    caption: "movie break w/ fyp squad 🎬",
  },
  "daily-home-sweet-home": {
    alt: "Posing with family and friends with peace signs and finger hearts in front of the house gate",
    caption: "home sweet home 🏠",
  },
  "daily-honest-exam-squad": {
    alt: "Students in batik posing with folded hands beneath a BINUS Academic Integrity exam banner",
    caption: "honest exam squad 🙏",
  },
  "daily-pizza-donuts-hangout": {
    alt: "Selfie with friends enjoying pizza slices and glazed donuts at a cozy vintage cafe",
    caption: "pizza & donuts catch-up 🍕",
  },

  // Food (4)
  "food-burger-and-fries": {
    alt: "Classic burger on a wooden platter alongside a wire basket of crispy french fries",
    caption: "late night burger & fries 🍔",
  },
  "food-chocolate-croissant-cafe": {
    alt: "Warm vintage-toned portrait in a brick cafe holding a chocolate-filled croissant dusted with sugar",
    caption: "croissant o'clock 🥐",
  },
  "food-christmas-eve-pasta": {
    alt: "Overhead table spread of creamy penne, spaghetti bolognese, matcha burnt cheesecake, and drinks",
    caption: "christmas eve dinner 🍝",
  },
  "food-hotplate-tongseng": {
    alt: "Two sizzling hotplates of beef tongseng served with steamed white rice and iced orange drink",
    caption: "hotplate tongseng comfort 🍲",
  },

  // Things (4)
  "things-arjuno-summit-monument": {
    alt: "Black marble summit plaque of Mount Arjuno at 3,339 MDPL overlooking a sea of clouds",
    caption: "above the clouds at 3,339 mdpl ☁️",
  },
  "things-hiradraw-live-demo": {
    alt: "Team showcasing the HiraDraw web application on a laptop with their lecturer in the lab",
    caption: "hiradraw live demo ✍️",
  },
  "things-holybin-prototype-demo": {
    alt: "Team and lecturer posing with the Holy-Bin IoT smart trash bin prototype in the classroom",
    caption: "holy-bin prototype demo day 📦",
  },
  "things-maybank-marathon-gate": {
    alt: "Yellow Maybank Marathon 15th edition entrance gate under a clear blue sky",
    caption: "maybank marathon race village 🏃",
  },

  // Travel (6)
  "travel-basecamp-ready-ascend": {
    alt: "Four hikers in full carrier backpacks and trekking poles ready at the mountain basecamp",
    caption: "basecamp ready to ascend 🎒",
  },
  "travel-dufan-day-out": {
    alt: "Six friends sitting on a yellow vintage car prop at Dunia Fantasi theme park",
    caption: "dufan day out 🎢",
  },
  "travel-forest-trail-checkpoint": {
    alt: "Five hikers with trekking poles pointing at the camera on a shaded forest mountain trail",
    caption: "trail checkpoint w/ the boys 🥾",
  },
  "travel-misty-mountain-trail": {
    alt: "Misty mountain dirt trail winding through tall casuarina trees and low clouds",
    caption: "misty mountain trail 🌲",
  },
  "travel-river-rafting-crew": {
    alt: "Four people wearing helmets and life jackets standing in a rocky river before white-water rafting",
    caption: "river rafting adventure 🚣",
  },
  "travel-sunrise-mountain-ridge": {
    alt: "Six hikers posing at golden hour on a ridge with misty mountain peaks in the background",
    caption: "golden hour on the ridge ⛰️",
  },
};

interface SyncedPhoto {
  id: string;
  src: string;
  category: string;
  alt: string;
  width: number;
  height: number;
}

// Placeholder deterministik (tanpa Math.random): kategori, tone & rasio bergiliran
const tones: Tone[] = ["sunset", "ocean", "lemon", "rose", "forest", "night", "mono", "red"];
const ratios: [number, number][] = [
  [4, 5],
  [4, 3],
  [1, 1],
  [3, 4],
  [16, 10],
  [2, 3],
  [5, 4],
];
const placeholderCategories = ["daily", "travel", "food", "things"];
const placeholderCaptions = ["sunday walk", "window seat", "coffee no. 3", "tiny things", "golden hour", "late nights"];

const placeholders: GalleryPhoto[] = Array.from({ length: 30 }, (_, i) => {
  const [w, h] = ratios[i % ratios.length];
  const category = placeholderCategories[(i * 3 + Math.floor(i / 4)) % placeholderCategories.length];
  return {
    id: `placeholder-${i + 1}`,
    alt: `Foto placeholder ${i + 1} (${category})`,
    caption: i % 3 === 0 ? placeholderCaptions[(i / 3) % placeholderCaptions.length] : undefined,
    category,
    width: w * 300,
    height: h * 300,
    tone: tones[(i * 5) % tones.length],
  };
});

const syncedPhotos: GalleryPhoto[] = (synced as SyncedPhoto[]).map((p, i) => ({
  ...p,
  ...photoOverrides[p.id],
  // Gradient tetap tampil di belakang foto selama dimuat
  tone: tones[i % tones.length],
}));

export const galleryPhotos: GalleryPhoto[] = syncedPhotos.length > 0 ? syncedPhotos : placeholders;

/** Kategori yang benar-benar punya foto, urut seperti di data. */
export const galleryCategories: string[] = [...new Set(galleryPhotos.map((p) => p.category))];

export const categoryLabel = (c: string) => categoryLabels[c] ?? c.replace(/[-_]+/g, " ");
