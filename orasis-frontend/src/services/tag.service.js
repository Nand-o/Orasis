/**
 * Tag Service
 *
 * Service sederhana untuk mengelola tags di sistem.
 * Digunakan di halaman admin untuk CRUD tag dan di form pembuatan
 * showcase untuk menampilkan daftar tag yang tersedia.
 *
 * Endpoints:
 * - GET /api/tags
 * - POST /api/tags (admin)
 * - PUT /api/tags/:id (admin)
 * - DELETE /api/tags/:id (admin)
 */
import api from './api';

const tagService = {
    // Get all tags
    getAll: async () => {
        const response = await api.get('/tags');
        return response.data;
    },

    // Create new tag (admin only)
    create: async (tagData) => {
        const response = await api.post('/tags', tagData);
        return response.data;
    },

    // Update tag (admin only)
    update: async (id, tagData) => {
        try {
            const response = await api.put(`/tags/${id}`, tagData);
            return response.data;
        } catch (error) {
            console.error('Tag update error:', error.response?.data || error.message);
            throw error;
        }
    },

    // Delete tag (admin only)
    delete: async (id) => {
        try {
            const response = await api.delete(`/tags/${id}`);
            return response.data;
        } catch (error) {
            console.error('Tag delete error:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default tagService;
