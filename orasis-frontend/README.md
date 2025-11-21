# 🎨 Orasis Frontend

> Platform showcase desain web dan mobile yang modern dan responsif

Orasis adalah aplikasi showcase desain yang dibangun dengan React dan Tailwind CSS, menyediakan galeri inspirasi desain web dan mobile yang dikurasi dengan baik, mirip dengan platform seperti Mobbin atau Siteinspire.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8.svg)

---

## ✨ Fitur Utama

### 🖼️ Showcase Desain
- **Grid Responsif**: Layout yang menyesuaikan dari mobile hingga desktop (hingga 4 kolom)
- **Filter Kategori**: Filter desain berdasarkan kategori (SaaS, Mobile, Landing Page, dll.)
- **Pencarian Real-time**: Cari desain berdasarkan judul dan tag
- **Detail View**: Modal interaktif untuk melihat detail desain beresolusi tinggi

### 🎯 Fitur Koleksi
- **Koleksi Personal**: Buat dan kelola koleksi desain favorit
- **Bookmark**: Simpan desain ke koleksi dengan mudah
- **Organize**: Atur desain dalam berbagai koleksi

### 👤 Fitur Pengguna
- **Autentikasi**: Login dan registrasi pengguna
- **Profil**: Kelola profil dan preferensi pengguna
- **Dashboard**: Panel kontrol untuk mengelola konten

### 🎨 UI/UX Modern
- **Dark/Light Mode**: Tema yang dapat disesuaikan
- **Animasi Smooth**: Transisi dan animasi menggunakan Framer Motion
- **Responsive Design**: Optimal di semua ukuran layar
- **Hover Effects**: Interaksi micro-animation yang halus

---

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|---------|
| **React** | 19.2.0 | Library UI untuk membangun antarmuka |
| **Vite** | 7.2.2 | Build tool yang cepat dan modern |
| **Tailwind CSS** | 4.1.17 | Framework CSS utility-first |
| **React Router** | 7.9.6 | Routing dan navigasi |
| **Framer Motion** | 12.23.24 | Library animasi React |
| **Lucide React** | 0.554.0 | Icon library modern |

---

## 🚀 Quick Start

### Prerequisites

Pastikan Anda telah menginstal:
- **Node.js** (v18 atau lebih tinggi)
- **npm** atau **yarn**

### Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd orasis-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env` di root folder:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build hasil
npm run preview
```

---

## 📁 Struktur Proyek

```
orasis-frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, dll
│   ├── components/           # Reusable components
│   │   ├── layout/          # Layout components (Header, Footer, dll)
│   │   └── ui/              # UI components (Button, Card, dll)
│   ├── context/             # React Context (ThemeContext, dll)
│   ├── data/                # Mock data dan constants
│   ├── features/            # Feature-based modules
│   │   ├── about/          # Halaman About
│   │   ├── collections/    # Fitur Collections
│   │   ├── design/         # Showcase designs
│   │   └── home/           # Homepage
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                      # Environment variables
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies dan scripts
```

### Penjelasan Struktur

- **`components/`**: Komponen UI yang dapat digunakan kembali
  - `layout/`: Komponen struktur halaman (Navbar, Sidebar, Footer)
  - `ui/`: Komponen UI dasar (Button, Input, Modal, Card)

- **`features/`**: Modul berdasarkan fitur aplikasi
  - Setiap folder berisi komponen, hooks, dan logic spesifik fitur

- **`context/`**: React Context untuk state management global
  - `ThemeContext`: Manajemen dark/light mode

- **`data/`**: Data statis dan mock data untuk development

---

## 🎯 Scripts yang Tersedia

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build aplikasi untuk production |
| `npm run preview` | Preview hasil build production |
| `npm run lint` | Jalankan ESLint untuk check kode |

---

## 🌐 API Integration

Frontend ini berkomunikasi dengan backend Laravel melalui RESTful API.

### Base URL
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Endpoint Utama

- **Auth**
  - `POST /login` - User login
  - `POST /register` - User registration
  - `POST /logout` - User logout

- **Showcases**
  - `GET /showcases` - Get all showcases
  - `GET /showcases/{id}` - Get showcase detail
  - `POST /showcases` - Create showcase (auth required)

- **Collections**
  - `GET /collections` - Get user collections
  - `POST /collections` - Create collection
  - `POST /collections/{id}/add-showcase` - Add showcase to collection

---

## 🎨 Customization

### Tailwind CSS

Konfigurasi Tailwind dapat dimodifikasi sesuai kebutuhan. Tailwind v4 menggunakan konfigurasi berbasis CSS:

```css
/* src/index.css */
@theme {
  /* Custom colors */
  --color-primary: #your-color;
  
  /* Custom breakpoints */
  --breakpoint-3xl: 1920px;
}
```

### Dark Mode

Dark mode dikelola melalui `ThemeContext`:

```jsx
import { useTheme } from './context/ThemeContext'

function Component() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
```

---

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
# Ubah port di vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Dependencies error
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Build error
```bash
# Clear cache dan rebuild
npm run build -- --force
```

---

## 📝 Development Guidelines

### Code Style
- Gunakan ESLint configuration yang sudah disediakan
- Follow React best practices
- Gunakan functional components dan hooks
- Pastikan responsive di semua breakpoint

### Component Guidelines
- Satu komponen per file
- Gunakan PropTypes atau TypeScript untuk type checking
- Extract logic ke custom hooks jika kompleks
- Keep components small dan focused

### Naming Conventions
- **Components**: PascalCase (`ShowcaseCard.jsx`)
- **Hooks**: camelCase dengan prefix 'use' (`useAuth.js`)
- **Utilities**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Proyek ini dibuat untuk keperluan pembelajaran dan pengembangan portfolio.

---

## 👥 Team

Dikembangkan sebagai bagian dari proyek Perancangan dan Pemrograman Website.

---

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi tim development.

---

**Happy Coding! 🚀**
