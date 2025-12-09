/**
 * @fileoverview Service untuk handle API calls terkait showcase
 * @module services/showcase.service
 * 
 * Service ini menyediakan functions untuk:
 * - Get all showcases (public) dengan filtering & sorting
 * - Get showcase by ID dengan similar items
 * - Create showcase (auth required) dengan upload progress
 * - Update showcase (auth required)
 * - Delete showcase (auth required)
 * - Admin functions (status update, getAll tanpa pagination)
 * - Track view showcase
 * - Get trending & popular showcases
 * 
 * Fitur khusus:
 * - Support upload progress callback untuk file upload
 * - Support FormData untuk multipart/form-data
 * - Support Laravel PUT method override untuk update dengan file
 * 
 * @requires services/api - Axios instance yang sudah dikonfigurasi
 */
import api from './api';

/**
 * Object yang berisi semua showcase-related functions
 * @namespace showcaseService
 */
const showcaseService = {
    /**
     * Get all showcases (public, tidak perlu auth)
     * 
     * @async
     * @function getAll
     * @memberof showcaseService
     * @param {Object} params - Query parameters untuk filtering & sorting
     * @param {number} [params.page=1] - Halaman pagination
     * @param {number} [params.per_page=12] - Jumlah item per page
     * @param {string} [params.sort='latest'] - Sort by: 'latest', 'popular', 'trending'
     * @param {string} [params.category] - Filter by category slug
     * @param {string} [params.search] - Search by title atau description
     * 
     * @returns {Promise<Object>} Response berisi:
     *   - data: Array showcase objects
     *   - current_page: Halaman saat ini
     *   - last_page: Total halaman
     *   - total: Total showcases
     * 
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/showcases
     * Access: Public (tidak perlu login)
     * 
     * Query params akan dikirim sebagai URL query string.
     * Backend akan handle filtering, sorting, dan pagination.
     * 
     * Hanya showcases dengan status 'approved' yang ditampilkan.
     */
    // ===== GET ALL SHOWCASES (Public) =====
    async getAll(params = {}) {
        try {
            const response = await api.get('/showcases', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get showcase detail by ID
     * 
     * @async
     * @function getById
     * @memberof showcaseService
     * @param {number|string} id - ID showcase
     * 
     * @returns {Promise<Object>} Response berisi:
     *   - showcase: Object showcase detail lengkap
     *   - similar_showcases: Array showcases serupa (same category)
     * 
     * @throws {Object} Error dari API (404 jika tidak ditemukan)
     * 
     * @description
     * Endpoint: GET /api/showcases/:id
     * Access: Public (tidak perlu login)
     * 
     * Menampilkan:
     * - Detail showcase lengkap (title, description, images, tags, dll)
     * - User yang membuat showcase
     * - Tags yang terkait
     * - Similar showcases (max 4 items dengan category sama)
     * 
     * View count akan di-track terpisah via trackView()
     */
    // ===== GET SHOWCASE BY ID =====
    async getById(id) {
        try {
            const response = await api.get(`/showcases/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Create showcase baru
     * 
     * @async
     * @function create
     * @memberof showcaseService
     * @param {FormData|Object} showcaseData - Data showcase
     * @param {Function} [onUploadProgress] - Callback untuk tracking upload progress
     * 
     * @returns {Promise<Object>} Response berisi { message, showcase }
     * @throws {Object} Error dari API berisi validation errors
     * 
     * @description
     * Endpoint: POST /api/showcases
     * Access: Authenticated users only
     * 
     * Required fields:
     * - title: string, max 255 karakter
     * - description: string
     * - category_id: integer, exists in categories table
     * - type: 'website' atau 'mobile'
     * - images[]: array of files (max 5 images, each max 5MB)
     * - url: string, valid URL (optional)
     * - tags: array of tag names (optional)
     * 
     * Upload Progress:
     * Jika onUploadProgress disediakan, function akan call callback
     * dengan parameter percentCompleted (0-100) saat upload berlangsung.
     * 
     * @example
     * const formData = new FormData();
     * formData.append('title', 'My Showcase');
     * formData.append('images[]', file1);
     * 
     * await showcaseService.create(formData, (percent) => {
     *   console.log(`Upload: ${percent}%`);
     * });
     */
    // ===== CREATE SHOWCASE (Auth Required) =====
    async create(showcaseData, onUploadProgress = null) {
        try {
            const config = {};
            // If FormData, set appropriate headers
            if (showcaseData instanceof FormData) {
                config.headers = {
                    'Content-Type': 'multipart/form-data',
                };
            }
            // Add upload progress callback if provided
            if (onUploadProgress) {
                config.onUploadProgress = (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onUploadProgress(percentCompleted);
                };
            }
            const response = await api.post('/showcases', showcaseData, config);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Update showcase
     * 
     * @async
     * @function update
     * @memberof showcaseService
     * @param {number|string} id - ID showcase yang akan diupdate
     * @param {FormData|Object} showcaseData - Data showcase baru
     * @param {Function} [onUploadProgress] - Callback untuk tracking upload progress
     * 
     * @returns {Promise<Object>} Response berisi { message, showcase }
     * @throws {Object} Error dari API berisi validation errors atau 403 jika bukan owner
     * 
     * @description
     * Endpoint: PUT /api/showcases/:id (atau POST dengan _method=PUT)
     * Access: Owner showcase atau Admin
     * 
     * Jika data berupa FormData (ada upload file):
     * - Menggunakan POST dengan _method=PUT (Laravel method override)
     * - Header Content-Type: multipart/form-data
     * - Support upload progress callback
     * 
     * Jika data berupa Object biasa (no file upload):
     * - Menggunakan PUT standard
     * - Header Content-Type: application/json
     * 
     * User hanya bisa update showcase miliknya sendiri,
     * kecuali user adalah admin.
     * 
     * Validation sama seperti create, tapi semua fields optional.
     */
    // ===== UPDATE SHOWCASE (Auth Required) =====
    async update(id, showcaseData, onUploadProgress = null) {
        try {
            const config = {};
            // If FormData, set appropriate headers and use POST with _method
            if (showcaseData instanceof FormData) {
                showcaseData.append('_method', 'PUT');
                config.headers = {
                    'Content-Type': 'multipart/form-data',
                };
                // Add upload progress callback if provided
                if (onUploadProgress) {
                    config.onUploadProgress = (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onUploadProgress(percentCompleted);
                    };
                }
                const response = await api.post(`/showcases/${id}`, showcaseData, config);
                return response.data;
            } else {
                const response = await api.put(`/showcases/${id}`, showcaseData);
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Delete showcase
     * 
     * @async
     * @function delete
     * @memberof showcaseService
     * @param {number|string} id - ID showcase yang akan dihapus
     * 
     * @returns {Promise<Object>} Response berisi { message }
     * @throws {Object} Error dari API (403 jika bukan owner, 404 jika tidak ada)
     * 
     * @description
     * Endpoint: DELETE /api/showcases/:id
     * Access: Owner showcase atau Admin
     * 
     * Saat showcase dihapus:
     * - Record di database di-delete (soft delete atau hard delete tergantung config)
     * - Images di storage akan dihapus
     * - Relasi dengan tags dan collections akan di-clear
     */
    // ===== DELETE SHOWCASE (Auth Required) =====
    async delete(id) {
        try {
            const response = await api.delete(`/showcases/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Filter showcases by category
     * 
     * @async
     * @function getByCategory
     * @memberof showcaseService
     * @param {string} category - Category slug
     * 
     * @returns {Promise<Object>} Response pagination berisi data showcases
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/showcases?category={slug}
     * Access: Public
     * 
     * Wrapper untuk getAll() dengan category filter.
     * Category menggunakan slug (e.g., 'ui-ux-design', 'web-development')
     */
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

    /**
     * Get all showcases untuk admin dashboard (no pagination)
     * 
     * @async
     * @function getAllForAdmin
     * @memberof showcaseService
     * @returns {Promise<Object>} Response berisi { showcases: [...] }
     * @throws {Object} Error dari API (403 jika bukan admin)
     * 
     * @description
     * Endpoint: GET /api/admin/showcases
     * Access: Admin only
     * 
     * Menampilkan SEMUA showcases tanpa pagination:
     * - Approved showcases
     * - Pending showcases (butuh review)
     * - Rejected showcases
     * 
     * Digunakan untuk admin dashboard overview.
     */
    // ===== GET ALL FOR ADMIN (No pagination) =====
    async getAllForAdmin() {
        try {
            const response = await api.get('/admin/showcases');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Update status showcase (approve/reject)
     * 
     * @async
     * @function updateStatus
     * @memberof showcaseService
     * @param {number|string} id - ID showcase
     * @param {string} status - Status baru: 'approved' atau 'rejected'
     * 
     * @returns {Promise<Object>} Response berisi { message, showcase }
     * @throws {Object} Error dari API (403 jika bukan admin)
     * 
     * @description
     * Endpoint: PATCH /api/admin/showcases/:id/status
     * Access: Admin only
     * 
     * Function untuk approve/reject showcase yang pending.
     * Setelah status berubah:
     * - 'approved': Showcase tampil di public showcase list
     * - 'rejected': Showcase tidak tampil, user bisa edit & resubmit
     */
    // ===== UPDATE STATUS (Admin Only) =====
    async updateStatus(id, status) {
        try {
            const response = await api.patch(`/admin/showcases/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get trending showcases
     * 
     * @async
     * @function getTrending
     * @memberof showcaseService
     * @returns {Promise<Object>} Response berisi { showcases: [...] }
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/showcases/trending
     * Access: Public
     * 
     * Menampilkan showcases yang sedang trending berdasarkan:
     * - View count dalam 7 hari terakhir
     * - Like/save count (jika ada feature)
     * 
     * Digunakan di landing page atau home untuk highlight
     * showcases yang sedang populer.
     */
    // ===== GET TRENDING SHOWCASES =====
    async getTrending() {
        try {
            const response = await api.get('/showcases/trending');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Get popular showcases (most viewed all time)
     * 
     * @async
     * @function getPopular
     * @memberof showcaseService
     * @returns {Promise<Object>} Response berisi { showcases: [...] }
     * @throws {Object} Error dari API
     * 
     * @description
     * Endpoint: GET /api/showcases/popular
     * Access: Public
     * 
     * Menampilkan showcases paling populer sepanjang masa
     * berdasarkan total view count.
     * 
     * Berbeda dengan trending yang time-based (7 hari),
     * popular melihat all time views.
     */
    // ===== GET POPULAR SHOWCASES =====
    async getPopular() {
        try {
            const response = await api.get('/showcases/popular');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Track view showcase (increment view count)
     * 
     * @async
     * @function trackView
     * @memberof showcaseService
     * @param {number|string} id - ID showcase
     * 
     * @returns {Promise<Object|null>} Response berisi { message } atau null jika gagal
     * 
     * @description
     * Endpoint: POST /api/showcases/:id/track-view
     * Access: Public (tidak perlu auth)
     * 
     * Endpoint terpisah dari getById untuk cache compatibility.
     * Saat user buka detail showcase, trackView() dipanggil
     * untuk increment view_count di database.
     * 
     * Silently fail: Jika tracking gagal (network error, dll),
     * return null dan tidak mengganggu user experience.
     * View tracking bersifat optional, bukan critical feature.
     */
    // ===== TRACK VIEW (Separate endpoint for cache compatibility) =====
    async trackView(id) {
        try {
            const response = await api.post(`/showcases/${id}/track-view`);
            return response.data;
        } catch (error) {
            // Silently fail - view tracking shouldn't break user experience
            console.warn('Failed to track view:', error);
            return null;
        }
    },
};

export default showcaseService;
