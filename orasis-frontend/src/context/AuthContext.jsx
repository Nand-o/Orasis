/**
 * @fileoverview Context untuk mengelola state autentikasi aplikasi
 * @module context/AuthContext
 * 
 * Context ini menyediakan:
 * - State user (data user yang sedang login)
 * - State isAuthenticated (status login)
 * - Functions: register, login, logout, updateUser, checkAuth
 * - Loading state untuk initial auth check
 * 
 * Menggunakan localStorage untuk persistensi token dan data user
 * @requires services/auth.service
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

/**
 * Context object untuk autentikasi
 * @type {React.Context}
 */
const AuthContext = createContext(undefined);

/**
 * Provider component untuk AuthContext
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components yang akan dibungkus provider
 * 
 * @description
 * Provider ini mengelola state autentikasi global aplikasi:
 * - user: Object data user yang sedang login (null jika belum login)
 * - loading: Boolean untuk loading initial auth check
 * - isAuthenticated: Boolean status login (true jika sudah login)
 * 
 * Saat pertama kali mount, provider akan mengecek localStorage untuk
 * melihat apakah ada token dan user data tersimpan. Jika ada, akan
 * otomatis set state isAuthenticated = true.
 * 
 * Selama loading = true, akan menampilkan loading spinner
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    /**
     * Mengecek status autentikasi dari localStorage
     * 
     * Function ini mengambil token dan user data dari localStorage.
     * Jika keduanya ada, maka set isAuthenticated = true dan state user.
     * Jika tidak, maka set isAuthenticated = false.
     * 
     * Function ini dipanggil saat:
     * - Component pertama kali mount (useEffect)
     * - Manual refresh auth state (misal setelah update profile)
     */
    const checkAuth = () => {
        try {
            const currentUser = authService.getCurrentUser();
            const token = authService.getToken();
            
            if (currentUser && token) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register user baru
     * 
     * @param {Object} userData - Data registrasi user
     * @param {string} userData.name - Nama lengkap user
     * @param {string} userData.email - Email user
     * @param {string} userData.username - Username unique
     * @param {string} userData.password - Password (min 8 karakter)
     * @param {string} userData.password_confirmation - Konfirmasi password
     * 
     * @returns {Promise<Object>} Response dari API (message, user data)
     * @throws {Error} Error dari API jika registrasi gagal
     * 
     * @description
     * PENTING: Registrasi TIDAK otomatis login user.
     * Setelah registrasi sukses, user harus login manual.
     * Ini untuk keamanan dan user awareness.
     */
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            // Do NOT set user or isAuthenticated
            // User must login after registration
            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Login user
     * 
     * @param {Object} credentials - Kredensial login
     * @param {string} credentials.email - Email atau username
     * @param {string} credentials.password - Password user
     * 
     * @returns {Promise<Object>} Response dari API { user, access_token }
     * @throws {Error} Error dari API jika login gagal
     * 
     * @description
     * Setelah login sukses:
     * 1. Token disimpan ke localStorage (key: 'auth_token')
     * 2. User data disimpan ke localStorage (key: 'user')
     * 3. State user di-set dengan data user dari response
     * 4. State isAuthenticated di-set true
     */
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Logout user
     * 
     * @returns {Promise<void>}
     * 
     * @description
     * Proses logout:
     * 1. Kirim request ke API /logout untuk invalidate token di server
     * 2. Hapus token dari localStorage
     * 3. Hapus user data dari localStorage
     * 4. Set state user = null
     * 5. Set state isAuthenticated = false
     * 
     * Menggunakan finally block untuk memastikan localStorage
     * tetap dibersihkan meskipun API call gagal.
     */
    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    /**
     * Update data user (misal setelah edit profile)
     * 
     * @param {Object} updatedUser - Data user yang sudah diupdate
     * 
     * @description
     * Function ini untuk sync state user dengan data terbaru.
     * Biasanya dipanggil setelah user edit profile.
     * Data akan di-update di:
     * 1. State user (Context)
     * 2. localStorage (untuk persistensi)
     */
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateUser,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-white dark:bg-main-black">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-violet-600 dark:border-t-yellow-300 rounded-full animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook untuk mengakses AuthContext
 * 
 * @returns {Object} Context value berisi:
 *   @property {Object|null} user - Data user yang sedang login
 *   @property {boolean} isAuthenticated - Status login
 *   @property {boolean} loading - Status loading initial auth check
 *   @property {Function} register - Function untuk register
 *   @property {Function} login - Function untuk login
 *   @property {Function} logout - Function untuk logout
 *   @property {Function} updateUser - Function untuk update user data
 *   @property {Function} checkAuth - Function untuk recheck auth status
 * 
 * @throws {Error} Jika digunakan di luar AuthProvider
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   console.log('User logged in:', user.name);
 * }
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
