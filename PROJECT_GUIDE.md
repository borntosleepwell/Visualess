# Visualess Project Guide

Panduan ini dipakai sebagai aturan kerja saat mengembangkan Visualess. Tujuannya sederhana: kode mudah dibaca, mudah diuji, mudah dikembangkan, dan tidak terasa seperti hasil generate AI yang asal jadi.

## Prinsip Utama

1. Setiap file punya satu tanggung jawab utama.
2. Logic bisnis tidak ditumpuk di komponen UI.
3. API key dan request AI selalu berjalan di backend, bukan frontend.
4. Data yang masuk dan keluar API harus divalidasi.
5. Komentar hanya ditulis untuk scope penting yang menjelaskan alasan atau batas tanggung jawab kode.
6. Komponen kecil lebih baik daripada satu file besar yang mengurus semua hal.
7. Nama file, function, dan variable harus menjelaskan maksudnya.
8. Error, loading, empty state, dan success state harus dirancang sejak awal.

## Stack Rules

Stack Visualess saat ini:

```text
Framework: Next.js App Router
Language: TypeScript
Styling: Tailwind CSS
Component system: shadcn/ui
Component library: Radix
shadcn preset: Nova - Lucide / Geist
Animation: Motion for React
Upload helper: react-dropzone
Validation: zod
```

Aturan pemakaian stack:

1. Gunakan Server Component sebagai default di `app/`.
2. Gunakan `"use client"` hanya untuk komponen yang butuh state, event handler, browser API, upload, clipboard, atau animasi.
3. Import animasi dari `motion/react`, bukan dari package lain.
4. Gunakan komponen shadcn/ui untuk tombol, dialog, input, badge, dan elemen form jika tersedia.
5. Gunakan icon dari `lucide-react` untuk action seperti copy, search, upload, delete, save, dan external link.
6. Gunakan `react-dropzone` hanya di komponen upload client-side.
7. Gunakan `zod` untuk validasi request API, output AI, dan data form penting.
8. Gunakan Tailwind untuk styling lokal, tetapi simpan pola visual berulang sebagai komponen.
9. Jangan membuat wrapper terlalu abstrak sebelum ada kebutuhan nyata.

Contoh batas client component:

```tsx
"use client";

// This component owns browser-only upload state through react-dropzone.
export function UploadDropzone() {
  return null;
}
```

Contoh import Motion yang benar:

```tsx
import { motion } from "motion/react";
```

Contoh validasi Zod:

```ts
import { z } from "zod";

// This schema protects the UI from malformed AI responses.
export const analysisSchema = z.object({
  title: z.string().min(1),
  designNarrative: z.string().min(1),
  styleTags: z.array(z.string()).min(2).max(8),
  layoutTags: z.array(z.string()).min(2).max(8),
  colorTags: z.array(z.string()).min(2).max(8),
  typographyTags: z.array(z.string()).min(2).max(8),
  moodTags: z.array(z.string()).min(2).max(8),
  searchKeywords: z.array(z.string()).min(5).max(8),
});
```

## Struktur Folder Rekomendasi

```text
app/
  page.tsx
  analyze/
    page.tsx
  history/
    page.tsx
  analysis/
    [id]/
      page.tsx
  api/
    analyze-design/
      route.ts
    analyses/
      route.ts
      [id]/
        route.ts

components/
  analysis/
    upload-dropzone.tsx
    image-preview.tsx
    analysis-result.tsx
    keyword-list.tsx
    external-search-buttons.tsx
  history/
    history-card.tsx
  layout/
    app-header.tsx
  ui/
    button.tsx

lib/
  ai/
    analyze-design.ts
    prompt.ts
  database/
    analyses.ts
    supabase.ts
  validation/
    analysis-schema.ts
    upload-schema.ts
  formatters.ts
  search-urls.ts
  utils.ts

types/
  analysis.ts
```

## Batas Tanggung Jawab

### `app/`

Dipakai untuk routing, layout halaman, dan menyusun komponen. Jangan menaruh logic validasi file, logic AI, atau query database panjang langsung di file page.

Komentar yang boleh:

```ts
// Page-level composition only: data fetching and UI sections are delegated to smaller modules.
```

### `components/`

Dipakai untuk tampilan dan interaksi pengguna. Komponen boleh punya state UI lokal seperti selected file, copied keyword, atau open dialog. Komponen tidak boleh menyimpan API key, query database langsung, atau prompt AI panjang.

Komentar yang boleh:

```ts
// Keeps upload feedback close to the dropzone because the state only affects this interaction.
```

### `lib/ai/`

Dipakai untuk prompt, request ke model AI, parsing response, dan normalisasi output AI. Semua response AI harus dianggap belum aman sampai divalidasi.

Komentar yang boleh:

```ts
// AI output is treated as untrusted input, so it must pass the schema before reaching the UI.
```

### `lib/database/`

Dipakai untuk operasi database seperti create, read, dan delete analysis. UI tidak perlu tahu detail table Supabase.

Komentar yang boleh:

```ts
// Database access is centralized here so pages and API routes share the same contract.
```

### `lib/validation/`

Dipakai untuk schema Zod, validasi upload, dan validasi response API. Ini mencegah data acak menyebar ke seluruh aplikasi.

