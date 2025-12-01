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
            // Uncomment jika sudah ada halaman login
            // window.location.href = '/login';
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
