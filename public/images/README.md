# Foto untuk website

Taruh foto-fotomu di folder ini (`public/images/`).

## Foto profil (polaroid di About, Home "what's up", dan Contact)

1. Simpan foto di sini, misalnya `public/images/me.jpg`.
2. Buka `src/data/about.ts` dan atur `profilePhoto`:

   ```ts
   export const profilePhoto: Picture = {
     src: "/images/me.jpg",          // nama file kamu (tanpa "public")
     alt: "Foto William Jovaski",    // deskripsi singkat foto
     objectPosition: "center 20%",   // geser fokus foto, mis. "center top" atau "50% 30%"
     tone: "ocean",                  // warna placeholder kalau foto belum ada
   };
   ```

3. Selesai. Foto otomatis muncul di ketiga halaman.

## Ukuran ideal

- Rasio potret **4:5**, minimal **800 × 1000 px**.
- Format **JPG** atau **WebP**, ukuran file **di bawah 500 KB**.
- next/image akan mengecilkan & mengoptimasi foto secara otomatis.

## Kalau foto belum ada

Kalau file tidak ditemukan atau `src` dikosongkan (`""`), website menampilkan placeholder gradient (tidak error).

Catatan: semua file di folder `public/` bisa diakses publik lewat URL, termasuk README ini.

## Foto gallery (/playground)

1. Taruh foto di `public/images/gallery/<kategori>/`, mis. `public/images/gallery/travel/senja-di-pantai.jpg`.
   Nama folder = kategori filter, nama file = teks alt (tanda `-`/`_` jadi spasi).
2. Jalankan `npm run sync:gallery` -> menulis `src/data/gallery.generated.json` (ukuran foto dibaca otomatis).
3. Caption / alt / label kategori bisa diubah di `src/data/gallery.ts` (`photoOverrides`, `categoryLabels`).

Selama belum ada foto, gallery memakai placeholder gradient.
