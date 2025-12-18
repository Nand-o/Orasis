# 🎨 Orasis Backend - API Documentation

Backend API untuk platform Orasis - Platform showcase dan discovery untuk karya desain website & mobile.

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder](#struktur-folder)
- [Instalasi & Setup](#instalasi--setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Autentikasi](#autentikasi)
- [Fitur Utama](#fitur-utama)
- [Penjelasan File Penting](#penjelasan-file-penting)

---

## 🎯 Tentang Proyek

Orasis Backend adalah REST API yang dibangun dengan Laravel 11 untuk mendukung platform showcase desain. API ini menyediakan:

- **Autentikasi berbasis token** menggunakan Laravel Sanctum
- **Manajemen Showcase** dengan sistem moderasi (pending/approved/rejected)
- **Sistem Kategori & Tags** untuk filtering dan discovery
- **Collection System** untuk menyimpan showcase favorit
- **View Tracking** untuk analytics
- **Role-based Access Control** (Admin & User)
- **File Upload** untuk gambar showcase dan logo

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Fungsi |
|-----------|-------|---------|
| **Laravel** | 11.x | Framework PHP utama |
| **PHP** | 8.2+ | Backend language |
| **MySQL** | 8.0+ | Database relasional |
| **Laravel Sanctum** | - | Token-based authentication |
| **Laravel Storage** | - | File upload management |
| **Composer** | 2.x | Dependency manager |

---

## 📁 Struktur Folder

```
orasis-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Logic bisnis aplikasi
│   │   │   ├── AdminShowcaseController.php  # Moderasi showcase
│   │   │   ├── AuthController.php           # Login/Register/Logout
│   │   │   ├── CategoryController.php       # CRUD kategori
│   │   │   ├── CollectionController.php     # Manajemen koleksi user
│   │   │   ├── DashboardController.php      # Dashboard user/admin
│   │   │   ├── ProfileController.php        # Update profil & password
│   │   │   ├── ShowcaseController.php       # CRUD showcase utama
│   │   │   ├── TagController.php            # CRUD tags
│   │   │   └── UserController.php           # Manajemen user
│   │   └── Middleware/           # Middleware custom
│   │       ├── AdminMiddleware.php          # Proteksi route admin
│   │       └── Authenticate.php             # Sanctum auth
│   └── Models/                   # Eloquent Models
│       ├── Category.php          # Model kategori
│       ├── Collection.php        # Model koleksi user
│       ├── Showcase.php          # Model showcase (utama)
│       ├── Tag.php               # Model tags
│       └── User.php              # Model user
├── bootstrap/
│   └── app.php                   # Bootstrap aplikasi Laravel
├── config/
│   ├── auth.php                  # Konfigurasi autentikasi
│   ├── cors.php                  # CORS settings untuk frontend
│   ├── database.php              # Koneksi database
│   └── sanctum.php               # Sanctum configuration
├── database/
│   ├── migrations/               # Schema database
│   │   ├── xxxx_create_users_table.php
│   │   ├── xxxx_create_showcases_table.php
│   │   ├── xxxx_create_tags_table.php
│   │   ├── xxxx_create_showcase_tag_table.php  # Pivot table
│   │   ├── xxxx_create_collections_table.php
│   │   ├── xxxx_create_collection_showcase_table.php
│   │   ├── xxxx_create_categories_table.php
│   │   └── xxxx_create_personal_access_tokens_table.php
│   └── seeders/                  # Data dummy untuk testing
│       ├── DatabaseSeeder.php    # Master seeder
│       ├── UserSeeder.php        # Seed user (admin & regular)
│       ├── CategorySeeder.php    # Seed kategori
│       ├── TagSeeder.php         # Seed tags
│       ├── ShowcaseSeeder.php    # Seed showcase dari CSV
│       └── CollectionSeeder.php  # Seed koleksi
├── public/
│   └── storage/                  # Symlink untuk uploaded files
│       ├── showcases/            # Folder gambar showcase
│       └── logos/                # Folder logo website
├── routes/
│   ├── api.php                   # Definisi semua API routes
│   └── web.php                   # Routes untuk web (minimal)
├── storage/
│   ├── app/
│   │   └── public/              # File storage (showcase images, logos)
│   └── logs/                    # Log aplikasi
├── .env                         # Environment variables (database, app key, dll)
├── .env.example                 # Template environment
├── composer.json                # PHP dependencies
└── artisan                      # CLI Laravel
```

---

## ⚙️ Instalasi & Setup

### Prasyarat
- PHP >= 8.2
- Composer
- MySQL >= 8.0
- Laravel 11

### Langkah Instalasi

1. **Clone Repository**
```bash
cd orasis-backend
```

2. **Install Dependencies**
```bash
composer install
```

3. **Setup Environment**
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orasis_db
DB_USERNAME=root
DB_PASSWORD=
```

4. **Generate Application Key**
```bash
php artisan key:generate
```

5. **Jalankan Migration & Seeder**
```bash
# Create semua table
php artisan migrate

# Isi data dummy
php artisan db:seed
```

Atau jalankan sekaligus (reset database):
```bash
php artisan migrate:fresh --seed
```

6. **Buat Storage Link**
```bash
php artisan storage:link
```
Ini akan membuat symbolic link dari `storage/app/public` ke `public/storage` agar file upload bisa diakses.

7. **Jalankan Development Server**
```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

8. **Testing API**
Gunakan Postman/Thunder Client untuk testing. Import collection dari dokumentasi API.

---

## 🗄️ Database Schema

### **Tabel: users**
Menyimpan data pengguna (admin & user biasa)

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(255) | Nama lengkap |
| email | VARCHAR(255) | Email (unique) |
| password | VARCHAR(255) | Password (hashed dengan bcrypt) |
| role | ENUM('admin', 'user') | Role pengguna |
| profile_image | TEXT | URL/path foto profil (nullable) |
| created_at | TIMESTAMP | Waktu registrasi |
| updated_at | TIMESTAMP | Waktu update terakhir |

### **Tabel: showcases**
Menyimpan data showcase (karya desain)

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key ke users |
| category_id | BIGINT | Foreign key ke categories |
| title | VARCHAR(255) | Judul showcase |
| description | TEXT | Deskripsi detail |
| url_website | VARCHAR(255) | URL website showcase |
| image_url | TEXT | URL/path gambar showcase |
| logo_url | TEXT | URL/path logo website (nullable) |
| status | ENUM('pending', 'approved', 'rejected') | Status moderasi |
| views_count | INTEGER | Jumlah views (default: 0) |
| created_at | TIMESTAMP | Waktu upload |
| updated_at | TIMESTAMP | Waktu update terakhir |

**Relasi:**
- `belongsTo` User (creator)
- `belongsTo` Category
- `belongsToMany` Tags (many-to-many)
- `belongsToMany` Collections (many-to-many)

### **Tabel: categories**
Kategori showcase (Website, Mobile, Dashboard, Landing Page, dll)

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Nama kategori (unique) |
| slug | VARCHAR(100) | URL-friendly name |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu update |

### **Tabel: tags**
Tags untuk filtering showcase (React, Vue, Tailwind, dll)

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(50) | Nama tag (unique) |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu update |

### **Tabel: showcase_tag** (Pivot)
Relasi many-to-many antara showcases dan tags

| Field | Type | Description |
|-------|------|-------------|
| showcase_id | BIGINT | Foreign key ke showcases |
| tag_id | BIGINT | Foreign key ke tags |

### **Tabel: collections**
Koleksi/folder yang dibuat user untuk menyimpan showcase favorit

| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key ke users |
| name | VARCHAR(100) | Nama koleksi |
| description | TEXT | Deskripsi (nullable) |
| is_public | BOOLEAN | Public/Private (default: false) |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu update |

### **Tabel: collection_showcase** (Pivot)
Menyimpan showcase yang ada di dalam collection

| Field | Type | Description |
|-------|------|-------------|
| collection_id | BIGINT | Foreign key ke collections |
| showcase_id | BIGINT | Foreign key ke showcases |
| created_at | TIMESTAMP | Kapan showcase ditambahkan |

---

## 🔐 Autentikasi

Orasis menggunakan **Laravel Sanctum** untuk token-based authentication.

### Flow Autentikasi

1. **Register** → User mendaftar dengan email & password
2. **Login** → Mendapatkan `access_token`
3. **Request API** → Kirim token di header: `Authorization: Bearer {token}`
4. **Logout** → Token dihapus dari database

### Cara Menggunakan Token

Setiap request ke protected endpoint harus menyertakan header:
```
Authorization: Bearer 1|abc123xyz...
```

### Middleware

- `auth:sanctum` - Proteksi untuk authenticated users
- `admin` - Proteksi khusus untuk admin saja

---

## 📡 API Endpoints

### **Authentication**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/register` | ❌ | Registrasi user baru |
| POST | `/api/login` | ❌ | Login dan dapatkan token |
| POST | `/api/logout` | ✅ | Logout (hapus token) |

**Request Body Register:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response Login:**
```json
{
  "message": "Login successful",
  "access_token": "1|abc123...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### **Showcases (Public)**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/showcases` | ❌ | List showcase approved |
| GET | `/api/showcases/{id}` | ❌ | Detail showcase (+ view tracking) |
| GET | `/api/showcases/search` | ❌ | Search showcase by title |

**Query Parameters untuk `/api/showcases`:**
- `sort` - newest (default), oldest, most_viewed, title_asc, title_desc
- `per_page` - jumlah per halaman (default: 10, max: 100)
- `category` - filter by kategori name
- `page` - nomor halaman

**Contoh Request:**
```
GET /api/showcases?sort=most_viewed&per_page=20&category=mobile
```

---

### **Showcases (Protected)**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/showcases` | ✅ User | Upload showcase baru |
| PUT | `/api/showcases/{id}` | ✅ Owner/Admin | Update showcase |
| DELETE | `/api/showcases/{id}` | ✅ Owner/Admin | Hapus showcase |

**Upload Showcase (multipart/form-data):**
```
POST /api/showcases
Authorization: Bearer {token}

Fields:
- title (required)
- description (required)
- url_website (required, valid URL)
- image_url atau image_file (salah satu required)
- logo_url atau logo_file (optional)
- category_id (required, must exist)
- tags[] (optional, array of tag IDs)
```

---

### **Admin - Showcase Moderation**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/showcases/all` | ✅ Admin | List semua showcase |
| GET | `/api/admin/showcases/pending` | ✅ Admin | List showcase pending |
| PATCH | `/api/admin/showcases/{id}/status` | ✅ Admin | Approve/reject showcase |
| PATCH | `/api/admin/showcases/bulk-status` | ✅ Admin | Bulk approve/reject |

**Update Status:**
```json
{
  "status": "approved" // atau "rejected"
}
```

**Bulk Update:**
```json
{
  "showcase_ids": [1, 2, 3],
  "status": "approved"
}
```

---

### **Categories**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | ❌ | List semua kategori |
| POST | `/api/categories` | ✅ Admin | Tambah kategori baru |
| PUT | `/api/categories/{id}` | ✅ Admin | Update kategori |
| DELETE | `/api/categories/{id}` | ✅ Admin | Hapus kategori |

---

### **Tags**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tags` | ❌ | List semua tags |
| POST | `/api/tags` | ✅ Admin | Tambah tag baru |
| PUT | `/api/tags/{id}` | ✅ Admin | Update tag |
| DELETE | `/api/tags/{id}` | ✅ Admin | Hapus tag |

---

### **Collections**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/collections` | ✅ User | List koleksi user |
| POST | `/api/collections` | ✅ User | Buat koleksi baru |
| GET | `/api/collections/{id}` | ✅ Owner | Detail koleksi |
| PUT | `/api/collections/{id}` | ✅ Owner | Update koleksi |
| DELETE | `/api/collections/{id}` | ✅ Owner | Hapus koleksi |
| POST | `/api/collections/{id}/showcases` | ✅ Owner | Tambah showcase ke koleksi |
| DELETE | `/api/collections/{id}/showcases/{showcase}` | ✅ Owner | Hapus showcase dari koleksi |

**Buat Collection:**
```json
{
  "name": "Favorite E-Commerce",
  "description": "Collection of best e-commerce designs",
  "is_public": true
}
```

---

### **Profile**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | ✅ User | Get profil user login |
| PUT | `/api/profile` | ✅ User | Update profil |
| POST | `/api/profile/upload-image` | ✅ User | Upload foto profil |
| PUT | `/api/profile/password` | ✅ User | Ganti password |
| DELETE | `/api/profile` | ✅ User | Hapus akun |

---

### **Dashboard**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/user` | ✅ User | Dashboard stats user |
| GET | `/api/dashboard/admin` | ✅ Admin | Dashboard stats admin |

**Response Dashboard User:**
```json
{
  "showcases_count": 5,
  "collections_count": 3,
  "total_views": 1250,
  "pending_showcases": 2,
  "approved_showcases": 3
}
```

---

## ✨ Fitur Utama

### 1. **Sistem Moderasi Showcase**
- Showcase baru berstatus `pending`
- Admin review dan approve/reject
- User biasa hanya lihat showcase approved
- Owner/admin bisa lihat showcase pending milik sendiri

### 2. **View Tracking**
- Setiap kali user melihat detail showcase → `views_count` +1
- Owner & admin tidak dihitung sebagai view
- Digunakan untuk sorting "Most Viewed"

### 3. **File Upload System**
- Mendukung upload gambar showcase (JPEG/PNG/WEBP, max 5MB)
- Mendukung upload logo (termasuk SVG, max 2MB)
- Alternatif: bisa pakai URL eksternal
- File disimpan di `storage/app/public/showcases` dan `storage/app/public/logos`
- Accessible via `http://localhost:8000/storage/showcases/...`

### 4. **Collection System**
- User bisa buat multiple collections (seperti playlist)
- Masing-masing collection bisa public/private
- Tambah/hapus showcase dari collection
- Tidak ada limit jumlah showcase per collection

### 5. **Filtering & Sorting**
- Filter by category
- Sort by: newest, oldest, most_viewed, title (A-Z/Z-A)
- Search by title
- Pagination dengan custom per_page

### 6. **Role-Based Access Control**
- **Admin**: Full access, moderasi, dashboard analytics
- **User**: Upload showcase, manage collections, edit profile

---

## 📝 Penjelasan File Penting

### **Controllers**

#### `AuthController.php`
Menangani autentikasi user:
- **register()**: Validasi & create user baru dengan password hashed
- **login()**: Verifikasi kredensial & generate Sanctum token
- **logout()**: Hapus token aktif dari database

#### `ShowcaseController.php`
Controller utama untuk showcase (CRUD):
- **index()**: List showcase approved dengan filter & sort
- **store()**: Upload showcase (file/URL), auto-pending untuk user biasa
- **show()**: Detail showcase + similar items + view tracking
- **update()**: Edit showcase (hanya owner/admin)
- **destroy()**: Hapus showcase (hanya owner/admin)
- **trackView()**: Method internal untuk increment views_count

#### `AdminShowcaseController.php`
Controller khusus moderasi admin:
- **indexAll()**: List semua showcase (all status)
- **indexPending()**: List hanya yang pending
- **updateStatus()**: Approve/reject individual showcase
- **bulkUpdateStatus()**: Bulk approve/reject multiple showcase

#### `CollectionController.php`
Manajemen koleksi user:
- **index()**: List koleksi milik user login
- **store()**: Buat koleksi baru
- **show()**: Detail koleksi dengan list showcase di dalamnya
- **update()**: Edit nama/deskripsi koleksi
- **destroy()**: Hapus koleksi
- **addShowcase()**: Tambah showcase ke koleksi
- **removeShowcase()**: Hapus showcase dari koleksi

#### `ProfileController.php`
Manajemen profil user:
- **show()**: Get data profil
- **update()**: Update name/email
- **uploadProfileImage()**: Upload foto profil (multipart)
- **updatePassword()**: Ganti password dengan validasi old password
- **destroy()**: Hapus akun (soft delete)

---

### **Models**

#### `User.php`
- **Relationships**: 
  - `hasMany` Showcases (creator)
  - `hasMany` Collections
- **Attributes**:
  - `password` → auto-hashed dengan mutator
- **Hidden**: password, remember_token (tidak muncul di JSON response)

#### `Showcase.php`
- **Relationships**:
  - `belongsTo` User
  - `belongsTo` Category
  - `belongsToMany` Tags
  - `belongsToMany` Collections
- **Casts**: 
  - `views_count` → integer
  - `created_at` → datetime
- **Default Status**: pending

#### `Collection.php`
- **Relationships**:
  - `belongsTo` User (owner)
  - `belongsToMany` Showcases (dengan timestamps)
- **Casts**:
  - `is_public` → boolean

#### `Category.php` & `Tag.php`
- Simple models untuk master data
- Relationships ke Showcase (one-to-many untuk Category, many-to-many untuk Tag)

---

### **Migrations**

File migration mendefinisikan struktur database:
- `create_users_table` → Tabel users dengan role
- `create_showcases_table` → Tabel utama showcase
- `create_categories_table` → Master kategori
- `create_tags_table` → Master tags
- `create_showcase_tag_table` → Pivot showcase-tags
- `create_collections_table` → Tabel koleksi user
- `create_collection_showcase_table` → Pivot collection-showcase
- `create_personal_access_tokens_table` → Sanctum tokens

---

### **Seeders**

#### `UserSeeder.php`
Membuat 2 user default:
- **Admin**: email `admin@orasis.com`, password `admin123`, role `admin`
- **User**: email `user@orasis.com`, password `user123`, role `user`

#### `CategorySeeder.php`
Seed 7 kategori: Website, Mobile, Dashboard, Landing Page, Portfolio, E-Commerce, UI Kit

#### `TagSeeder.php`
Seed 12 tags populer: React, Vue, Tailwind CSS, Bootstrap, Figma, dll

#### `ShowcaseSeeder.php`
**Penting**: Membaca data dari file CSV (`database/data/showcase_data.csv`)
- Loop setiap baris CSV
- Create showcase dengan status random (approved/pending)
- Attach 2-3 tags random ke setiap showcase
- **Total**: 20 showcase dummy

#### `CollectionSeeder.php`
Membuat 3 koleksi dummy untuk user biasa, masing-masing berisi 3-5 showcase random.

#### `DatabaseSeeder.php`
Master seeder yang menjalankan semua seeder di atas secara berurutan.

---

### **Routes (`routes/api.php`)**

Struktur routing:
```php
// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/showcases', [ShowcaseController::class, 'index']);

// Protected routes (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('showcases', ShowcaseController::class)->except(['index', 'show']);
    Route::apiResource('collections', CollectionController::class);
    // dst...
});

// Admin only routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/showcases/all', [AdminShowcaseController::class, 'indexAll']);
    Route::patch('/showcases/{id}/status', [AdminShowcaseController::class, 'updateStatus']);
    // dst...
});
```

---

### **Middleware**

#### `AdminMiddleware.php`
Custom middleware untuk proteksi route admin:
```php
public function handle($request, Closure $next)
{
    if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Forbidden. Admin access only.'], 403);
    }
    return $next($request);
}
```

Registered di `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias(['admin' => AdminMiddleware::class]);
})
```

---

### **Config Files**

#### `config/cors.php`
Mengizinkan request dari frontend React (localhost:5173):
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

#### `config/sanctum.php`
Konfigurasi Sanctum:
- Stateful domains untuk cookie-based auth
- Token expiration (optional)

#### `config/filesystems.php`
Disk storage untuk file upload:
- `public` disk → `storage/app/public`
- Symlink ke `public/storage` via `php artisan storage:link`

---

## 🧪 Testing

### Manual Testing dengan Postman/Thunder Client

1. **Register User Baru**
```
POST http://localhost:8000/api/register
Body: {name, email, password, password_confirmation}
```

2. **Login**
```
POST http://localhost:8000/api/login
Body: {email, password}
→ Copy access_token dari response
```

3. **Get Showcases (Public)**
```
GET http://localhost:8000/api/showcases?sort=most_viewed&per_page=20
```

4. **Upload Showcase (Protected)**
```
POST http://localhost:8000/api/showcases
Headers: Authorization: Bearer {token}
Body (form-data): 
  - title
  - description
  - url_website
  - image_file (file upload)
  - category_id
  - tags[] (array)
```

5. **Admin: List Pending**
```
GET http://localhost:8000/api/admin/showcases/pending
Headers: Authorization: Bearer {admin_token}
```

6. **Admin: Approve Showcase**
```
PATCH http://localhost:8000/api/admin/showcases/1/status
Headers: Authorization: Bearer {admin_token}
Body: {"status": "approved"}
```

---

## 🐛 Troubleshooting

### Error: "SQLSTATE[HY000] [1045] Access denied"
**Solusi**: Check kredensial database di `.env`, pastikan MySQL service running.

### Error: "The storage link could not be created"
**Solusi**: Hapus manual folder `public/storage` lalu run `php artisan storage:link` lagi.

### Error: 419 CSRF Token Mismatch (saat testing API)
**Solusi**: API routes tidak memerlukan CSRF token. Pastikan request ke `/api/*` bukan `/web/*`.

### Upload file tidak bisa diakses via URL
**Solusi**: Jalankan `php artisan storage:link` untuk create symlink.

### Error: "Unauthenticated" meski sudah kirim token
**Solusi**: 
- Pastikan format header: `Authorization: Bearer {token}` (ada spasi setelah Bearer)
- Check apakah token masih valid (belum logout/expired)

---

## 📚 Resources

- [Laravel 11 Documentation](https://laravel.com/docs/11.x)
- [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum)
- [Eloquent ORM](https://laravel.com/docs/11.x/eloquent)
- [File Storage](https://laravel.com/docs/11.x/filesystem)

---

## 👥 Tim Pengembang

**Orasis Team** - Tugas Mata Kuliah Perancangan dan Pemrograman Website

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik Universitas Negeri Jakarta.

---

**Catatan**: File ini adalah dokumentasi lengkap backend Orasis. Untuk dokumentasi frontend, lihat `orasis-frontend/README.md`.

---

## 🗂️ Dokumentasi File & Catatan Singkat

- **Lokasi dokumentasi per-file (ringkas):**
  - `app/Http/Controllers/` — controller utama sudah diberi komentar singkat pada masing-masing file.
  - `app/Models/` — model diberi PHPDoc yang menjelaskan relasi dan atribut penting.
  - `database/migrations/` — header migrasi menjelaskan tujuan tabel/kolom (lihat file masing-masing).
  - `database/seeders/` — seeder diberi penjelasan; `ShowcaseSeeder` membaca `database/data/showcase_data.csv`.
  - `config/` — file `auth.php`, `filesystems.php`, `sanctum.php`, `database.php` sudah diberi catatan singkat.

- **Catatan penting sebelum menjalankan `ShowcaseSeeder`:**
  - Pastikan file CSV `database/data/showcase_data.csv` ada dan sesuai format yang diharapkan (kolom: title, category_name, description, tags, url_website, image_url, logo_url).

- **Perintah setup singkat (rekomendasi demo):**
  - `composer install`
  - Salin environment: `cp .env.example .env` (atau salin manual pada Windows)
  - Sesuaikan variabel di `.env` (DB, `APP_URL`, dsb.)
  - `php artisan key:generate`
  - Untuk demo: `php artisan migrate:fresh --seed` (reset + seed)
  - `php artisan storage:link`

- **Integrasi Frontend / Sanctum:**
  - Jika frontend berjalan di `localhost:3000` (Vite), pastikan `SANCTUM_STATEFUL_DOMAINS` di `.env` menyertakan `localhost:3000`.

- **Storage / S3:**
  - Untuk S3, set `AWS_*` env vars dan ubah `FILESYSTEM_DISK` ke `s3` bila diperlukan.

Jika Anda ingin, saya bisa menambahkan tautan file-by-file (daftar path yang telah saya dokumentasikan) di bagian ini—sampaikan jika perlu tautan yang lebih eksplisit.
