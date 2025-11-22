import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://orasis-backend.test/api';

// Helper: Get auth token from localStorage
const getAuthToken = () => {
  // Token stored separately in localStorage as 'auth_token'
  return localStorage.getItem('auth_token');
};

// Helper: Get authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn('⚠️ No auth token found in localStorage');
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Collection Service
 * Handles all collection-related API calls
 */
const collectionService = {
  /**
   * Get all collections for current user
   * GET /api/collections
   */
  getAll: async () => {
    try {
      const headers = getAuthHeaders();
      console.log('📦 Fetching collections with headers:', headers);
      const response = await axios.get(`${API_URL}/collections`, {
        headers
      });
      console.log('✅ Collections fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching collections:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get collection by ID with showcases
   * GET /api/collections/:id
   */
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/collections/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching collection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new collection
   * POST /api/collections
   * @param {Object} collectionData - { name: string, description?: string }
   */
  create: async (collectionData) => {
    try {
      const response = await axios.post(
        `${API_URL}/collections`,
        collectionData,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  /**
   * Update collection (rename)
   * PUT /api/collections/:id
   * @param {number} id - Collection ID
   * @param {Object} collectionData - { name: string, description?: string }
   */
  update: async (id, collectionData) => {
    try {
      const response = await axios.put(
        `${API_URL}/collections/${id}`,
        collectionData,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating collection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete collection
   * DELETE /api/collections/:id
   */
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/collections/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting collection ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add showcase to collection (bookmark)
   * POST /api/collections/:id/showcases
   * @param {number} collectionId - Collection ID
   * @param {number} showcaseId - Showcase ID to add
   */
  addShowcase: async (collectionId, showcaseId) => {
    try {
      const response = await axios.post(
        `${API_URL}/collections/${collectionId}/showcases`,
        { showcase_id: showcaseId },
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding showcase ${showcaseId} to collection ${collectionId}:`, error);
      throw error;
    }
  },

  /**
   * Remove showcase from collection
   * DELETE /api/collections/:collectionId/showcases/:showcaseId
   */
  removeShowcase: async (collectionId, showcaseId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/collections/${collectionId}/showcases/${showcaseId}`,
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing showcase ${showcaseId} from collection ${collectionId}:`, error);
      throw error;
    }
  }
};

export default collectionService;
