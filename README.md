<div align="center">

# 🎨 Orasis - Design Inspiration Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
  <img src="https://img.shields.io/badge/PostgreSQL-14.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<p align="center">
  <strong>Platform showcase design modern untuk menginspirasi desainer dan developer</strong>
</p>

<p align="center">
  Tugas Kelompok - Mata Kuliah Perancangan dan Pemrograman Website<br/>
  Universitas Negeri Jakarta | Semester 3 | 2025/2026
</p>

</div>

---

## 📋 Deskripsi Project

**Orasis** adalah platform web fullstack yang dirancang sebagai galeri inspirasi desain website dan aplikasi mobile. Platform ini memungkinkan pengguna untuk menjelajahi, mengunggah, dan mengkoleksi showcase desain dengan sistem moderasi admin yang robust.

### 🎯 Tujuan Project

Project ini dikembangkan untuk:
- ✅ Implementasi full-stack web development (Frontend, Backend, Database)
- ✅ Menerapkan konsep RESTful API dengan Laravel
- ✅ Membangun modern UI/UX dengan React dan Tailwind CSS
- ✅ Implementasi authentication & authorization
- ✅ Mengelola database relasional dengan PostgreSQL
- ✅ Menerapkan best practices dalam software development

---

## ✨ Fitur Lengkap

### 🌐 Public Features (Guest Users)

#### 1. **Homepage Showcase Gallery**
   - Grid layout responsif untuk menampilkan showcase design
   - Hero carousel dengan showcase populer (berdasarkan views)
   - Advanced filtering:
     - Filter by category (Websites, Mobiles, Landing Page, SaaS, E-commerce, Portfolio)
     - Multi-category selection (advanced filter)
     - Filter by tags (multiple selection)
     - Sort by: Newest, Oldest, Most Viewed, Title (A-Z/Z-A)
   - Real-time search functionality
   - Pagination dengan 50 items per page
   - Loading skeleton untuk better UX
   - Optimistic UI dengan cache-first strategy

#### 2. **Showcase Detail Page**
   - Full-screen showcase image viewer
   - Designer/creator information
   - View counter (auto-increment per unique view)
   - Tags & category display
   - Publication date
   - Related showcases suggestions
   - Direct link to live website
   - Smooth animations dengan Framer Motion

#### 3. **Search & Discovery**
   - Global search bar di navbar
   - Search by title, description, or tags
   - Dedicated search results page
   - Filter integration dalam search results
   - Empty state dengan CTA untuk clear filters

#### 4. **Authentication System**
   - **Register** dengan form validation:
     - Name (required, min 3 characters)
     - Email (required, valid format, unique)
     - Password (required, min 8 characters, confirmed)
   - **Login** dengan remember me option
   - Token-based authentication (Laravel Sanctum)
   - Protected routes untuk authenticated users
   - Auto-redirect setelah login

#### 5. **Dark Mode Support**
   - Toggle dark/light theme
   - Persistent theme preference (localStorage)
   - Smooth theme transition
   - Dark mode optimized untuk semua komponen

#### 6. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: Mobile (< 640px), Tablet (640-1024px), Desktop (> 1024px)
   - Touch-friendly interface untuk mobile
   - Optimized layout untuk semua screen sizes

---

### 👤 Authenticated User Features

#### 1. **User Dashboard**
   - Personal statistics:
     - Total showcases uploaded
     - Showcases pending approval
     - Total views across all showcases
     - Total collections created
   - Recent activity feed
   - Quick actions (Upload New Showcase, View Collections)
   - Responsive dashboard cards

#### 2. **Upload Showcase**
   - Multi-step upload form:
     - **Step 1:** Basic Information
       - Title (required, max 255 characters)
       - Description (optional, rich text support)
       - Category selection (dropdown)
       - Tags (multi-select dengan search)
     - **Step 2:** Image Upload
       - Drag & drop interface
       - Image preview sebelum upload
       - File validation (jpg, png, max 5MB)
       - Crop & resize options
     - **Step 3:** Website Details
       - Live website URL (optional)
       - Designer/Creator name
   - Auto-save draft functionality
   - Validation sebelum submit
   - Status tracking (pending, approved, rejected)