Komentar yang boleh:

```ts
// This schema is the single source of truth for analysis data used by API and UI.
```

### `types/`

Dipakai untuk type yang dipakai lintas module. Jangan masukkan logic di folder ini.

Komentar biasanya tidak perlu karena type harus cukup jelas dari namanya.

## Aturan Komentar

Komentar ditulis jika:

1. Menjelaskan alasan arsitektur.
2. Menjelaskan batas tanggung jawab module.
3. Menjelaskan logic yang rawan salah.
4. Menjelaskan integrasi eksternal seperti AI, storage, atau database.

Komentar tidak perlu jika hanya mengulang kode:

```ts
// Bad: set loading to true
setIsLoading(true);
```

Komentar yang lebih berguna:

```ts
// Prevent duplicate analysis requests while the current image is still being processed.
setIsLoading(true);
```

## Pola Data Analysis

Gunakan satu bentuk data utama agar UI, API, dan database tidak saling berbeda.

```ts
export type DesignAnalysis = {
  id?: string;
  title: string;
  imageUrl?: string;
  designNarrative: string;
  styleTags: string[];
  layoutTags: string[];
  colorTags: string[];
  typographyTags: string[];
  moodTags: string[];
  searchKeywords: string[];
  createdAt?: string;
};
```

Catatan penting: database boleh memakai `snake_case`, tetapi aplikasi React sebaiknya memakai `camelCase`. Buat mapper khusus agar perubahan format tidak menyebar.

## Alur Fitur Utama

```text
Upload image
  -> validate file
  -> preview image
  -> send to /api/analyze-design
  -> validate AI JSON
  -> render result
  -> copy/search/save action
  -> store in database
  -> show in history/detail
```

## Checklist Sebelum Menulis Fitur

1. Apa tujuan fitur ini?
2. Data apa yang masuk?
3. Data apa yang keluar?
4. State apa saja yang mungkin terjadi?
5. Error apa saja yang mungkin muncul?
6. Apakah logic ini milik UI, API, AI, database, atau validation?
7. Apakah perlu test manual?

## Checklist Manual UI/UX

Saat membuat halaman, cek ini secara manual:

1. Apakah user langsung tahu aksi utama yang harus dilakukan?
2. Apakah tombol penting terlihat jelas?
3. Apakah loading state terasa informatif?
4. Apakah error message menjelaskan masalah dan langkah berikutnya?
5. Apakah tampilan mobile tetap rapi?
6. Apakah teks mudah dibaca dan tidak terlalu panjang?
7. Apakah pengguna bisa memakai keyboard untuk tombol dan form?

## Checklist Manual Coding

Saat selesai membuat kode, cek ini:

1. File tidak terlalu besar.
2. Function tidak melakukan terlalu banyak hal.
3. Nama function menjawab apa yang dilakukan.
4. Tidak ada API key di client component.
5. Tidak ada data dummy tertinggal di production flow.
6. Semua branch error memberi feedback.
7. TypeScript tidak memakai `any` tanpa alasan kuat.

## Checklist Manual Backend

Saat membuat endpoint API, cek ini:

1. Method HTTP sesuai kebutuhan.
2. Request body divalidasi.
3. Response sukses dan gagal konsisten.
4. Error detail internal tidak dibocorkan ke user.
5. API key hanya di environment variable.
6. Payload gambar dibatasi ukurannya.
7. Output AI divalidasi sebelum dikirim ke frontend.

## Command Harian

```bash
npm run dev
```

Menjalankan development server.

```bash
npm run lint
```

Mengecek masalah style dan potensi bug.

```bash
npm run build
```

Memastikan project bisa dibuild untuk production.

## Rencana Belajar Bertahap

### Minggu 1: UI/UX dan Komponen

Buat halaman static dengan data dummy. Fokus pada layout, spacing, state kosong, state loading, dan state error. Jangan hubungkan AI dulu.

Latihan manual:

1. Gambar wireframe Analyze Page di kertas.
2. Tandai bagian upload, preview, result, keyword, dan action.
3. Ubah wireframe menjadi komponen React kecil.

### Minggu 2: Upload dan State

Buat upload gambar, validasi format, validasi ukuran, preview, dan remove image.

Latihan manual:

1. Upload file benar.
2. Upload file salah.
3. Upload file terlalu besar.
4. Ganti gambar.
5. Hapus gambar.

### Minggu 3: API dan AI

Buat endpoint `/api/analyze-design`, prompt AI, validasi JSON, dan tampilan hasil.

Latihan manual:

1. Test response AI valid.
2. Simulasikan response AI rusak.
3. Simulasikan jaringan gagal.

### Minggu 4: Database dan History

Hubungkan Supabase, simpan analysis, tampilkan history, detail, dan delete.

Latihan manual:

1. Simpan hasil.
2. Refresh browser.
3. Buka history.
4. Buka detail.
5. Hapus data.

## Definisi Selesai

Satu fitur dianggap selesai jika:

1. UI selesai untuk success, loading, error, dan empty state.
2. Data divalidasi.
3. Kode berada di folder yang tepat.
4. Tidak ada secret di frontend.
5. `npm run lint` lolos.
6. `npm run build` lolos.
7. Alur manual sudah dicoba.
