/**
 * @fileoverview Service untuk handle API calls terkait autentikasi
 * @module services/auth.service
 * 
 * Service ini menyediakan functions untuk:
 * - Register user baru
 * - Login user
 * - Logout user
 * - Get current user dari localStorage
 * - Get token dari localStorage
 * - Get profile user dari API
 * 
 * Semua token dan user data disimpan di localStorage dengan keys:
 * - 'auth_token': Bearer token untuk autentikasi
 * - 'user': JSON string data user
 * 
 * @requires services/api - Axios instance yang sudah dikonfigurasi
 */
import api from './api';

/**
 * Object yang berisi semua authentication-related functions
 * @namespace authService
 */
const authService = {
    /**
     * Register user baru ke sistem
     * 
     * @async
     * @function register
     * @memberof authService
     * @param {Object} userData - Data registrasi user
     * @param {string} userData.name - Nama lengkap user
     * @param {string} userData.email - Email valid dan unique
     * @param {string} userData.username - Username unique
     * @param {string} userData.password - Password minimum 8 karakter
     * @param {string} userData.password_confirmation - Konfirmasi password (harus sama)
     * 
     * @returns {Promise<Object>} Response berisi { message, user }
     * @throws {Object} Error dari API berisi validation errors atau error message
     * 
     * @description
     * Endpoint: POST /api/register
     * 
     * PENTING: Function ini TIDAK otomatis login user setelah registrasi.
     * User harus login manual untuk keamanan dan user awareness.
     * 
     * Validation rules:
     * - name: required, max 255 karakter
     * - email: required, valid email, unique
     * - username: required, unique, min 3 karakter
     * - password: required, min 8 karakter, konfirmasi harus match
     */
    // ===== REGISTER =====
    async register(userData) {
        try {
            const response = await api.post('/register', userData);
            
            // Registration does NOT auto-login
            // User must login manually after successful registration
            // This is better for security and user awareness
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Login user ke sistem
     * 
     * @async
     * @function login
     * @memberof authService
     * @param {Object} credentials - Kredensial login
     * @param {string} credentials.email - Email atau username
     * @param {string} credentials.password - Password user
     * 
     * @returns {Promise<Object>} Response berisi { user, access_token }
     * @throws {Object} Error dari API berisi error message
     * 
     * @description
     * Endpoint: POST /api/login
     * 
     * Setelah login berhasil:
     * 1. Token disimpan ke localStorage dengan key 'auth_token'
     * 2. User data disimpan ke localStorage dengan key 'user' (JSON string)
     * 3. Return response data { user, access_token }
     * 
     * Token format: Bearer token yang akan digunakan di header
     * Authorization untuk semua request yang memerlukan autentikasi.
     * 
     * Token akan otomatis di-inject ke request header oleh
     * interceptor di api.js
     */
    // ===== LOGIN =====
    async login(credentials) {
        try {
            const response = await api.post('/login', credentials);
            
            // Save token and user data to localStorage
            const token = response.data.access_token || response.data.token;
            
            if (token) {
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('Error details:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    /**
     * Logout user dari sistem
     * 
     * @async
     * @function logout
     * @memberof authService
     * @returns {Promise<void>}
     * 
     * @description
     * Endpoint: POST /api/logout
     * 
     * Proses logout:
     * 1. Kirim request ke backend untuk invalidate token di server
     *    (token akan dihapus dari database personal_access_tokens)
     * 2. Hapus 'auth_token' dari localStorage
     * 3. Hapus 'user' dari localStorage
     * 
     * Menggunakan finally block untuk memastikan localStorage
     * tetap dibersihkan meskipun API call gagal (misal: network error).
     * 
     * Setelah logout, user harus login kembali untuk mengakses
     * protected routes.
     */
    // ===== LOGOUT =====
    async logout() {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local cleanup even if API call fails
        } finally {
            // Always clear local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user data dari localStorage
     * 
     * @function getCurrentUser
     * @memberof authService
     * @returns {Object|null} User object atau null jika belum login
     * 
     * @description
     * Mengambil user data dari localStorage key 'user'.
     * Data disimpan dalam format JSON string, function ini
     * akan parse ke object.
     * 
     * Return null jika:
     * - Key 'user' tidak ada di localStorage
     * - JSON parsing gagal (data corrupt)
     */
    // ===== GET CURRENT USER =====
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * Get auth token dari localStorage
     * 
     * @function getToken
     * @memberof authService
     * @returns {string|null} Bearer token atau null jika belum login
     * 
     * @description
     * Mengambil token dari localStorage key 'auth_token'.
     * Token ini digunakan untuk autentikasi di API.
     */
    // ===== GET TOKEN =====
    getToken() {
        return localStorage.getItem('auth_token');
    },

    /**
     * Check apakah user sudah authenticated
     * 
     * @function isAuthenticated
     * @memberof authService
     * @returns {boolean} true jika token ada, false jika tidak
     * 
     * @description
     * Simple check berdasarkan ada/tidaknya token.
     * Menggunakan !! untuk convert ke boolean.
     */
    // ===== CHECK IF AUTHENTICATED =====
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Get user profile dari API (fresh data)
     * 
     * @async
     * @function getProfile
     * @memberof authService
     * @returns {Promise<Object>} Response berisi { user }
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/user/profile
     * Requires: Authentication (Bearer token)
     * 
     * Function ini fetch data user terbaru dari backend.
     * Berguna untuk:
     * - Refresh user data setelah edit profile
     * - Sync data jika ada perubahan di backend
     * 
     * Setelah fetch, data user akan di-update ke localStorage
     * untuk persistensi.
     */
    // ===== GET USER PROFILE =====
    async getProfile() {
        try {
            const response = await api.get('/user/profile');
            
            // Update local storage with fresh data
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get current user dari API
     * 
     * @async
     * @function getCurrentUserFromAPI
     * @memberof authService
     * @returns {Promise<Object>} Response berisi { data }
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/user
     * Requires: Authentication (Bearer token)
     * 
     * Alternative endpoint untuk get current user.
     * Digunakan di beberapa component yang butuh fresh data.
     */
    // ===== GET CURRENT USER FROM API =====
    async getCurrentUserFromAPI() {
        try {
            const response = await api.get('/user');
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService;