#### 3. **Showcase Management**
   - View all personal showcases
   - Filter by status (pending, approved, rejected)
   - Edit showcase details (hanya untuk pending/rejected)
   - Delete showcase (dengan confirmation modal)
   - Resubmit rejected showcases
   - View reason for rejection (admin feedback)

#### 4. **Collections (Bookmarks)**
   - Create unlimited collections
   - Add/remove showcases to collections
   - Rename & delete collections
   - Private/public collection toggle
   - Share collection via link
   - Drag & drop untuk reorganize showcases
   - Collection cover image (auto-generated dari first showcase)

#### 5. **Profile Management**
   - Edit profile information:
     - Name
     - Email
     - Bio/Description
     - Profile picture upload
     - Social media links (optional)
   - Change password functionality
   - View public profile
   - Account settings

#### 6. **Notifications**
   - Showcase approval notifications
   - Showcase rejection dengan reason
   - New comments/likes (future feature)
   - Collection shared notifications

---

### 👨‍💼 Admin Features

#### 1. **Admin Dashboard**
   - Comprehensive analytics:
     - Total users (with growth percentage)
     - Total showcases (approved + pending)
     - Pending approvals count (real-time)
     - Total views across platform
     - User growth chart (7 days)
     - Showcase submissions chart (7 days)
     - Most viewed showcases (top 5)
     - Recent activities log
   - Quick action cards
   - Responsive admin layout

#### 2. **User Management**
   - View all registered users
   - User table dengan informasi:
     - ID, Name, Email
     - Role (Admin/User)
     - Registration date
     - Total showcases
     - Account status
   - Search users by name/email
   - Filter by role
   - User actions:
     - Edit user details
     - Change user role (promote/demote admin)
     - Suspend/activate user account
     - Delete user (dengan confirmation)
     - View user activity history
   - Bulk actions:
     - Delete multiple users
     - Change role untuk multiple users
   - Pagination & sorting

#### 3. **Showcase Moderation**
   - View all showcases (pending, approved, rejected)
   - Advanced filters:
     - Status (Pending, Approved, Rejected)
     - Category
     - Date range
     - Uploader
   - Showcase moderation actions:
     - **Approve:** Publish showcase ke gallery
     - **Reject:** Dengan reason untuk user
     - **Edit:** Modify showcase details
     - **Delete:** Permanent removal
   - Bulk moderation:
     - Select multiple showcases
     - Approve all selected
     - Reject all selected dengan bulk reason
   - Preview showcase sebelum approve
   - View uploader information
   - Moderation history log

#### 4. **Category Management**
   - CRUD operations untuk categories:
     - Create new category
     - Edit category name
     - Delete category (dengan showcase reassignment)
   - View showcase count per category
   - Category icon/emoji selection
   - Reorder categories (drag & drop)

#### 5. **Tag Management**
   - CRUD operations untuk tags:
     - Create new tag
     - Edit tag name
     - Merge duplicate tags
     - Delete unused tags
   - View usage count per tag
   - Popular tags dashboard
   - Tag suggestions untuk users

#### 6. **Admin Activity Log**
   - Track semua admin actions:
     - User modifications
     - Showcase approvals/rejections
     - Category/tag changes
     - Login/logout events
   - Filter by admin user
   - Filter by action type
   - Export log to CSV
   - Retention policy (90 days)

---

## 🛠️ Tech Stack Detail

### Frontend Architecture

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library untuk component-based architecture |
| **Vite** | 5.4.11 | Build tool & dev server (ultra fast HMR) |
| **React Router DOM** | 7.1.1 | Client-side routing & navigation |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 11.15.0 | Animation library untuk smooth transitions |
| **Axios** | 1.7.9 | HTTP client untuk API calls |
| **Lucide React** | 0.469.0 | Modern icon library |

### Backend Architecture

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Laravel** | 10.x | PHP framework untuk RESTful API |
| **Laravel Sanctum** | 3.x | API authentication (token-based) |
| **PostgreSQL** | 14.x | Relational database |
| **PHP** | 8.2+ | Server-side programming language |
| **Composer** | 2.x | PHP dependency manager |

### Development Tools

- **Git** - Version control
- **GitHub** - Code repository & collaboration
- **Laragon** - Local development environment (optional)
- **pgAdmin 4** - PostgreSQL database management
- **VS Code** - Code editor (recommended extensions: Tailwind IntelliSense, Laravel Extension Pack)

---

## 📦 Prerequisites

