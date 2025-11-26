# Orasis - Design Inspiration Platform

Repository ini untuk tugas kelompok project membuat website full implementasi Front-End, Back-End dan Database dari mata kuliah Perancangan dan Pemrograman Website.

## 📋 Deskripsi Project

**Orasis** adalah platform showcase design yang memungkinkan pengguna untuk:
- Melihat dan mencari design inspiration
- Upload design showcase mereka sendiri
- Membuat koleksi design favorit
- Admin dapat mengelola user, showcase, dan analytics

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios

### Backend
- Laravel 10
- Laravel Sanctum (Authentication)
- PostgreSQL
- PHP 8.2+

## 📦 Prerequisites

Pastikan sudah terinstall:
- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x
- **NPM** atau **Yarn**
- **PostgreSQL** >= 14.x (via Laragon atau standalone)
- **Git**

---

## 🚀 Setup Development Environment

### Option 1: PHP Artisan Serve (Recommended untuk konsistensi tim)

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Nand-o/Orasis.git
cd Orasis
```

#### 2️⃣ Backend Setup

```bash
# Masuk ke folder backend
cd orasis-backend

# Install dependencies PHP
composer install

# Copy .env file
copy .env.example .env

# Generate application key
php artisan key:generate
```

**Configure Database di `.env`:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
```

```bash
# Create database (via PostgreSQL)
# Buka pgAdmin atau psql dan buat database bernama 'orasis'

# Run migrations
php artisan migrate

# (Optional) Seed database dengan data dummy
php artisan db:seed

# Start Laravel development server
php artisan serve --port=8000
```

**Backend sekarang berjalan di:** `http://localhost:8000`

#### 3️⃣ Frontend Setup

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd orasis-frontend

# Install dependencies
npm install

# Copy .env file
copy .env.example .env
```

**Pastikan `.env` berisi:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_BASE_URL=http://localhost:8000
```

```bash
# Start Vite development server
npm run dev
```

**Frontend sekarang berjalan di:** `http://localhost:5173`

---

### Option 2: Menggunakan Laragon (Alternative)

#### 1️⃣ Setup Laragon

