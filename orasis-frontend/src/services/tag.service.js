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
        const response = await api.put(`/tags/${id}`, tagData);
        return response.data;
    },

    // Delete tag (admin only)
    delete: async (id) => {
        const response = await api.delete(`/tags/${id}`);
        return response.data;
    }
};

export default tagService;
