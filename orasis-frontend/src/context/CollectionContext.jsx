/**
 * CollectionContext
 *
 * Context untuk mengelola collections milik user (CRUD + optimistic updates).
 * Fitur:
 * - Fetch collections saat user login
 * - Create / Update / Delete collection
 * - Add / Remove showcase ke collection dengan optimistic UI
 * - Menyimpan state loading dan error untuk UI
 *
 * Provider ini menggunakan `collectionService` untuk komunikasi API.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import collectionService from '../services/collection.service';
import { useAuth } from './AuthContext';

const CollectionContext = createContext();

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};

export const CollectionProvider = ({ children }) => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all collections for current user
   */
  const fetchCollections = async () => {
    if (!user) {
      setCollections([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.getAll();
      setCollections(response.data || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      if (err.response?.status === 401) {
        setCollections([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch collections');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new collection
   */
  const createCollection = async (collectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.create(collectionData);
      setCollections(prev => [response.data, ...prev]);
      return response;
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(err.response?.data?.message || 'Failed to create collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update collection (rename) - preserve existing showcases data
   */
  const updateCollection = async (id, collectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.update(id, collectionData);
      // Merge response with existing collection data to preserve showcases
      setCollections(prev =>
        prev.map(col => {
          if (col.id === id) {
            return {
              ...col,
              ...response.data,
              showcases: col.showcases, // Preserve showcases array
              showcases_count: col.showcases_count // Preserve count
            };
          }
          return col;
        })
      );
      return response;
    } catch (err) {
      console.error('Error updating collection:', err);
      setError(err.response?.data?.message || 'Failed to update collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete collection
   */
  const deleteCollection = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await collectionService.delete(id);
      setCollections(prev => prev.filter(col => col.id !== id));
    } catch (err) {
      console.error('Error deleting collection:', err);
      setError(err.response?.data?.message || 'Failed to delete collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get collection by ID
   */
  const getCollectionById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.getById(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching collection:', err);
      setError(err.response?.data?.message || 'Failed to fetch collection');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add showcase to collection with optimistic update
   */
  const addShowcaseToCollection = async (collectionId, showcaseId) => {
    // Check if already exists to prevent duplicate adds
    const collection = collections.find(c => c.id === collectionId);
    const alreadyExists = collection?.showcases?.some(s => Number(s.id) === Number(showcaseId));
    
    if (alreadyExists) {
      return;
    }

    // Optimistic update - update UI immediately
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          showcases: [...(col.showcases || []), { id: showcaseId }],
          showcases_count: (col.showcases_count || 0) + 1
        };
      }
      return col;
    }));

    setError(null);
    try {
      await collectionService.addShowcase(collectionId, showcaseId);
      // Don't fetch immediately - let UI stay optimistic
      // Fetch will happen on next page load or manual refresh
      return { success: true };
    } catch (err) {
      console.error('Error adding showcase to collection:', err);
      setError(err.response?.data?.message || 'Failed to add showcase');
      // Revert optimistic update on error
      await fetchCollections();
      throw err;
    }
  };

  /**
   * Remove showcase from collection with optimistic update
   */
  const removeShowcaseFromCollection = async (collectionId, showcaseId) => {
    // Check if exists before removing
    const collection = collections.find(c => c.id === collectionId);
    const exists = collection?.showcases?.some(s => Number(s.id) === Number(showcaseId));
    
    if (!exists) {
      return;
    }

    // Optimistic update - update UI immediately
    setCollections(prev => prev.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          showcases: (col.showcases || []).filter(s => Number(s.id) !== Number(showcaseId)),
          showcases_count: Math.max(0, (col.showcases_count || 0) - 1)
        };
      }
      return col;
    }));

    setError(null);
    try {
      await collectionService.removeShowcase(collectionId, showcaseId);
      // Don't fetch immediately - let UI stay optimistic
      // Fetch will happen on next page load or manual refresh
      return { success: true };
    } catch (err) {
      console.error('Error removing showcase from collection:', err);
      setError(err.response?.data?.message || 'Failed to remove showcase');
      // Revert optimistic update on error
      await fetchCollections();
      throw err;
    }
  };

  // Auto-fetch collections when user logs in
  useEffect(() => {
    if (user) {
      fetchCollections();
    } else {
      setCollections([]);
    }
  }, [user]);

  const value = {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollectionById,
    addShowcaseToCollection,
    removeShowcaseFromCollection
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};
