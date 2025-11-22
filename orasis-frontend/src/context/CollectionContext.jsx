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
      setError(err.response?.data?.message || 'Failed to fetch collections');
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
   * Update collection (rename)
   */
  const updateCollection = async (id, collectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.update(id, collectionData);
      setCollections(prev =>
        prev.map(col => (col.id === id ? response.data : col))
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
   * Add showcase to collection
   */
  const addShowcaseToCollection = async (collectionId, showcaseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.addShowcase(collectionId, showcaseId);
      // Refresh collections to update count
      await fetchCollections();
      return response;
    } catch (err) {
      console.error('Error adding showcase to collection:', err);
      setError(err.response?.data?.message || 'Failed to add showcase');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove showcase from collection
   */
  const removeShowcaseFromCollection = async (collectionId, showcaseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await collectionService.removeShowcase(collectionId, showcaseId);
      // Refresh collections to update count
      await fetchCollections();
      return response;
    } catch (err) {
      console.error('Error removing showcase from collection:', err);
      setError(err.response?.data?.message || 'Failed to remove showcase');
      throw err;
    } finally {
      setLoading(false);
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
