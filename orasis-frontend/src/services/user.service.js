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
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  /**
   * Get user's own showcases
   */
  getMyShowcases: async (params = {}) => {
    const response = await api.get('/user/showcases', { params });
    return response.data;
  },
};

export default userService;
