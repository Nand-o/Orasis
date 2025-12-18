# 📚 Dokumentasi Frontend Orasis

> Dokumentasi lengkap untuk memahami struktur, arsitektur, dan implementasi Frontend Orasis

---

## 📑 Daftar Isi

1. [Tentang Proyek](#tentang-proyek)
2. [Tech Stack](#tech-stack)
3. [Struktur Folder](#struktur-folder)
4. [Arsitektur Aplikasi](#arsitektur-aplikasi)
5. [Context & State Management](#context--state-management)
6. [Services Layer](#services-layer)
7. [Routing](#routing)
8. [Components](#components)
9. [Features](#features)
10. [Hooks](#hooks)
11. [Utils & Helpers](#utils--helpers)
12. [Environment Variables](#environment-variables)
13. [Installation & Setup](#installation--setup)
14. [Development Guide](#development-guide)
15. [Build & Deployment](#build--deployment)

---

## 🎯 Tentang Proyek

**Orasis Frontend** adalah Single Page Application (SPA) yang dibangun dengan React 18, berfungsi sebagai interface untuk platform showcase desain web dan mobile. Aplikasi ini mengkonsumsi REST API dari backend Laravel dan menyediakan pengalaman user yang modern, responsif, dan interaktif.

### Fitur Utama:
- 🎨 **Showcase Gallery**: Browse dan explore desain web/mobile dengan filtering & sorting
- 📁 **Collections**: Bookmark dan organize showcase favorit ke dalam collections
- 👤 **User Authentication**: Register, login, dan profile management
- 🎭 **Theme Switching**: Dark mode dan light mode dengan smooth transition
- 🔍 **Advanced Search**: Search dengan real-time filtering
- 📊 **Admin Dashboard**: Approve/reject showcases yang di-submit user
- 📱 **Responsive Design**: Optimal di semua ukuran layar (mobile, tablet, desktop)
- ✨ **Smooth Animations**: Micro-interactions menggunakan Framer Motion

---

## 📌 Documentation Status

- **Scope completed:** File-level JSDoc headers were added across the frontend codebase, covering:
  - Entry points and routing: `index.html`, `main.jsx`, `App.jsx`
  - Context providers: `src/context/*`
  - Services and API layer: `src/services/*`
  - Hooks and utilities: `src/hooks/*`, `src/utils/*`
  - Reusable components and UI primitives: `src/components/*`
  - Feature pages and subcomponents: `src/features/*`
- **Language convention:**
  - Code-level documentation (file headers / JSDoc) is written in **Bahasa Indonesia** to aid local contributors and code review.
  - Runtime and user-facing strings remain in **English** to keep the product consistent for end users.
- **What I did not change:** Implementation logic and behavior were left intact; only documentation headers and selected user-facing message corrections were applied where requested.
- **Next steps recommended:** Run the app and manually spot-check pages (auth flow, showcase form, admin flows) to ensure no residual Indonesian-facing text remains in the UI.


## 🛠️ Tech Stack

### Core Technologies:
| Teknologi | Versi | Fungsi |
|-----------|-------|---------|
| **React** | 18.3.1 | Library UI untuk membangun komponen interaktif |
| **Vite** | 5.4.11 | Build tool modern dengan Hot Module Replacement (HMR) |
| **React Router DOM** | 7.1.1 | Client-side routing untuk SPA |
| **Axios** | 1.7.9 | HTTP client untuk API calls |

### UI & Styling:
| Teknologi | Versi | Fungsi |
|-----------|-------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Framer Motion** | 11.15.0 | Animation library untuk React |
| **Lucide React** | 0.468.0 | Icon library modern dan customizable |
| **clsx** | 2.1.1 | Utility untuk conditional className |

### Additional Libraries:
- **@gsap/react** (1.4.1) - Untuk advanced animations
- **lenis** (1.1.19) - Smooth scrolling library
- **react-masonry-css** (1.0.16) - Masonry grid layout
- **react-intersection-observer** (9.14.0) - Lazy loading dan scroll triggers

---

## 📂 Struktur Folder

```
orasis-frontend/
├── public/                          # Static assets
│   ├── audio/                      # Audio files
│   ├── fonts/                      # Custom fonts
│   ├── img/                        # Images dan logos
│   └── videos/                     # Video backgrounds
│
├── src/                            # Source code
│   ├── App.jsx                     # Root component dengan routing
│   ├── main.jsx                    # Entry point aplikasi
│   ├── index.css                   # Global styles
│   │
│   ├── assets/                     # Assets yang di-import di code
│   │   └── (images, icons, etc.)
│   │
│   ├── components/                 # Reusable components
│   │   ├── common/                # Components umum (Button, Card, dll)
│   │   ├── form/                  # Form-related components
│   │   ├── layout/                # Layout components (Navbar, Footer)
│   │   ├── showcase/              # Showcase-specific components
│   │   └── ui/                    # UI primitives
│   │
│   ├── context/                   # React Context untuk state management
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── CollectionContext.jsx # Collections state
│   │   └── ThemeContext.jsx      # Theme (dark/light mode) state
│   │
│   ├── features/                  # Feature-based modules
│   │   ├── about/                # About page
│   │   ├── admin/                # Admin dashboard & management
│   │   ├── auth/                 # Login & Register pages
│   │   ├── collections/          # Collections management
│   │   ├── home/                 # Home/Explore page
│   │   ├── landingPage/          # Landing page untuk guest
│   │   ├── profile/              # User profile pages
│   │   └── showcase/             # Showcase detail & form pages
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js            # Hook untuk authentication
│   │   ├── useCollection.js      # Hook untuk collection operations
│   │   └── useShowcase.js        # Hook untuk showcase operations
│   │
│   ├── services/                  # API service layer
│   │   ├── api.js                # Axios instance dengan interceptors
│   │   ├── auth.service.js       # Authentication APIs
│   │   ├── showcase.service.js   # Showcase CRUD APIs
│   │   ├── collection.service.js # Collection APIs
│   │   ├── admin.service.js      # Admin APIs
│   │   ├── category.service.js   # Category APIs
│   │   ├── tag.service.js        # Tag APIs
│   │   └── user.service.js       # User profile APIs
│   │
│   └── utils/                     # Utility functions & helpers
│       ├── constants.js           # App constants
│       ├── helpers.js             # Helper functions
│       └── validators.js          # Form validation helpers
│
├── .env                           # Environment variables
├── .env.example                   # Environment variables template
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Tailwind configuration
└── vite.config.js                 # Vite configuration
```

---

## 🏗️ Arsitektur Aplikasi

Orasis Frontend menggunakan arsitektur **feature-based** dengan separation of concerns:

### 1. **Presentation Layer** (Components & Features)
   - Components: Reusable UI components (Button, Card, Modal, dll)
   - Features: Page-level components yang compose smaller components
   - Fokus pada UI rendering dan user interactions

### 2. **State Management Layer** (Context)
   - AuthContext: Manage authentication state (user, token, isAuthenticated)
   - CollectionContext: Manage collections state (user's collections)
   - ThemeContext: Manage theme state (dark/light mode)

### 3. **Business Logic Layer** (Hooks & Services)
   - Custom Hooks: Encapsulate complex logic dan state operations
   - Services: Handle semua API calls ke backend

### 4. **Data Layer** (API Services)
   - Axios instance dengan request/response interceptors
   - Token injection otomatis
   - Error handling terpusat

### Flow Diagram:
```
User Interaction
    ↓
Component/Feature
    ↓
Custom Hook (optional)
    ↓
Service (API Call)
    ↓
Axios Instance (with interceptors)
    ↓
Backend API
    ↓
Response
    ↓
Update Context/State
    ↓
Re-render Component
```

---

## 🌐 Context & State Management

### 1. **AuthContext** (`src/context/AuthContext.jsx`)

**Fungsi**: Mengelola state autentikasi user di seluruh aplikasi

**State yang dikelola**:
- `user` (Object|null): Data user yang sedang login
- `isAuthenticated` (Boolean): Status login user
- `loading` (Boolean): Loading state saat initial auth check

**Functions yang disediakan**:
```javascript
const {
  user,              // Object: { id, name, email, username, role, ... }
  isAuthenticated,   // Boolean: true jika user sudah login
  loading,           // Boolean: true saat checking auth
  register,          // Function: (userData) => Promise
  login,             // Function: (credentials) => Promise
  logout,            // Function: () => Promise
  updateUser,        // Function: (updatedUser) => void
  checkAuth          // Function: () => void
} = useAuth();
```

**Cara kerja**:
1. Saat aplikasi pertama kali load, AuthProvider akan check localStorage
2. Jika ada token dan user data, set `isAuthenticated = true`
3. Jika tidak ada, set `isAuthenticated = false`
4. Selama loading, tampilkan loading spinner
5. Setelah auth check selesai, render children (routes)

**Persistensi**:
- Token disimpan di localStorage dengan key: `auth_token`
- User data disimpan di localStorage dengan key: `user` (JSON string)

**Usage Example**:
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

### 2. **CollectionContext** (`src/context/CollectionContext.jsx`)

**Fungsi**: Mengelola state collections user (bookmark showcases)

**State yang dikelola**:
- `collections` (Array): List semua collections milik user
- `loading` (Boolean): Loading state saat fetch collections
- `error` (String|null): Error message jika ada

**Functions yang disediakan**:
```javascript
const {
  collections,           // Array: [{ id, name, description, showcases_count }, ...]
  loading,              // Boolean
  error,                // String|null
  fetchCollections,     // Function: () => Promise
  createCollection,     // Function: (data) => Promise
  updateCollection,     // Function: (id, data) => Promise
  deleteCollection,     // Function: (id) => Promise
  addShowcaseToCollection,    // Function: (collectionId, showcaseId) => Promise
  removeShowcaseFromCollection // Function: (collectionId, showcaseId) => Promise
} = useCollection();
```

**Cara kerja**:
1. Saat user login, fetch collections dari API
2. Collections disimpan di context state
3. Functions untuk CRUD collections tersedia via context
4. Setiap perubahan (create, update, delete) akan trigger refetch

**Usage Example**:
```javascript
import { useCollection } from './context/CollectionContext';

function SaveToCollection({ showcaseId }) {
  const { collections, addShowcaseToCollection } = useCollection();

  const handleSave = async (collectionId) => {
    await addShowcaseToCollection(collectionId, showcaseId);
    alert('Showcase saved to collection!');
  };

  return (
    <div>
      {collections.map(col => (
        <button key={col.id} onClick={() => handleSave(col.id)}>
          Save to {col.name}
        </button>
      ))}
    </div>
  );
}
```

---

### 3. **ThemeContext** (`src/context/ThemeContext.jsx`)

**Fungsi**: Mengelola dark/light mode theme

**State yang dikelola**:
- `theme` (String): 'light' atau 'dark'

**Functions yang disediakan**:
```javascript
const {
  theme,        // String: 'light' | 'dark'
  toggleTheme   // Function: () => void
} = useTheme();
```

**Cara kerja**:
1. Check localStorage untuk saved theme preference
2. Jika tidak ada, gunakan system preference (prefers-color-scheme)
3. Apply theme dengan menambah/remove class 'dark' di <html>
4. Persist theme preference ke localStorage

**Usage Example**:
```javascript
import { useTheme } from './context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
}
```

---

## 🔌 Services Layer

Services layer menangani semua komunikasi dengan backend API. Setiap service file berisi functions untuk specific domain.

### 1. **api.js** - Base Axios Instance

File ini adalah foundation untuk semua API calls. Berisi axios instance yang sudah dikonfigurasi dengan:

**Base Configuration**:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://orasis-backend.test/api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true  // Untuk cookie-based auth
});
```

**Request Interceptor** (Token Injection):
```javascript
// Otomatis inject token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** (Error Handling):
```javascript
// Handle error responses secara global
api.interceptors.response.use(
  (response) => response,  // Success response
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized: Clear auth & redirect ke login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden: Log error
      console.error('Forbidden:', error.response.data);
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);
```

---

### 2. **auth.service.js** - Authentication APIs

**Available Functions**:

#### `register(userData)`
- **Endpoint**: `POST /api/register`
- **Params**: `{ name, email, username, password, password_confirmation }`
- **Returns**: `{ message, user }`
- **Note**: Tidak auto-login, user harus login manual setelah register

#### `login(credentials)`
- **Endpoint**: `POST /api/login`
- **Params**: `{ email, password }`
- **Returns**: `{ user, access_token }`
- **Side Effect**: Save token dan user ke localStorage

#### `logout()`
- **Endpoint**: `POST /api/logout`
- **Returns**: `{ message }`
- **Side Effect**: Clear token dan user dari localStorage

#### `getCurrentUser()`
- **Source**: localStorage
- **Returns**: User object atau null

#### `getToken()`
- **Source**: localStorage
- **Returns**: Token string atau null

#### `isAuthenticated()`
- **Returns**: Boolean (true jika ada token)

#### `getProfile()`
- **Endpoint**: `GET /api/user/profile`
- **Returns**: `{ user }` (fresh data dari API)
- **Side Effect**: Update user di localStorage

---

### 3. **showcase.service.js** - Showcase CRUD APIs

**Available Functions**:

#### `getAll(params)`
- **Endpoint**: `GET /api/showcases`
- **Params**: `{ page, per_page, sort, category, search }`
- **Returns**: Paginated showcases
- **Access**: Public

#### `getById(id)`
- **Endpoint**: `GET /api/showcases/:id`
- **Returns**: `{ showcase, similar_showcases }`
- **Access**: Public

#### `create(showcaseData, onUploadProgress)`
- **Endpoint**: `POST /api/showcases`
- **Params**: FormData dengan fields: title, description, category_id, type, images[], url, tags
- **Returns**: `{ message, showcase }`
- **Access**: Authenticated
- **Special**: Support upload progress callback

#### `update(id, showcaseData, onUploadProgress)`
- **Endpoint**: `PUT /api/showcases/:id` (atau POST dengan `_method=PUT`)
- **Params**: FormData atau Object
- **Returns**: `{ message, showcase }`
- **Access**: Owner atau Admin

#### `delete(id)`
- **Endpoint**: `DELETE /api/showcases/:id`
- **Returns**: `{ message }`
- **Access**: Owner atau Admin

#### `getByCategory(category)`
- **Endpoint**: `GET /api/showcases?category={slug}`
- **Returns**: Filtered showcases
- **Access**: Public

#### `getAllForAdmin()`
- **Endpoint**: `GET /api/admin/showcases`
- **Returns**: All showcases (no pagination)
- **Access**: Admin only

#### `updateStatus(id, status)`
- **Endpoint**: `PATCH /api/admin/showcases/:id/status`
- **Params**: `{ status: 'approved' | 'rejected' }`
- **Returns**: `{ message, showcase }`
- **Access**: Admin only

#### `getTrending()`
- **Endpoint**: `GET /api/showcases/trending`
- **Returns**: Trending showcases (berdasarkan views 7 hari terakhir)
- **Access**: Public

#### `getPopular()`
- **Endpoint**: `GET /api/showcases/popular`
- **Returns**: Popular showcases (all-time most viewed)
- **Access**: Public

#### `trackView(id)`
- **Endpoint**: `POST /api/showcases/:id/track-view`
- **Returns**: `{ message }` atau null (silent fail)
- **Access**: Public

---

### 4. **collection.service.js** - Collection Management APIs

**Available Functions**:

#### `getAll()`
- **Endpoint**: `GET /api/collections`
- **Returns**: `{ collections }`
- **Access**: Authenticated

#### `getById(id)`
- **Endpoint**: `GET /api/collections/:id`
- **Returns**: `{ collection, showcases }`
- **Access**: Owner

#### `create(collectionData)`
- **Endpoint**: `POST /api/collections`
- **Params**: `{ name, description }`
- **Returns**: `{ message, collection }`
- **Access**: Authenticated

#### `update(id, collectionData)`
- **Endpoint**: `PUT /api/collections/:id`
- **Params**: `{ name, description }`
- **Returns**: `{ message, collection }`
- **Access**: Owner

#### `delete(id)`
- **Endpoint**: `DELETE /api/collections/:id`
- **Returns**: `{ message }`
- **Access**: Owner

#### `addShowcase(collectionId, showcaseId)`
- **Endpoint**: `POST /api/collections/:id/showcases`
- **Params**: `{ showcase_id }`
- **Returns**: `{ message }`
- **Access**: Owner

#### `removeShowcase(collectionId, showcaseId)`
- **Endpoint**: `DELETE /api/collections/:collectionId/showcases/:showcaseId`
- **Returns**: `{ message }`
- **Access**: Owner

---

### 5. **admin.service.js, category.service.js, tag.service.js, user.service.js**

Similar pattern dengan showcase dan collection services. Setiap service handle specific domain dan mengexpose functions untuk API calls.

---

## 🛣️ Routing

Routing menggunakan **React Router DOM v7** dengan configuration-based routing di `App.jsx`.

### Route Structure:

```javascript
// Public Routes (Guest)
/                          → Landing Page
/login                     → Login Page
/register                  → Register Page

// Protected Routes (Authenticated)
/home                      → Home/Explore Page (showcase gallery)
/showcase/:id              → Showcase Detail Page
/showcase/create           → Create Showcase Page
/showcase/:id/edit         → Edit Showcase Page

/profile                   → User Profile Page
/profile/edit              → Edit Profile Page
/profile/showcases         → User's Showcases
/profile/collections       → User's Collections

/collections               → Collections List
/collections/:id           → Collection Detail

/about                     → About Page

// Admin Routes (Admin only)
/admin                     → Admin Dashboard
/admin/showcases           → Admin Showcase Management
/admin/pending-review      → Pending Showcases Review
/admin/users               → User Management
```

### Protected Routes Implementation:

```javascript
// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Admin Route
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (user?.role !== 'admin') {
    return <Navigate to="/home" />;
  }
  
  return children;
}
```

---

## 🧩 Components

### Component Organization:

#### **1. Common Components** (`components/common/`)
Reusable components yang digunakan di berbagai pages:
- `Button.jsx`: Styled button dengan variants (primary, secondary, outline)
- `Card.jsx`: Card container dengan hover effects
- `Modal.jsx`: Modal dialog dengan backdrop
- `LoadingSpinner.jsx`: Loading indicator
- `ErrorMessage.jsx`: Error display component

#### **2. Form Components** (`components/form/`)
Form-related components:
- `Input.jsx`: Text input dengan validation
- `TextArea.jsx`: Textarea dengan character count
- `Select.jsx`: Dropdown select
- `ImageUpload.jsx`: Image upload dengan preview dan aspect ratio support
- `TagInput.jsx`: Input untuk add/remove tags

#### **3. Layout Components** (`components/layout/`)
Layout structure components:
- `Navbar.jsx`: Navigation bar dengan auth menu
- `Footer.jsx`: Footer dengan links
- `Sidebar.jsx`: Sidebar navigation (untuk admin atau profile)
- `Container.jsx`: Max-width container wrapper

#### **4. Showcase Components** (`components/showcase/`)
Showcase-specific components:
- `ShowcaseCard.jsx`: Showcase preview card dengan hover effects
- `ShowcaseGrid.jsx`: Masonry grid layout untuk showcases
- `ShowcaseDetail.jsx`: Full showcase detail display
- `ShowcaseModal.jsx`: Modal untuk showcase detail
- `ShowcaseFilter.jsx`: Filter controls (category, sort, search)

#### **5. UI Primitives** (`components/ui/`)
Low-level UI components:
- `Avatar.jsx`: User avatar dengan fallback
- `Badge.jsx`: Tag/badge component
- `Tooltip.jsx`: Tooltip untuk hover info
- `Dropdown.jsx`: Dropdown menu

---

## 🎨 Features

Features adalah page-level components yang compose smaller components.

### 1. **Landing Page** (`features/landingPage/`)
- **File**: `LandingPage.jsx`, `Hero.jsx`, `Features.jsx`, `Showcase.jsx`
- **Fungsi**: Homepage untuk guest users
- **Sections**:
  - Hero section dengan CTA
  - Features showcase dengan 3D animations
  - Popular showcases preview
  - Footer

### 2. **Home/Explore** (`features/home/`)
- **File**: `HomePage.jsx`, `ExploreSection.jsx`, `FilterBar.jsx`
- **Fungsi**: Main showcase gallery page
- **Features**:
  - Showcase grid dengan infinite scroll
  - Category filter tabs
  - Search bar
  - Sort by latest/popular/trending

### 3. **Showcase** (`features/showcase/`)
- **Files**:
  - `ShowcaseDetailPage.jsx`: Detail view dengan similar items
  - `ShowcaseFormPage.jsx`: Create/Edit form
  - `ShowcaseListPage.jsx`: List view (untuk profile)
  
- **ShowcaseFormPage Features**:
  - Toggle Website/Mobile dengan dynamic aspect ratio (16:9 vs 9:16)
  - Multi-image upload dengan preview
  - Category selection (filtered by type)
  - Tag input
  - URL input (optional)
  - Description textarea
  - Upload progress bar

### 4. **Collections** (`features/collections/`)
- **Files**:
  - `CollectionsPage.jsx`: List user's collections
  - `CollectionDetailPage.jsx`: Showcases dalam collection
  - `CreateCollectionModal.jsx`: Modal untuk create collection
  
- **Features**:
  - Create, rename, delete collections
  - Add/remove showcases
  - Collection grid view

### 5. **Profile** (`features/profile/`)
- **Files**:
  - `ProfilePage.jsx`: User profile view
  - `EditProfilePage.jsx`: Edit profile form
  - `UserShowcasesPage.jsx`: User's submitted showcases
  
- **Features**:
  - View user info dan stats
  - Edit profile (name, bio, avatar)
  - View submitted showcases (pending/approved/rejected)

### 6. **Admin** (`features/admin/`)
- **Files**:
  - `AdminDashboardPage.jsx`: Stats overview
  - `AdminPendingReviewPage.jsx`: Approve/reject pending showcases
  - `AdminShowcasesPage.jsx`: Manage all showcases
  - `AdminUsersPage.jsx`: User management
  
- **Features**:
  - Dashboard dengan stats cards (total users, showcases, pending review)
  - Pending review list dengan approve/reject actions
  - User management (view, block/unblock)

### 7. **Auth** (`features/auth/`)
- **Files**:
  - `LoginPage.jsx`: Login form
  - `RegisterPage.jsx`: Register form
  
- **Features**:
  - Form validation
  - Error display
  - Redirect after successful auth

### 8. **About** (`features/about/`)
- **File**: `AboutPage.jsx`
- **Fungsi**: About page dengan team info dan mission

---

## 🪝 Hooks

Custom hooks untuk encapsulate complex logic:

### `useAuth()`
- **File**: `hooks/useAuth.js`
- **Fungsi**: Wrapper untuk AuthContext
- **Returns**: `{ user, isAuthenticated, loading, login, logout, register }`

### `useCollection()`
- **File**: `hooks/useCollection.js`
- **Fungsi**: Wrapper untuk CollectionContext
- **Returns**: `{ collections, createCollection, deleteCollection, ... }`

### `useShowcase()`
- **File**: `hooks/useShowcase.js`
- **Fungsi**: Logic untuk fetch dan manage showcases
- **Returns**: `{ showcases, loading, fetchShowcases, createShowcase, ... }`

### `useTheme()`
- **File**: `hooks/useTheme.js`
- **Fungsi**: Wrapper untuk ThemeContext
- **Returns**: `{ theme, toggleTheme }`

---

## 🛠️ Utils & Helpers

### `utils/constants.js`
Constants yang digunakan di berbagai places:
```javascript
export const CATEGORIES = [
  { id: 1, name: 'SaaS', slug: 'saas', type: 'website' },
  { id: 2, name: 'Landing Page', slug: 'landing-page', type: 'website' },
  { id: 3, name: 'E-commerce', slug: 'e-commerce', type: 'website' },
  { id: 4, name: 'Mobile UI', slug: 'mobile-ui', type: 'mobile' },
  // ...
];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' }
];
```

### `utils/helpers.js`
Helper functions:
```javascript
// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID');
};

// Get image URL
export const getImageUrl = (path) => {
  return `${import.meta.env.VITE_BASE_URL}/storage/${path}`;
};

// Truncate text
export const truncate = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
```

### `utils/validators.js`
Form validation helpers:
```javascript
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};
```

---

## 🔐 Environment Variables

File `.env` berisi konfigurasi environment:

```env
# API Configuration
VITE_API_URL=http://orasis-backend.test/api
VITE_BASE_URL=http://orasis-backend.test

# App Configuration
VITE_APP_NAME=Orasis
VITE_APP_ENV=development
```

**Penjelasan**:
- `VITE_API_URL`: Base URL untuk API endpoints (dengan `/api`)
- `VITE_BASE_URL`: Base URL untuk storage assets (tanpa `/api`)
- `VITE_APP_NAME`: Nama aplikasi (untuk title, dll)
- `VITE_APP_ENV`: Environment (development, production)

**Usage di code**:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const imageUrl = `${import.meta.env.VITE_BASE_URL}/storage/images/showcase.jpg`;
```

**PENTING**: 
- Vite menggunakan prefix `VITE_` untuk expose env vars ke client
- Jangan simpan secrets (API keys, passwords) di .env client-side
- File .env tidak di-commit ke git (ada di .gitignore)
- Gunakan .env.example sebagai template

---

## 📦 Installation & Setup

### Prerequisites:
- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ atau **pnpm**: v8+
- **Backend API**: Orasis backend harus running

### Steps:

1. **Clone repository** (jika belum):
```bash
cd orasis-frontend
```

2. **Install dependencies**:
```bash
npm install
# atau
pnpm install
```

3. **Setup environment variables**:
```bash
cp .env.example .env
```
Edit `.env` dan sesuaikan `VITE_API_URL` dengan backend URL:
```env
VITE_API_URL=http://orasis-backend.test/api
VITE_BASE_URL=http://orasis-backend.test
```

4. **Run development server**:
```bash
npm run dev
# atau
pnpm dev
```

5. **Open browser**:
```
http://localhost:5173
```

### Troubleshooting:

**Error: Cannot connect to API**
- Pastikan backend running di `http://orasis-backend.test`
- Check `.env` file sudah benar
- Check CORS settings di backend

**Error: Module not found**
- Hapus `node_modules` dan reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Port already in use**
- Change port di vite.config.js:
  ```javascript
  export default defineConfig({
    server: {
      port: 3000  // Custom port
    }
  });
  ```

---

## 🚀 Development Guide

### Development Workflow:

1. **Create feature branch**:
```bash
git checkout -b feature/new-feature
```

2. **Develop & test**:
- Make changes
- Test di browser
- Check console untuk errors

3. **Commit changes**:
```bash
git add .
git commit -m "feat: add new feature"
```

4. **Push & create PR**:
```bash
git push origin feature/new-feature
```

### Code Style:

- **ESLint**: Configured untuk React best practices
- **Run linter**:
  ```bash
  npm run lint
  ```

- **Component naming**: PascalCase (`MyComponent.jsx`)
- **File naming**: PascalCase untuk components, camelCase untuk utils
- **CSS**: Gunakan Tailwind utility classes, avoid inline styles

### Best Practices:

1. **Component Structure**:
   - Small, single-responsibility components
   - Props dengan PropTypes atau TypeScript
   - Proper error boundaries

2. **State Management**:
   - Use Context untuk global state
   - useState untuk local state
   - Avoid prop drilling

3. **API Calls**:
   - Always use services, jangan panggil axios directly di components
   - Handle loading dan error states
   - Use try-catch blocks

4. **Performance**:
   - Use React.memo untuk expensive components
   - Lazy load routes dengan React.lazy
   - Optimize images (compress, lazy load)

5. **Accessibility**:
   - Use semantic HTML
   - Add ARIA labels untuk screen readers
   - Keyboard navigation support

---

## 🏗️ Build & Deployment

### Build untuk Production:

```bash
npm run build
```

Output akan ada di folder `dist/`:
```
dist/
├── assets/           # Bundled JS, CSS, images
├── index.html       # Entry HTML
└── ...
```

### Preview Production Build:

```bash
npm run preview
```

Akan serve production build di `http://localhost:4173`

### Deployment Options:

#### 1. **Netlify** (Recommended untuk SPA)
- Connect repository
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Add `VITE_API_URL`, `VITE_BASE_URL`
- Redirects: Add `_redirects` file untuk SPA routing:
  ```
  /*    /index.html   200
  ```

#### 2. **Vercel**
- Similar dengan Netlify
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variables di settings

#### 3. **Self-hosted (VPS/Server)**
1. Build project:
   ```bash
   npm run build
   ```

2. Upload `dist/` ke server

3. Configure Nginx:
   ```nginx
   server {
     listen 80;
     server_name orasis-frontend.com;
     root /var/www/orasis-frontend/dist;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Environment Variables untuk Production:

```env
VITE_API_URL=https://api.orasis.com/api
VITE_BASE_URL=https://api.orasis.com
VITE_APP_ENV=production
```

**PENTING**:
- Jangan hardcode URLs di code
- Gunakan environment variables untuk semua config
- Test production build sebelum deploy

---

## 📝 Additional Notes

### Testing:
- Unit tests: (belum implemented, bisa gunakan Vitest)
- E2E tests: (belum implemented, bisa gunakan Playwright)

### Future Enhancements:
- [ ] Add unit tests dengan Vitest
- [ ] Add E2E tests dengan Playwright
- [ ] Implement image optimization (WebP, lazy loading)
- [ ] Add PWA support (Service Workers)
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Add error tracking (Sentry)
- [ ] Implement skeleton loading states
- [ ] Add pagination untuk showcase grid
- [ ] Add showcase comments & likes
- [ ] Add user notifications

---

## 👥 Team & Credits

**Developer**: Tim Orasis  
**Backend**: Laravel 11  
**Frontend**: React 18 + Vite  
**Design**: Tailwind CSS + Framer Motion  

---

## 📄 License

This project is licensed for educational purposes.

---

**Dokumentasi ini dibuat untuk memudahkan pemahaman dosen dan reviewer terhadap implementasi Frontend Orasis.**
