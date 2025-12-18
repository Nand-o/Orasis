/**
 * API Configuration
 * 
 * File konfigurasi utama untuk Axios instance yang digunakan di seluruh aplikasi.
 * Menangani:
 * - Base URL configuration dari environment variables
 * - Automatic token injection untuk setiap request
 * - Global error handling (401, 403, 500)
 * - Request/Response interceptors
 * 
 * @module services/api
 */

import axios from 'axios';

// Base URL dari environment variable (.env file)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

/**
 * Axios Instance
 * 
 * Instance axios yang sudah dikonfigurasi dengan:
 * - baseURL: API endpoint backend
 * - headers: Content-Type dan Accept JSON
 * - withCredentials: true (untuk Laravel Sanctum cookies)
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // ⚠️ PENTING: Untuk mengirim cookies (Sanctum CSRF)
});

/**
 * Request Interceptor
 * 
 * Intercept setiap request keluar dan tambahkan Bearer token dari localStorage
 * jika user sudah login. Token akan otomatis di-attach ke Authorization header.
 * 
 * Flow:
 * 1. Ambil token dari localStorage
 * 2. Jika ada token, tambahkan ke header Authorization
 * 3. Return modified config
 */
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

/**
 * Response Interceptor
 * 
 * Intercept setiap response dan handle error secara global.
 * Menangani berbagai HTTP status code:
 * 
 * - 401 Unauthorized: Token invalid/expired, clear localStorage & redirect ke login
 * - 403 Forbidden: User tidak punya akses ke resource
 * - 500 Internal Server Error: Server error, log untuk debugging
 * 
 * Dengan interceptor ini, error handling menjadi konsisten di seluruh aplikasi
 * tanpa perlu handle manual di setiap service call.
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token invalid/expired
        if (error.response && error.response.status === 401) {
            // Clear auth data dari localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            // Redirect ke halaman login (optional, uncomment jika diperlukan)
            // window.location.href = '/login';
        }

        // Handle 403 Forbidden - User tidak punya akses
        if (error.response && error.response.status === 403) {
            console.error('Access forbidden: Anda tidak memiliki akses ke resource ini');
        }

        // Handle 500 Internal Server Error - Server error
        if (error.response && error.response.status === 500) {
            console.error('Server error: Terjadi kesalahan pada server');
        }

        return Promise.reject(error);
    }
);

/**
 * Export axios instance dan BASE_URL
 * 
 * - api: Axios instance yang sudah dikonfigurasi dengan interceptors
 * - BASE_URL: Base URL backend tanpa /api (untuk asset URLs)
 */
export default api;
export { BASE_URL };
