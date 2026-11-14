// Sinkronkan foto gallery: baca public/images/gallery/<kategori>/<file> lalu tulis
// src/data/gallery.generated.json (id, src, kategori, alt, ukuran asli).
// Jalankan: npm run sync:gallery  (ulang setiap kali menambah/menghapus foto)
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDir = path.join(root, "public", "images", "gallery");
const outFile = path.join(root, "src", "data", "gallery.generated.json");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

/** Baca lebar & tinggi dari header file gambar (tanpa dependency). */
function imageSize(buf, ext) {
  if (ext === ".png" && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (ext === ".gif" && buf.toString("ascii", 0, 3) === "GIF") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (ext === ".webp" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0..SOF15 kecuali DHT (C4), JPG (C8), DAC (CC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  if (ext === ".avif") {
    const at = buf.indexOf("ispe");
    if (at > 0) return { width: buf.readUInt32BE(at + 8), height: buf.readUInt32BE(at + 12) };
  }
  return null;
}

/** "senja-di-pantai_02.jpg" -> "senja di pantai 02" */
const toAlt = (file) => path.parse(file).name.replace(/[-_]+/g, " ").trim();
const toId = (category, file) => `${category}-${path.parse(file).name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

async function main() {
  await mkdir(galleryDir, { recursive: true });
  const categories = (await readdir(galleryDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const photos = [];
  for (const category of categories) {
    const files = (await readdir(path.join(galleryDir, category)))
      .filter((f) => exts.has(path.extname(f).toLowerCase()))
      .sort();
    for (const file of files) {
      const full = path.join(galleryDir, category, file);
      const ext = path.extname(file).toLowerCase();
      // Header cukup 256KB pertama (JPEG dengan EXIF besar kadang butuh lebih dari 64KB)
      const buf = (await readFile(full)).subarray(0, 256 * 1024);
      const size = imageSize(buf, ext);
      if (!size) console.warn(`  ! ukuran ${category}/${file} tidak terbaca, pakai 4:3`);
      photos.push({
        id: toId(category, file),
        src: `/images/gallery/${encodeURIComponent(category)}/${encodeURIComponent(file)}`,
        category,
        alt: toAlt(file),
        width: size?.width ?? 1200,
        height: size?.height ?? 900,
        modified: (await stat(full)).mtime.toISOString().slice(0, 10),
      });
    }
  }

  await writeFile(outFile, JSON.stringify(photos, null, 2) + "\n");
  const rel = path.relative(root, outFile);
  if (photos.length === 0) {
    console.log(`Belum ada foto di public/images/gallery/<kategori>/ -> ${rel} kosong (gallery memakai placeholder).`);
  } else {
    console.log(`${photos.length} foto dari ${categories.length} kategori -> ${rel}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
