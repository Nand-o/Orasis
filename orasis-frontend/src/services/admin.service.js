import api from './api';

const adminService = {
    // Get all showcases for admin
    getAllShowcases: async () => {
        const response = await api.get('/admin/showcases');
        return response.data;
    },

    // Get pending showcases only
    getPendingShowcases: async () => {
        const response = await api.get('/admin/showcases/pending');
        return response.data;
    },

    // Update showcase status (approve/reject)
    updateShowcaseStatus: async (id, status) => {
        const response = await api.patch(`/admin/showcases/${id}/status`, { status });
        return response.data;
    },

    // Bulk update showcase status
    bulkUpdateStatus: async (showcaseIds, status) => {
        const response = await api.post('/admin/showcases/bulk-status', {
            showcase_ids: showcaseIds,
            status
        });
        return response.data;
    },

    // Get admin statistics
    getAdminStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Get detailed analytics
    getAnalytics: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    },

    // User Management
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default adminService;
