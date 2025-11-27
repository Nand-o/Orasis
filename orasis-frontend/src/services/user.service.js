import api from './api';

const userService = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  /**
   * Update user profile (name, email)
   */
  updateProfile: async (userData) => {
    const response = await api.put('/user', userData);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (passwordData) => {
    try {
      // Use new endpoint to bypass any caching
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's own showcases
   */
  getMyShowcases: async (params = {}) => {
    const response = await api.get('/user/showcases', { params });
    return response.data;
  },

  /**
   * Get user dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },

  /**
   * Delete a showcase
   */
  deleteShowcase: async (showcaseId) => {
    const response = await api.delete(`/showcases/${showcaseId}`);
    return response.data;
  },
};

export default userService;
