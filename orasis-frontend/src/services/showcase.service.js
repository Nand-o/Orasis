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
