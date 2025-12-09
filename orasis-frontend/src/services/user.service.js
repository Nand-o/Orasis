/**
 * User Service
 *
 * Service untuk operasi terkait user (profile, password, dashboard stats, dll).
 * Digunakan oleh berbagai komponen dan context untuk fetch/update data user.
 *
 * Fitur utama:
 * - Mendapatkan profile user saat ini
 * - Update profile (dengan dan tanpa file upload)
 * - Ganti password
 * - Hapus akun
 * - Mendapatkan daftar showcase milik user
 *
 * Semua fungsi mengembalikan `response.data` dari endpoint terkait.
 */
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
   * Update user profile with file upload (uses POST with _method spoofing)
   */
  updateProfileWithFile: async (formData) => {
    const response = await api.post('/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
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

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    const response = await api.delete('/user');
    return response.data;
  },
};

export default userService;
