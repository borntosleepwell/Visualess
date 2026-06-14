# Visualess

Visualess adalah website AI untuk mengenali gaya visual desain dari gambar referensi, lalu menghasilkan narasi desain, tag style, tag layout, tag warna, tag tipografi, mood, dan keyword pencarian referensi serupa.

Panduan arsitektur, aturan anti-spaghetti, komentar kode, checklist manual, dan rencana belajar ada di [PROJECT_GUIDE.md](./PROJECT_GUIDE.md).

## Stack

```text
Next.js App Router
TypeScript
Tailwind CSS
shadcn/ui with Radix
Nova - Lucide / Geist preset
Motion for React
react-dropzone
zod
```

## Getting Started

Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

Untuk mulai belajar dari project ini, kerjakan bertahap:

1. Buat static UI dengan data dummy.
2. Tambahkan upload dan preview gambar.
3. Buat API route untuk analisis AI.
4. Tambahkan copy keyword dan external search.
5. Hubungkan database untuk history dan detail.

## Development Checks

```bash
npm run lint
```

Mengecek style dan potensi masalah kode.

```bash
npm run build
```

Memastikan project siap dibuild untuk production.

## Core Flow

```text
Upload Image -> AI Analysis -> Design Narrative -> Tags -> Keywords -> External Search -> Save Analysis
```
