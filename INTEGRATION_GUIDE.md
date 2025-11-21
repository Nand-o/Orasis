# 🔗 Panduan Integrasi React + Laravel dengan Axios

> Panduan lengkap step-by-step untuk mengintegrasikan frontend React dengan backend Laravel menggunakan Axios untuk proyek Orasis

---

## 📋 Daftar Isi

1. [Persiapan Environment](#1-persiapan-environment)
2. [Setup Backend Laravel](#2-setup-backend-laravel)
3. [Setup Frontend React](#3-setup-frontend-react)
4. [Konfigurasi Axios](#4-konfigurasi-axios)
5. [Implementasi Authentication](#5-implementasi-authentication)
6. [Implementasi CRUD Showcase](#6-implementasi-crud-showcase)
7. [Implementasi Collections](#7-implementasi-collections)
8. [Error Handling](#8-error-handling)
9. [Testing & Debugging](#9-testing--debugging)

---

## 1. Persiapan Environment

### 1.1 Software yang Diperlukan

```bash
✅ Node.js (v18 atau lebih tinggi)
✅ PHP (v8.1 atau lebih tinggi)
✅ Composer
✅ PostgreSQL
✅ Git
```

### 1.2 Cek Versi

```powershell
# Cek Node.js
node --version

# Cek PHP
php --version

# Cek Composer
composer --version

# Cek PostgreSQL
psql --version
```

---

## 2. Setup Backend Laravel

### 2.1 Install Dependencies Backend

```powershell
# Masuk ke folder backend
cd orasis-backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2.2 Konfigurasi Database (.env)

Edit file `.env` di folder `orasis-backend`:

```env
APP_NAME=Orasis
APP_ENV=local
APP_KEY=base64:xxx...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=orasis
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Sanctum untuk API Authentication
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
SESSION_DOMAIN=localhost
```

### 2.3 Setup Database

```powershell
# Buat database baru
psql -U postgres
CREATE DATABASE orasis;
\q

# Jalankan migrasi
php artisan migrate

# (Optional) Seed data dummy
php artisan db:seed
```

### 2.4 Konfigurasi CORS

Edit file `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // ⚠️ PENTING: Ubah ke true
];
```

### 2.5 Konfigurasi Sanctum

Edit file `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:5173,127.0.0.1,127.0.0.1:5173,::1',
    Sanctum::currentApplicationUrlWithPort()
))),
```

### 2.6 Jalankan Laravel Server

```powershell
# Jalankan development server
php artisan serve

# Server akan berjalan di http://localhost:8000
```

### 2.7 Verifikasi API Endpoints

Buka browser atau Postman, test endpoint:

```
GET http://localhost:8000/api/showcases
GET http://localhost:8000/api/tags
```

---

## 3. Setup Frontend React

### 3.1 Install Dependencies Frontend

```powershell
# Masuk ke folder frontend
cd orasis-frontend

# Install dependencies
npm install

# Install Axios
npm install axios
```

### 3.2 Setup Environment Variables

Buat file `.env` di folder `orasis-frontend`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_BASE_URL=http://localhost:8000
```

### 3.3 Jalankan React Development Server

```powershell
npm run dev

# Server akan berjalan di http://localhost:5173
```

---

## 4. Konfigurasi Axios

### 4.1 Buat Axios Instance

Buat file `src/services/api.js`:

```javascript
import axios from 'axios';

// Base URL dari environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

// Buat Axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // ⚠️ PENTING: Untuk mengirim cookies (Sanctum)
});

// Request Interceptor - Tambahkan token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Redirect to login
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error.response && error.response.status === 403) {
            console.error('Access forbidden');
        }

        // Handle 500 Internal Server Error
        if (error.response && error.response.status === 500) {
            console.error('Server error');
        }

        return Promise.reject(error);
    }
);

export default api;
export { BASE_URL };
```

### 4.2 Buat Service Modules

Buat folder structure:
```
src/
  services/
    api.js           # Axios instance (sudah dibuat)
    auth.service.js  # Authentication services
    showcase.service.js  # Showcase CRUD services
    collection.service.js  # Collection services
    tag.service.js   # Tag services
```

---

## 5. Implementasi Authentication

### 5.1 Auth Service (`src/services/auth.service.js`)

```javascript
import api from './api';

const authService = {
    // ===== REGISTER =====
    async register(userData) {
        try {
            const response = await api.post('/register', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                password_confirmation: userData.password_confirmation,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== LOGIN =====
    async login(credentials) {
        try {
            // Step 1: Get CSRF token (untuk Sanctum)
            await api.get('/sanctum/csrf-cookie', {
                baseURL: import.meta.env.VITE_BASE_URL,
            });

            // Step 2: Login dan dapatkan token
            const response = await api.post('/login', {
                email: credentials.email,
                password: credentials.password,
            });

            // Step 3: Simpan token dan user data
            if (response.data.token) {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== LOGOUT =====
    async logout() {
        try {
            await api.post('/logout');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        } catch (error) {
            // Tetap hapus token meskipun request gagal
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            throw error.response?.data || error.message;
        }
    },

    // ===== GET CURRENT USER =====
    async getCurrentUser() {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== UPDATE PROFILE =====
    async updateProfile(userData) {
        try {
            const response = await api.put('/profile', userData);
            // Update local storage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== CHECK AUTH STATUS =====
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    },

    // ===== GET STORED USER =====
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // ===== CHECK IF ADMIN =====
    isAdmin() {
        const user = this.getUser();
        return user?.role === 'admin';
    },
};

export default authService;
```

### 5.2 Auth Context (`src/context/AuthContext.jsx`)

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
        isAdmin: authService.isAdmin(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

### 5.3 Update App.jsx dengan AuthProvider

```javascript
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    {/* Routes */}
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

### 5.4 Contoh Komponen Login (`src/features/auth/LoginPage.jsx`)

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/'); // Redirect ke homepage setelah login
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
```

### 5.5 Protected Route Component

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
```

---

## 6. Implementasi CRUD Showcase

### 6.1 Showcase Service (`src/services/showcase.service.js`)

```javascript
import api from './api';

const showcaseService = {
    // ===== GET ALL SHOWCASES (Public) =====
    async getAll(params = {}) {
        try {
            const response = await api.get('/showcases', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== GET SHOWCASE BY ID =====
    async getById(id) {
        try {
            const response = await api.get(`/showcases/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== CREATE SHOWCASE (Auth Required) =====
    async create(showcaseData) {
        try {
            const response = await api.post('/showcases', showcaseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== UPDATE SHOWCASE (Auth Required) =====
    async update(id, showcaseData) {
        try {
            const response = await api.put(`/showcases/${id}`, showcaseData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== DELETE SHOWCASE (Auth Required) =====
    async delete(id) {
        try {
            const response = await api.delete(`/showcases/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== FILTER BY CATEGORY =====
    async getByCategory(category) {
        try {
            const response = await api.get('/showcases', {
                params: { category }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default showcaseService;
```

### 6.2 Custom Hook untuk Showcases (`src/hooks/useShowcases.js`)

```javascript
import { useState, useEffect } from 'react';
import showcaseService from '../services/showcase.service';

export const useShowcases = (category = null) => {
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchShowcases();
    }, [category]);

    const fetchShowcases = async () => {
        try {
            setLoading(true);
            const data = category 
                ? await showcaseService.getByCategory(category)
                : await showcaseService.getAll();
            setShowcases(data.data || data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch showcases');
        } finally {
            setLoading(false);
        }
    };

    const refresh = () => {
        fetchShowcases();
    };

    return { showcases, loading, error, refresh };
};
```

### 6.3 Contoh Komponen List Showcase

```javascript
import React, { useEffect, useState } from 'react';
import showcaseService from '../../services/showcase.service';
import ShowcaseCard from './components/ShowcaseCard';

const HomePage = () => {
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        fetchShowcases();
    }, [category]);

    const fetchShowcases = async () => {
        try {
            setLoading(true);
            const data = category
                ? await showcaseService.getByCategory(category)
                : await showcaseService.getAll();
            setShowcases(data.data || data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Design Showcase</h1>
            
            {/* Filter Buttons */}
            <div className="mb-8 flex gap-2">
                <button onClick={() => setCategory(null)}>All</button>
                <button onClick={() => setCategory('Landing Page')}>Landing Page</button>
                <button onClick={() => setCategory('SaaS')}>SaaS</button>
                {/* More categories */}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {showcases.map((showcase) => (
                    <ShowcaseCard key={showcase.id} showcase={showcase} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
```

### 6.4 Contoh Form Create/Edit Showcase

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';
import tagService from '../../services/tag.service';

const ShowcaseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url_website: '',
        image_url: '',
        category: '',
        tags: [],
    });
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTags();
        if (isEdit) {
            fetchShowcase();
        }
    }, [id]);

    const fetchTags = async () => {
        try {
            const data = await tagService.getAll();
            setAvailableTags(data.data || data);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    const fetchShowcase = async () => {
        try {
            const data = await showcaseService.getById(id);
            setFormData({
                title: data.data.title,
                description: data.data.description,
                url_website: data.data.url_website,
                image_url: data.data.image_url,
                category: data.data.category,
                tags: data.data.tags?.map(t => t.id) || [],
            });
        } catch (err) {
            setError('Failed to load showcase');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await showcaseService.update(id, formData);
            } else {
                await showcaseService.create(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to save showcase');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">
                {isEdit ? 'Edit Showcase' : 'Upload Showcase'}
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        rows="4"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Website URL</label>
                    <input
                        type="url"
                        name="url_website"
                        value={formData.url_website}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Image URL</label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Landing Page">Landing Page</option>
                        <option value="SaaS">SaaS</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Dashboard">Dashboard</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : isEdit ? 'Update' : 'Upload'}
                </button>
            </form>
        </div>
    );
};

export default ShowcaseForm;
```

---

## 7. Implementasi Collections

### 7.1 Collection Service (`src/services/collection.service.js`)

```javascript
import api from './api';

const collectionService = {
    // ===== GET ALL USER'S COLLECTIONS =====
    async getAll() {
        try {
            const response = await api.get('/collections');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== GET COLLECTION DETAIL WITH SHOWCASES =====
    async getById(id) {
        try {
            const response = await api.get(`/collections/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== CREATE COLLECTION =====
    async create(name) {
        try {
            const response = await api.post('/collections', { name });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== UPDATE COLLECTION NAME =====
    async update(id, name) {
        try {
            const response = await api.put(`/collections/${id}`, { name });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== DELETE COLLECTION =====
    async delete(id) {
        try {
            const response = await api.delete(`/collections/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== ADD SHOWCASE TO COLLECTION =====
    async addShowcase(collectionId, showcaseId) {
        try {
            const response = await api.post(
                `/collections/${collectionId}/showcases`,
                { showcase_id: showcaseId }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== REMOVE SHOWCASE FROM COLLECTION =====
    async removeShowcase(collectionId, showcaseId) {
        try {
            const response = await api.delete(
                `/collections/${collectionId}/showcases/${showcaseId}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default collectionService;
```

### 7.2 Collection Context (`src/features/collections/context/CollectionContext.jsx`)

```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import collectionService from '../../../services/collection.service';
import { useAuth } from '../../../context/AuthContext';

const CollectionContext = createContext(null);

export const CollectionProvider = ({ children }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCollections();
        }
    }, [isAuthenticated]);

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const data = await collectionService.getAll();
            setCollections(data.data || []);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCollection = async (name) => {
        try {
            const data = await collectionService.create(name);
            setCollections([...collections, data.data]);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const updateCollection = async (id, name) => {
        try {
            const data = await collectionService.update(id, name);
            setCollections(
                collections.map((col) => (col.id === id ? data.data : col))
            );
            return data;
        } catch (error) {
            throw error;
        }
    };

    const deleteCollection = async (id) => {
        try {
            await collectionService.delete(id);
            setCollections(collections.filter((col) => col.id !== id));
        } catch (error) {
            throw error;
        }
    };

    const addToCollection = async (collectionId, showcaseId) => {
        try {
            await collectionService.addShowcase(collectionId, showcaseId);
            await fetchCollections(); // Refresh
        } catch (error) {
            throw error;
        }
    };

    const removeFromCollection = async (collectionId, showcaseId) => {
        try {
            await collectionService.removeShowcase(collectionId, showcaseId);
            await fetchCollections(); // Refresh
        } catch (error) {
            throw error;
        }
    };

    const value = {
        collections,
        loading,
        fetchCollections,
        createCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
    };

    return (
        <CollectionContext.Provider value={value}>
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollections = () => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error('useCollections must be used within CollectionProvider');
    }
    return context;
};
```

---

## 8. Error Handling

### 8.1 Error Handler Component (`src/components/ui/ErrorAlert.jsx`)

```javascript
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ErrorAlert = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-600 mt-1">
                    {typeof error === 'string' ? error : error.message}
                </p>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-red-400 hover:text-red-600">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;
```

### 8.2 Global Error Handler

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message || 'An error occurred';

        switch (status) {
            case 400:
                return 'Bad request. Please check your input.';
            case 401:
                return 'Unauthorized. Please login again.';
            case 403:
                return 'Access forbidden.';
            case 404:
                return 'Resource not found.';
            case 422:
                // Validation errors
                if (error.response.data?.errors) {
                    return Object.values(error.response.data.errors).flat().join(', ');
                }
                return message;
            case 500:
                return 'Server error. Please try again later.';
            default:
                return message;
        }
    } else if (error.request) {
        // Request made but no response
        return 'Network error. Please check your connection.';
    } else {
        // Error in setting up request
        return error.message || 'An unexpected error occurred.';
    }
};
```

---

## 9. Testing & Debugging

### 9.1 Test API Endpoints dengan Console

```javascript
// Buka browser console dan test:

// Test get showcases
fetch('http://localhost:8000/api/showcases')
    .then(res => res.json())
    .then(data => console.log(data));

// Test login
fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password'
    })
})
    .then(res => res.json())
    .then(data => console.log(data));
```

### 9.2 Debug Axios Requests

Tambahkan di `src/services/api.js`:

```javascript
// Debug mode
const DEBUG = import.meta.env.DEV;

api.interceptors.request.use((config) => {
    if (DEBUG) {
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        console.log('📦 Data:', config.data);
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        if (DEBUG) {
            console.log('✅ Response:', response.status, response.data);
        }
        return response;
    },
    (error) => {
        if (DEBUG) {
            console.error('❌ Error:', error.response?.status, error.response?.data);
        }
        return Promise.reject(error);
    }
);
```

### 9.3 Common Issues & Solutions

#### Issue 1: CORS Error
```
Solution:
1. Pastikan config/cors.php di backend sudah benar
2. Pastikan withCredentials: true di axios
3. Restart Laravel server setelah perubahan config
```

#### Issue 2: 401 Unauthorized
```
Solution:
1. Cek apakah token tersimpan di localStorage
2. Cek apakah token dikirim di header Authorization
3. Cek apakah token masih valid
```

#### Issue 3: 419 CSRF Token Mismatch
```
Solution:
1. Panggil /sanctum/csrf-cookie sebelum login
2. Pastikan withCredentials: true
3. Pastikan SANCTUM_STATEFUL_DOMAINS sudah benar di .env
```

---

## 📚 Referensi API Endpoints

### Public Endpoints
```
GET  /api/showcases              # List semua showcase (approved)
GET  /api/showcases/{id}         # Detail showcase
GET  /api/tags                   # List semua tags
POST /api/register               # Registrasi user baru
POST /api/login                  # Login user
```

### Protected Endpoints (Requires Authentication)
```
GET    /api/user                         # Get current user
POST   /api/logout                       # Logout
PUT    /api/profile                      # Update profile
POST   /api/showcases                    # Upload showcase
PUT    /api/showcases/{id}               # Update showcase
DELETE /api/showcases/{id}               # Delete showcase
GET    /api/collections                  # List user collections
POST   /api/collections                  # Create collection
GET    /api/collections/{id}             # Collection detail
PUT    /api/collections/{id}             # Update collection
DELETE /api/collections/{id}             # Delete collection
POST   /api/collections/{id}/showcases   # Add to collection
DELETE /api/collections/{id}/showcases/{showcase_id}  # Remove from collection
```

### Admin Only Endpoints
```
GET   /api/admin/stats                        # Dashboard stats
GET   /api/admin/showcases/pending            # Pending showcases
PATCH /api/admin/showcases/{id}/status        # Approve/reject
POST  /api/tags                               # Create tag
PUT   /api/tags/{id}                          # Update tag
DELETE /api/tags/{id}                         # Delete tag
```

---

## ✅ Checklist Implementasi

### Backend Setup
- [ ] Install dependencies (`composer install`)
- [ ] Setup .env file
- [ ] Konfigurasi database
- [ ] Run migrations (`php artisan migrate`)
- [ ] Seed data (`php artisan db:seed`)
- [ ] Konfigurasi CORS
- [ ] Konfigurasi Sanctum
- [ ] Test API endpoints

### Frontend Setup
- [ ] Install dependencies (`npm install`)
- [ ] Install Axios (`npm install axios`)
- [ ] Setup .env file
- [ ] Buat Axios instance (`src/services/api.js`)
- [ ] Buat service modules (auth, showcase, collection)
- [ ] Buat AuthContext
- [ ] Implement login/register pages
- [ ] Implement protected routes
- [ ] Test authentication flow

### Integration
- [ ] Test CORS configuration
- [ ] Test login flow
- [ ] Test showcase CRUD
- [ ] Test collection CRUD
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test responsive design

---

## 🎉 Selesai!

Anda sekarang memiliki panduan lengkap untuk mengintegrasikan React frontend dengan Laravel backend menggunakan Axios. Ikuti setiap langkah secara berurutan untuk hasil terbaik.

**Happy Coding! 🚀**