1. **Install Laragon** (https://laragon.org/)
2. **Start Laragon** (Apache + PostgreSQL)
3. **Clone project** ke folder `C:\laragon\www\`:
   ```bash
   cd C:\laragon\www
   git clone https://github.com/Nand-o/Orasis.git orasis
   ```

#### 2️⃣ Backend Setup (Laragon)

```bash
cd C:\laragon\www\orasis\orasis-backend

# Install dependencies
composer install

# Copy .env
copy .env.example .env

# Generate key
php artisan key:generate
```

**Configure `.env` untuk Laragon:**
```env
APP_URL=http://orasis-backend.test

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=
```

```bash
# Create database via Laragon pgAdmin
# Database name: orasis

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Clear all cache
php artisan optimize:clear
```

#### 3️⃣ Setup Virtual Host (Laragon)

1. **Klik kanan Laragon tray icon** → Apache → Virtual Hosts → Add
2. **Nama host:** `orasis-backend`
3. **Path:** `C:\laragon\www\orasis\orasis-backend\public`
4. **Restart Laragon Apache**

Atau manual edit `C:\laragon\etc\apache2\sites-enabled\auto.orasis-backend.test.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot "C:/laragon/www/orasis/orasis-backend/public"
    ServerName orasis-backend.test
    ServerAlias *.orasis-backend.test
    <Directory "C:/laragon/www/orasis/orasis-backend/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Test:** Buka `http://orasis-backend.test` di browser (harus muncul Laravel welcome page)

#### 4️⃣ Frontend Setup (Laragon)

```bash
cd C:\laragon\www\orasis\orasis-frontend

# Install dependencies
npm install

# Copy .env
copy .env.example .env
```

**Update `.env` untuk Laragon:**
```env
VITE_API_URL=http://orasis-backend.test/api
VITE_BASE_URL=http://orasis-backend.test
```

```bash
# Start Vite dev server
npm run dev
```

**⚠️ Troubleshooting Laragon:**

Jika endpoint `/api/admin/analytics` atau route lain tidak ditemukan (404):
1. Clear Laravel cache:
   ```bash
   php artisan route:clear
   php artisan config:clear
   php artisan cache:clear
   php artisan optimize:clear
   ```
2. Restart Laragon Apache
3. Jika masih error, **fallback ke Option 1** (php artisan serve)

---

## 👤 Default User Accounts

Setelah seeding database, gunakan akun berikut untuk login:

### Admin Account
- **Email:** `admin@orasis.com`
- **Password:** `password`
- **Role:** Admin (full access)

### User Accounts
- **Email:** `faris@orasis.com` | Password: `password`
- **Email:** `ernando@orasis.com` | Password: `password`
- **Email:** `candra@orasis.com` | Password: `password`

---

## 📁 Project Structure

```
Orasis/
├── orasis-backend/          # Laravel Backend API
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Http/Middleware/   # Custom Middleware
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   └── seeders/           # Database Seeders
│   ├── routes/
│   │   └── api.php           # API Routes
│   └── .env                  # Environment Config
│
└── orasis-frontend/         # React Frontend
    ├── src/
    │   ├── components/      # Reusable Components
    │   ├── features/        # Feature-based Modules
    │   ├── services/        # API Services
    │   ├── context/         # React Context
    │   └── App.jsx          # Main App Component
    ├── public/              # Static Assets
    └── .env                 # Environment Config
```

---

## 🔥 Fitur Utama

### Public Features
- ✅ Browse design showcases dengan filtering & search
- ✅ View detail showcase
- ✅ Register & Login
- ✅ Dark mode support

### User Features
- ✅ Upload showcase (dengan approval workflow)
- ✅ Edit & delete showcase milik sendiri
- ✅ Manage collections (bookmark)
- ✅ Profile management
- ✅ Dashboard overview

### Admin Features
- ✅ User management (CRUD)
- ✅ Showcase moderation (approve/reject)
- ✅ Bulk actions (approve/reject multiple)
- ✅ Analytics dashboard
- ✅ View all showcases
- ✅ Responsive admin panel

---

## 🐛 Common Issues & Solutions

### Issue 1: `SQLSTATE[08006] Connection refused`
**Solusi:** PostgreSQL belum berjalan
```bash
# Cek PostgreSQL service
# Windows: Buka Services → PostgreSQL
# Atau start via Laragon
```

### Issue 2: `Class 'XXX' not found`
**Solusi:** Composer dependencies belum terinstall
```bash
cd orasis-backend
composer install
```

### Issue 3: Frontend tidak bisa hit API (CORS error)
**Solusi:** 
1. Pastikan backend sudah running
2. Cek `.env` frontend sudah sesuai dengan backend URL
3. Restart Vite dev server

### Issue 4: Route `/api/admin/analytics` not found (404)
**Solusi:** 
1. Clear Laravel cache: `php artisan optimize:clear`
2. Jika pakai Laragon, restart Apache
3. **Atau gunakan php artisan serve** (lebih reliable)

### Issue 5: `npm run dev` error
**Solusi:** 
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🧪 Testing

```bash
# Backend tests (belum diimplementasikan)
cd orasis-backend
php artisan test

# Frontend tests (belum diimplementasikan)
cd orasis-frontend
npm run test
```

---

## 📝 Development Workflow

1. **Pull latest changes**
   ```bash
   git pull origin feature/axios-integration
   ```

2. **Update dependencies**
   ```bash
   # Backend
   composer install
   php artisan migrate
   
   # Frontend
   npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1: Backend
   php artisan serve --port=8000
   
   # Terminal 2: Frontend
   npm run dev
   ```

4. **Make changes & test**

5. **Commit & push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/axios-integration
   ```

---

## 👥 Team Members

- **Nando** - [@Nand-o](https://github.com/Nand-o)
- *Add team members here*

---

## 📄 License

This project is for educational purposes (Tugas Kuliah PPW).

---

## 📞 Contact & Support

Jika ada masalah atau pertanyaan:
1. Buat issue di GitHub repository
2. Tanya di grup WhatsApp kelompok
3. Contact project maintainer

---

**Happy Coding! 🚀**
