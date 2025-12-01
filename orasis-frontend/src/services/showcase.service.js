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

    // ===== GET ALL FOR ADMIN (No pagination) =====
    async getAllForAdmin() {
        try {
            const response = await api.get('/admin/showcases');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== UPDATE STATUS (Admin Only) =====
    async updateStatus(id, status) {
        try {
            const response = await api.patch(`/admin/showcases/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== GET TRENDING SHOWCASES =====
    async getTrending() {
        try {
            const response = await api.get('/showcases/trending');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== GET POPULAR SHOWCASES =====
    async getPopular() {
        try {
            const response = await api.get('/showcases/popular');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

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
