# Orasis Frontend

Template React + Vite + Tailwind CSS

## Teknologi yang Digunakan

- **React** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool yang cepat dan modern
- **Tailwind CSS** - Utility-first CSS framework

## Instalasi

Dependencies sudah terinstall. Jika perlu install ulang:

```bash
npm install
```

## Menjalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

**Catatan:** Script npm sudah dikonfigurasi untuk menjalankan Vite dengan Node.js secara langsung untuk menghindari masalah PATH di Windows.

## Build untuk Production

```bash
npm run build
```

Hasil build akan ada di folder `dist/`

## Preview Build Production

```bash
npm run preview
```

## Struktur Folder

```
orasis-frontend/
├── public/           # File static
├── src/
│   ├── assets/      # Gambar, font, dll
│   ├── App.jsx      # Komponen utama
│   ├── main.jsx     # Entry point
│   └── index.css    # Global CSS dengan Tailwind
├── index.html       # Template HTML
├── package.json     # Dependencies
├── vite.config.js   # Konfigurasi Vite
├── tailwind.config.js # Konfigurasi Tailwind
└── postcss.config.js  # Konfigurasi PostCSS
```

## Tailwind CSS

Tailwind sudah dikonfigurasi dan siap digunakan. Gunakan utility classes untuk styling:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello Tailwind!
</div>
```

## Hot Module Replacement (HMR)

Vite menyediakan HMR yang sangat cepat. Setiap perubahan akan langsung terlihat tanpa refresh halaman.