Pastikan sistem Anda sudah memiliki:

### Required Software

- ✅ **PHP** >= 8.2 ([Download](https://www.php.net/downloads))
- ✅ **Composer** >= 2.x ([Download](https://getcomposer.org/download/))
- ✅ **Node.js** >= 18.x ([Download](https://nodejs.org/))
- ✅ **NPM** atau **Yarn** (included dengan Node.js)
- ✅ **PostgreSQL** >= 14.x ([Download](https://www.postgresql.org/download/))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

### Optional (Recommended)

- **Laragon** - All-in-one local development environment ([Download](https://laragon.org/))
- **pgAdmin 4** - PostgreSQL GUI tool (included dengan PostgreSQL)

### Check Installation

Verifikasi instalasi dengan command:

```bash
php --version
composer --version
node --version
npm --version
psql --version
git --version
```

---

## 🚀 Installation & Setup

### 📌 Option 1: PHP Artisan Serve (Recommended)

Metode ini lebih reliable dan konsisten untuk development team.

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/Nand-o/Orasis.git
cd Orasis
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend folder
cd orasis-backend

# Install PHP dependencies
composer install

# Copy environment file
copy .env.example .env
# Linux/Mac: cp .env.example .env

# Generate application key
php artisan key:generate
```

**Configure Database:**

Edit file `.env` dan sesuaikan database credentials:

```env
# Application
APP_NAME=Orasis
APP_ENV=local
APP_KEY=base64:your_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=your_password_here

# Sanctum (API Authentication)
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

# CORS
FRONTEND_URL=http://localhost:5173
```

**Create Database & Run Migrations:**

```bash
# Buka PostgreSQL (pgAdmin atau terminal)
# Create database manually:
# Database name: orasis

# Atau via command line:
psql -U postgres -c "CREATE DATABASE orasis;"

# Run migrations untuk create tables
php artisan migrate

# Seed database dengan sample data
php artisan db:seed

# Clear cache (optional tapi recommended)
php artisan optimize:clear
```

**Start Laravel Server:**

```bash
php artisan serve --port=8000
```

✅ **Backend now running at:** `http://localhost:8000`

Test API: `http://localhost:8000/api/showcases`

---

#### 3️⃣ Frontend Setup

Buka **terminal baru** (keep backend server running):

```bash
# Navigate to frontend folder
cd orasis-frontend

# Install Node.js dependencies
npm install

# Copy environment file
copy .env.example .env
# Linux/Mac: cp .env.example .env
```

**Configure API URL:**

Edit file `.env`:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api
VITE_BASE_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Orasis
VITE_APP_DESCRIPTION=Design Inspiration Platform
```

**Start Vite Development Server:**

```bash
npm run dev
```

✅ **Frontend now running at:** `http://localhost:5173`

---

### 📌 Option 2: Using Laragon (Alternative)

Laragon menyediakan Apache, PHP, dan PostgreSQL dalam satu package.

#### 1️⃣ Setup Laragon

1. **Download & Install Laragon:** https://laragon.org/download/
2. **Start Laragon** (klik Start All)
3. **Verify Services:**
   - Apache: Running
   - PostgreSQL: Running

#### 2️⃣ Clone Project

```bash
# Clone ke Laragon www directory
cd C:\laragon\www
git clone https://github.com/Nand-o/Orasis.git orasis
```

#### 3️⃣ Backend Setup (Laragon)

```bash
cd C:\laragon\www\orasis\orasis-backend

# Install dependencies
composer install

# Copy environment
copy .env.example .env

# Generate key
php artisan key:generate
```

**Configure `.env` for Laragon:**

```env
APP_URL=http://orasis-backend.test

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

**Create Database:**

```bash
# Via Laragon Menu: Database → pgAdmin
# Create database: orasis

# Run migrations
php artisan migrate

# Seed data
php artisan db:seed

# Clear cache
php artisan optimize:clear
```

**Setup Virtual Host:**

1. Klik kanan **Laragon tray icon**
2. Apache → Virtual Hosts → Add
3. **Name:** `orasis-backend`
4. **Path:** `C:\laragon\www\orasis\orasis-backend\public`
5. **Restart Apache**

Test: `http://orasis-backend.test`

#### 4️⃣ Frontend Setup (Laragon)

```bash
cd C:\laragon\www\orasis\orasis-frontend

# Install dependencies
npm install

# Copy environment
copy .env.example .env
```

**Configure `.env`:**

```env
VITE_API_URL=http://orasis-backend.test/api
VITE_BASE_URL=http://orasis-backend.test
```

**Start dev server:**

```bash
npm run dev
```

Frontend: `http://localhost:5173`

---

## 👤 Default User Accounts

Setelah `php artisan db:seed`, gunakan akun berikut:

### 🔑 Admin Account

```
Email: admin@orasis.com
Password: admin123
Role: Admin
```

**Admin capabilities:**
- Full user management
- Showcase moderation (approve/reject)
- Analytics dashboard
- Category & tag management

### 👥 Regular User Accounts

```
Email: faris@orasis.com
Password: password

Email: ernando@orasis.com
Password: password

Email: candra@orasis.com
Password: password
```

**User capabilities:**
- Upload showcases
- Create collections
- Edit profile
- Bookmark showcases

---

## 📁 Project Structure

```
Orasis/
│
├── orasis-backend/                 # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/       # API Controllers
│   │   │   │   ├── AuthController.php          # Authentication
│   │   │   │   ├── ShowcaseController.php      # Public showcase API
│   │   │   │   ├── AdminShowcaseController.php # Admin moderation
│   │   │   │   ├── CollectionController.php    # User collections
│   │   │   │   ├── ProfileController.php       # User profile
│   │   │   │   └── DashboardController.php     # User dashboard
│   │   │   │
│   │   │   └── Middleware/        # Custom Middleware
│   │   │       ├── AdminMiddleware.php         # Admin route protection
│   │   │       └── Cors.php                    # CORS handling
│   │   │
│   │   ├── Models/                # Eloquent Models
│   │   │   ├── User.php           # User model
│   │   │   ├── Showcase.php       # Showcase model
│   │   │   ├── Collection.php     # Collection model
│   │   │   └── Tag.php            # Tag model
│   │   │
│   │   └── Providers/
│   │       └── AppServiceProvider.php
│   │
│   ├── database/
│   │   ├── migrations/            # Database Schema
│   │   │   ├── create_users_table.php
│   │   │   ├── create_showcases_table.php
│   │   │   ├── create_tags_table.php
│   │   │   ├── create_showcase_tag_table.php
│   │   │   ├── create_collections_table.php
│   │   │   └── create_collection_showcase_table.php
│   │   │
│   │   └── seeders/               # Database Seeders
│   │       ├── UserSeeder.php     # Create default users
│   │       ├── ShowcaseSeeder.php # Sample showcases
│   │       ├── TagSeeder.php      # Common tags
│   │       └── CollectionSeeder.php
│   │
│   ├── routes/
│   │   ├── api.php               # API Routes
│   │   └── web.php               # Web Routes (minimal)
│   │
│   ├── config/                   # Configuration Files
│   │   ├── cors.php
│   │   ├── sanctum.php
│   │   └── database.php
│   │
│   ├── storage/                  # Storage
│   │   ├── app/
│   │   │   ├── public/          # Public files (uploads)
│   │   │   └── private/         # Private files
│   │   └── logs/                # Application logs
│   │
│   ├── .env.example             # Environment template
│   ├── composer.json            # PHP dependencies
│   └── artisan                  # Laravel CLI tool
│
├── orasis-frontend/              # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Navbar.jsx           # Main navigation
│   │   │   │   ├── Footer.jsx           # Footer
│   │   │   │   └── AdminLayout.jsx      # Admin panel layout
│   │   │   │
│   │   │   └── ui/             # UI Components
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── Skeleton.jsx         # Loading skeletons
│   │   │       └── Toast.jsx
│   │   │
│   │   ├── features/           # Feature Modules
│   │   │   ├── home/          # Homepage
│   │   │   │   ├── HomePage.jsx
│   │   │   │   └── components/
│   │   │   │       ├── HeroSection.jsx
│   │   │   │       ├── FilterBar.jsx
│   │   │   │       └── ShowcaseGrid.jsx
│   │   │   │
│   │   │   ├── auth/          # Authentication
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   │
│   │   │   ├── showcase/      # Showcase Features
│   │   │   │   ├── ShowcaseDetailPage.jsx
│   │   │   │   ├── ShowcaseSearchPage.jsx
│   │   │   │   └── components/
│   │   │   │       ├── ShowcaseCard.jsx
│   │   │   │       └── ShowcaseModal.jsx
│   │   │   │
│   │   │   ├── collections/   # Collections Feature
│   │   │   │   ├── CollectionsPage.jsx
│   │   │   │   ├── CollectionDetailPage.jsx
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── admin/         # Admin Panel
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── AdminDashboardPage.jsx
│   │   │   │   ├── users/
│   │   │   │   │   └── AdminUsersPage.jsx
│   │   │   │   └── showcases/
│   │   │   │       └── AdminShowcasesPage.jsx
│   │   │   │
│   │   │   └── about/         # About Page
│   │   │       └── AboutPage.jsx
│   │   │
│   │   ├── services/          # API Services
│   │   │   ├── api.js         # Axios instance configuration
│   │   │   ├── auth.service.js      # Authentication API
│   │   │   ├── showcase.service.js  # Showcase API
│   │   │   ├── collection.service.js
│   │   │   ├── category.service.js
│   │   │   ├── tag.service.js
│   │   │   └── admin.service.js     # Admin API
│   │   │
│   │   ├── context/           # React Context
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Dark mode state
│   │   │
│   │   ├── utils/             # Utility Functions
│   │   │   ├── cacheManager.js      # SessionStorage cache
│   │   │   ├── dateFormatter.js
│   │   │   └── validators.js
│   │   │
│   │   ├── hooks/             # Custom React Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useTheme.js
│   │   │   └── useDebounce.js
│   │   │
│   │   ├── App.jsx            # Main App Component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   │
│   ├── public/                # Static Assets
│   │   ├── favicon.ico
│   │   └── images/
│   │
│   ├── .env.example          # Environment template
│   ├── package.json          # Node.js dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind configuration
│   └── eslint.config.js      # ESLint rules
│
└── README.md                 # Project documentation
```

---

## 🔌 API Endpoints Documentation

### Public Endpoints (No Auth Required)

#### Showcases
```
GET    /api/showcases              # Get all approved showcases (paginated)
GET    /api/showcases/{id}         # Get showcase detail
GET    /api/categories             # Get all categories
GET    /api/tags                   # Get all tags
```

#### Authentication
```
POST   /api/register               # Register new user
POST   /api/login                  # Login user
POST   /api/logout                 # Logout user (requires auth)
```

### Protected Endpoints (Requires Authentication)

#### User Dashboard
```
GET    /api/user/dashboard         # Get user dashboard stats
GET    /api/user/profile           # Get current user profile
PUT    /api/user/profile           # Update user profile
```

#### User Showcases
```
GET    /api/user/showcases         # Get user's showcases
POST   /api/showcases              # Create new showcase
PUT    /api/showcases/{id}         # Update showcase (own only)
DELETE /api/showcases/{id}         # Delete showcase (own only)
```

#### Collections
```
GET    /api/collections            # Get user's collections
POST   /api/collections            # Create collection
GET    /api/collections/{id}       # Get collection detail
PUT    /api/collections/{id}       # Update collection
DELETE /api/collections/{id}       # Delete collection
POST   /api/collections/{id}/showcases/{showcaseId}  # Add showcase to collection
DELETE /api/collections/{id}/showcases/{showcaseId}  # Remove from collection
```

### Admin Endpoints (Requires Admin Role)

#### Admin Dashboard
```
GET    /api/admin/analytics        # Get admin analytics
GET    /api/admin/activities       # Get recent activities
```

#### User Management
```
GET    /api/admin/users            # Get all users (paginated)
GET    /api/admin/users/{id}       # Get user detail
PUT    /api/admin/users/{id}       # Update user
DELETE /api/admin/users/{id}       # Delete user
PUT    /api/admin/users/{id}/role  # Change user role
```

#### Showcase Moderation
```
GET    /api/admin/showcases        # Get all showcases (with status filter)
PUT    /api/admin/showcases/{id}/approve     # Approve showcase
PUT    /api/admin/showcases/{id}/reject      # Reject showcase
POST   /api/admin/showcases/bulk-approve     # Bulk approve
POST   /api/admin/showcases/bulk-reject      # Bulk reject
```

---

## 🎨 UI/UX Features & Optimizations

### Performance Optimizations

1. **Optimistic UI Pattern**
   - Cache-first data loading
   - Instant page transitions
   - Background data refresh
   - SessionStorage caching (5min TTL)

2. **Code Splitting**
   - Lazy loading untuk routes
   - Dynamic imports untuk heavy components
   - Reduced initial bundle size

3. **Image Optimization**
   - Lazy loading images
   - Responsive images dengan srcset
   - WebP format support
   - Progressive image loading

4. **API Optimizations**
   - Request debouncing (search)
   - Pagination untuk large datasets
   - Selective field loading
   - Response caching

### Animations & Transitions

- Framer Motion untuk smooth page transitions
- Micro-interactions pada buttons & cards
- Loading skeletons untuk better perceived performance
- Smooth scroll behavior
- Hover effects dengan scale transformations

### Accessibility (A11y)

- Semantic HTML elements
- ARIA labels untuk interactive elements
- Keyboard navigation support
- Focus visible indicators
- Screen reader friendly
- High contrast dark mode

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 639px) { ... }

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1280px) { ... }
```

---

## 🗄️ Database Schema

### Tables Overview

1. **users** - User accounts (admin & regular users)
2. **showcases** - Design showcases uploaded by users
3. **categories** - Showcase categories
4. **tags** - Showcase tags (many-to-many)
5. **showcase_tag** - Pivot table (showcase ↔ tag)
6. **collections** - User collections (bookmarks)
7. **collection_showcase** - Pivot table (collection ↔ showcase)
8. **personal_access_tokens** - API tokens (Laravel Sanctum)

### Entity Relationship Diagram

```
users (1) ──── (N) showcases
users (1) ──── (N) collections

showcases (N) ──── (1) categories
showcases (N) ──── (N) tags (via showcase_tag)
showcases (N) ──── (N) collections (via collection_showcase)
```

### Key Relationships

- User **has many** Showcases (1:N)
- User **has many** Collections (1:N)
- Showcase **belongs to** Category (N:1)
- Showcase **has many** Tags (N:N)
- Collection **has many** Showcases (N:N)

---

## 🐛 Troubleshooting & Common Issues

### ❌ Issue 1: Database Connection Error

**Error:** `SQLSTATE[08006] could not connect to server: Connection refused`

**Causes:**
- PostgreSQL service not running
- Wrong database credentials
- Database doesn't exist

**Solutions:**

```bash
# Windows: Check PostgreSQL service
# Open Services → PostgreSQL → Start

# Check PostgreSQL status (Linux/Mac)
sudo service postgresql status

# Create database manually
psql -U postgres -c "CREATE DATABASE orasis;"

# Verify .env database credentials
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

---

### ❌ Issue 2: 404 Not Found (API Routes)

**Error:** `404 | Not Found` pada endpoint `/api/admin/analytics`

**Causes:**
- Laravel route cache outdated
- Apache rewrite rules not working (Laragon)
- Wrong API URL di frontend

**Solutions:**

```bash
# Clear all Laravel caches
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear

# Restart Laragon Apache (if using Laragon)
# Klik kanan Laragon icon → Stop All → Start All

# Atau gunakan php artisan serve (more reliable)
php artisan serve --port=8000

# Verify frontend .env
VITE_API_URL=http://localhost:8000/api
```

---

### ❌ Issue 3: CORS Policy Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Causes:**
- Backend CORS not configured
- Frontend URL not whitelisted
- Incorrect credentials handling

**Solutions:**

**Backend (`config/cors.php`):**

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
```

**Backend (`.env`):**

```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
SESSION_DOMAIN=localhost
```

**Frontend (`services/api.js`):**

```javascript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Important!
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});
```

Restart both servers after changes.

---

### ❌ Issue 4: Composer/NPM Install Errors

**Error:** `Your requirements could not be resolved to an installable set of packages`

**Solutions:**

```bash
# Clear Composer cache
composer clear-cache
composer install

# Update Composer
composer self-update

# If still failing, delete vendor and reinstall
rm -rf vendor composer.lock
composer install

# For NPM errors
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ Issue 5: Laravel Storage Permission Error

**Error:** `The stream or file could not be opened: Permission denied`

**Solutions:**

```bash
# Windows (run as Administrator in PowerShell)
cd orasis-backend
php artisan storage:link
icacls storage /grant Everyone:F /T
icacls bootstrap/cache /grant Everyone:F /T

# Linux/Mac
chmod -R 775 storage bootstrap/cache
chown -R $USER:www-data storage bootstrap/cache
```

---

### ❌ Issue 6: Vite Dev Server Won't Start

**Error:** `Port 5173 is already in use`

**Solutions:**

```bash
# Kill process using port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

### ❌ Issue 7: Images Not Displaying

**Causes:**
- Storage symlink not created
- Wrong image URL
- Missing file permissions

**Solutions:**

```bash
# Create storage symlink
php artisan storage:link

# Verify .env
APP_URL=http://localhost:8000

# Check file uploaded to storage/app/public
# Should be accessible via: http://localhost:8000/storage/filename.jpg
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register new user
- [ ] Login dengan valid credentials
- [ ] Login dengan invalid credentials (error handling)
- [ ] Logout functionality
- [ ] Protected routes redirect when not authenticated
- [ ] Admin routes redirect for non-admin users

#### Public Features
- [ ] Browse showcases (homepage)
- [ ] Search showcases
- [ ] Filter by category
- [ ] Filter by tags (multiple)
- [ ] Sort showcases (newest, oldest, most viewed, title)
- [ ] View showcase detail
- [ ] Views counter increments
- [ ] Dark mode toggle persists

#### User Features
- [ ] Upload new showcase
- [ ] Edit own showcase (pending/rejected only)
- [ ] Delete own showcase
- [ ] Create collection
- [ ] Add showcase to collection
- [ ] Remove showcase from collection
- [ ] Delete collection
- [ ] Edit profile
- [ ] Change password
- [ ] View dashboard stats

#### Admin Features
- [ ] View admin dashboard analytics
- [ ] View all users
- [ ] Edit user details
- [ ] Delete user
- [ ] Change user role (admin ↔ user)
- [ ] View pending showcases
- [ ] Approve showcase
- [ ] Reject showcase dengan reason
- [ ] Bulk approve multiple showcases
- [ ] Bulk reject multiple showcases
- [ ] View all showcases (filter by status)

### Automated Testing (Future)

```bash
# Backend (PHPUnit)
cd orasis-backend
php artisan test

# Frontend (Vitest)
cd orasis-frontend
npm run test
```

---

## 📝 Development Workflow & Git Guidelines

### Branch Strategy

```
main                    # Production-ready code
└── feature/axios-integration    # Current development branch
    ├── feature/showcase-upload
    ├── feature/collections
    └── bugfix/filter-issue
```

### Commit Message Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add showcase approval workflow
fix: resolve CORS issue on admin endpoints
docs: update README with API documentation
style: format code with Prettier
refactor: optimize FilterBar with lazy loading
perf: implement cache-first strategy for homepage
test: add unit tests for AuthController
chore: update dependencies
```

### Development Workflow

#### 1. Pull Latest Changes

```bash
git pull origin feature/axios-integration
```

#### 2. Update Dependencies

```bash
# Backend
cd orasis-backend
composer install
php artisan migrate

# Frontend
cd orasis-frontend
npm install
```

#### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd orasis-backend
php artisan serve --port=8000

# Terminal 2: Frontend
cd orasis-frontend
npm run dev
```

#### 4. Make Changes & Test

- Write code
- Test manually atau automated
- Verify di browser
- Check console untuk errors

#### 5. Commit & Push

```bash
# Stage changes
git add .

# Commit dengan descriptive message
git commit -m "feat: implement optimistic UI for homepage"

# Push to remote
git push origin feature/axios-integration
```

#### 6. Create Pull Request (if needed)

- Go to GitHub repository
- Click "New Pull Request"
- Select base: `main`, compare: `feature/axios-integration`
- Add description & reviewers
- Submit PR

---

## 🚀 Deployment (Production)

### Backend Deployment (Laravel)

#### Option 1: Shared Hosting (cPanel)

1. **Upload files via FTP:**
   - Upload semua file **kecuali** `vendor/`, `node_modules/`
   - Upload `.env.example` → rename ke `.env`

2. **Setup database:**
   - Create PostgreSQL database via cPanel
   - Update `.env` dengan credentials

3. **Install dependencies:**
   ```bash
   composer install --optimize-autoloader --no-dev
   ```

4. **Configure environment:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate --force
   php artisan optimize
   ```

#### Option 2: VPS (Ubuntu/Nginx)

```bash
# Install dependencies
sudo apt update
sudo apt install nginx php8.2-fpm php8.2-pgsql postgresql composer

# Clone project
cd /var/www
git clone https://github.com/Nand-o/Orasis.git

# Setup Laravel
cd Orasis/orasis-backend
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan optimize

# Configure Nginx
sudo nano /etc/nginx/sites-available/orasis

# Restart services
sudo systemctl restart nginx php8.2-fpm
```

### Frontend Deployment (React/Vite)

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd orasis-frontend
vercel --prod
```

#### Option 2: Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Add `VITE_API_URL`

#### Option 3: Manual (VPS)

```bash
# Build production bundle
npm run build

# Upload dist/ folder to server
# Configure Nginx to serve static files
```

---

## 📚 Additional Resources

### Laravel Documentation
- [Official Laravel Docs](https://laravel.com/docs/10.x)
- [Laravel Sanctum](https://laravel.com/docs/10.x/sanctum)
- [Eloquent ORM](https://laravel.com/docs/10.x/eloquent)

### React Documentation
- [Official React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)

### Styling & UI
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

### Tutorials & Learning
- [Laracasts](https://laracasts.com/) - Laravel video tutorials
- [React Official Tutorial](https://react.dev/learn)
- [Tailwind UI Components](https://tailwindui.com/)

---

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| **Ernando Febrian** | Frontend Developer | [@Nand-o](https://github.com/Nand-o) |
| **Faris Maulana** | Database & Integration Specialist | [@faris](https://github.com/faris) |
| **Candra Afriansyah** | Backend Developer | [@candra](https://github.com/candra) |

---

## 📄 License & Academic Integrity

**Project License:** MIT License (for educational purposes)

**Academic Context:**
- **Mata Kuliah:** Perancangan dan Pemrograman Website
- **Program Studi:** Ilmu Komputer
- **Universitas:** Universitas Negeri Jakarta (UNJ)
- **Semester:** 3 (Ganjil 2024/2025)
- **Dosen Pengampu:** *Ir. Samudra Adi Guna, M.T SA*

**Important Notes:**
- Project ini dikembangkan untuk keperluan tugas akademik
- Dilarang menyalin atau menggunakan kode untuk keperluan komersial tanpa izin
- Referensi dan credit harus diberikan jika menggunakan bagian dari project ini

---

## 📞 Contact & Support

### Untuk Issues & Bug Reports
- **GitHub Issues:** [Orasis Issues](https://github.com/Nand-o/Orasis/issues)

### Untuk Pertanyaan Development
- Buat issue di repository dengan label `question`
- Diskusi di grup WhatsApp kelompok

### Contributing
Contributions are welcome! Please:
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 🎓 Project Acknowledgments

Terima kasih kepada:
- **Dosen Pengampu** - Guidance dan feedback
- **Tim Development** - Collaboration dan hard work
- **Open Source Community** - Libraries dan tools yang digunakan
- **Stack Overflow** - Countless solutions 😄
- **Gemini & GitHub Copilot** - Development assistance

---

## 📈 Project Stats

- **Lines of Code:** ~15,000+ (Frontend + Backend)
- **Components:** 50+ React components
- **API Endpoints:** 40+ RESTful endpoints
- **Database Tables:** 8 tables dengan relationships
- **Development Time:** 2 bulan (November - Desember 2024)
- **Contributors:** 3 developers

---

## 🔮 Future Roadmap

### Phase 1 (Current)
- ✅ Basic CRUD operations
- ✅ Authentication & authorization
- ✅ Showcase upload & moderation
- ✅ Collections feature
- ✅ Admin dashboard

### Phase 2 (Future)
- [ ] User profile customization
- [ ] Showcase likes & favorites
- [ ] Comment system
- [ ] Follow/unfollow users
- [ ] Notifications system
- [ ] Email verification
- [ ] Real-time chat/messaging
- [ ] Advanced analytics (charts)
- [ ] Export collections to PDF
- [ ] Public API for developers
- [ ] Mobile app (React Native)
- [ ] PWA support

---

<div align="center">

## 🌟 Star This Repository

Jika project ini membantu Anda, berikan ⭐ di GitHub!

**Made with ❤️ by Team Orasis**

---

**Happy Coding! 🚀**

</div>
