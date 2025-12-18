/**
 * @fileoverview Service untuk handle API calls terkait collection
 * @module services/collection.service
 * 
 * Service ini menyediakan functions untuk:
 * - Get all collections (user's collections)
 * - Get collection by ID dengan showcases
 * - Create collection baru
 * - Update collection (rename)
 * - Delete collection
 * - Add showcase ke collection (bookmark)
 * - Remove showcase dari collection
 * 
 * PENTING: Service ini menggunakan axios langsung, bukan api.js instance.
 * Token di-inject manual via getAuthHeaders() helper.
 * 
 * @requires axios
 */
import axios from 'axios';

/**
 * Base URL untuk API
 * Menggunakan environment variable VITE_API_URL
 * @constant {string}
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://orasis-backend.test/api';

/**
 * Helper function untuk get auth token dari localStorage
 * @returns {string|null} Bearer token atau null
 */
const getAuthToken = () => {
  // Token stored separately in localStorage as 'auth_token'
  return localStorage.getItem('auth_token');
};

/**
 * Helper function untuk get authorization headers
 * @returns {Object} Object berisi Authorization header atau empty object
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Object yang berisi semua collection-related functions
 * @namespace collectionService
 * 
 * @description
 * Collection adalah fitur bookmark/save showcase.
 * User bisa create multiple collections (misal: "UI Inspiration", "Mobile Apps", dll)
 * dan add showcases ke dalamnya.
 */
const collectionService = {
  /**
   * Get all collections milik current user
   * 
   * @async
   * @function getAll
   * @memberof collectionService
   * @returns {Promise<Object>} Response berisi { collections: [...] }
   * @throws {Object} Error dari API (401 jika tidak login)
   * 
   * @description
   * Endpoint: GET /api/collections
   * Access: Authenticated users only
   * 
   * Menampilkan semua collections yang dibuat oleh user.
   * Setiap collection berisi:
   * - id, name, description
   * - showcases_count (jumlah showcase dalam collection)
   * - created_at, updated_at
   */
  getAll: async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_URL}/collections`, {
        headers
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching collections:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get collection detail by ID dengan list showcases
   * 
   * @async
   * @function getById
   * @memberof collectionService
   * @param {number|string} id - ID collection
   * 
   * @returns {Promise<Object>} Response berisi:
   *   - collection: Object collection detail
   *   - showcases: Array showcases dalam collection
   * 
   * @throws {Object} Error dari API (403 jika bukan owner, 404 jika tidak ada)
   * 
   * @description
   * Endpoint: GET /api/collections/:id
   * Access: Owner collection
   * 
   * User hanya bisa get collection miliknya sendiri.
   * Response berisi detail collection + semua showcases yang di-bookmark.
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
   * 
   * @async
   * @function delete
   * @memberof collectionService
   * @param {number|string} id - ID collection yang akan dihapus
   * 
   * @returns {Promise<Object>} Response berisi { message }
   * @throws {Object} Error dari API (403 jika bukan owner, 404 jika tidak ada)
   * 
   * @description
   * Endpoint: DELETE /api/collections/:id
   * Access: Owner collection
   * 
   * Saat collection dihapus:
   * - Record collection di database dihapus
   * - Relasi dengan showcases di pivot table dihapus
   * - Showcases yang ada di collection TIDAK ikut terhapus
   *   (hanya relasi bookmark-nya yang hilang)
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
   * Add showcase ke collection (bookmark)
   * 
   * @async
   * @function addShowcase
   * @memberof collectionService
   * @param {number|string} collectionId - ID collection
   * @param {number|string} showcaseId - ID showcase yang akan di-bookmark
   * 
   * @returns {Promise<Object>} Response berisi { message }
   * @throws {Object} Error dari API:
   *   - 403 jika bukan owner collection
   *   - 404 jika collection/showcase tidak ada
   *   - 400 jika showcase sudah ada di collection
   * 
   * @description
   * Endpoint: POST /api/collections/:id/showcases
   * Access: Owner collection
   * 
   * Function untuk bookmark showcase ke collection.
   * User bisa add showcase yang sama ke multiple collections.
   * 
   * Use case:
   * - User lihat showcase di explore page
   * - Click bookmark icon
   * - Pilih collection atau create new
   * - Showcase masuk ke collection
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
   * Remove showcase dari collection (unbookmark)
   * 
   * @async
   * @function removeShowcase
   * @memberof collectionService
   * @param {number|string} collectionId - ID collection
   * @param {number|string} showcaseId - ID showcase yang akan di-remove
   * 
   * @returns {Promise<Object>} Response berisi { message }
   * @throws {Object} Error dari API (403 jika bukan owner, 404 jika tidak ada)
   * 
   * @description
   * Endpoint: DELETE /api/collections/:collectionId/showcases/:showcaseId
   * Access: Owner collection
   * 
   * Function untuk unbookmark showcase dari collection.
   * Hanya relasi di pivot table yang dihapus,
   * showcase asli tidak terpengaruh.
   * 
   * Use case:
   * - User buka collection page
   * - Click remove icon pada showcase
   * - Showcase hilang dari collection (tapi masih ada di database)
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
