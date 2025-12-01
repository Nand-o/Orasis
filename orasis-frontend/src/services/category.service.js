import api from './api';

const categoryService = {
    // Get all categories
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // Create a new category (admin only)
    create: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    // Update a category (admin only)
    update: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    // Delete a category (admin only)
    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

export default categoryService;
