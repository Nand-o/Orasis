import React, { useState, useEffect } from 'react';
import { useCollection } from '../../context/CollectionContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, 
  FolderOpen, 
  Edit3, 
  Trash2, 
  Plus, 
  Minus, 
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CollectionTestPage = () => {
  const { user } = useAuth();
  const {
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
  } = useCollection();

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionDetail, setCollectionDetail] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [updateCollectionId, setUpdateCollectionId] = useState('');
  const [updateCollectionName, setUpdateCollectionName] = useState('');
  const [deleteCollectionId, setDeleteCollectionId] = useState('');
  const [showcaseId, setShowcaseId] = useState('');
  const [actionResult, setActionResult] = useState('');
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const showResult = (message, type = 'success') => {
    setActionResult(message);
    setActionType(type);
    setTimeout(() => {
      setActionResult('');
      setActionType('');
    }, 5000);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      showResult('Collection name cannot be empty', 'error');
      return;
    }

    try {
      const result = await createCollection({ name: newCollectionName });
      showResult(`Collection "${result.data.name}" created successfully`, 'success');
      setNewCollectionName('');
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleGetCollectionById = async () => {
    if (!selectedCollection) {
      showResult('Please select a collection first', 'error');
      return;
    }

    try {
      const result = await getCollectionById(selectedCollection);
      setCollectionDetail(result);
      showResult(`Found "${result.name}" with ${result.showcases?.length || 0} showcases`, 'success');
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
      setCollectionDetail(null);
    }
  };

  const handleUpdateCollection = async () => {
    if (!updateCollectionId || !updateCollectionName.trim()) {
      showResult('Collection ID and name are required', 'error');
      return;
    }

    try {
      const result = await updateCollection(updateCollectionId, { name: updateCollectionName });
      showResult(`Collection renamed to "${result.data.name}"`, 'success');
      setUpdateCollectionId('');
      setUpdateCollectionName('');
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleDeleteCollection = async () => {
    if (!deleteCollectionId) {
      showResult('Collection ID is required', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to delete collection ${deleteCollectionId}?`)) {
      return;
    }

    try {
      await deleteCollection(deleteCollectionId);
      showResult(`Collection deleted successfully`, 'success');
      setDeleteCollectionId('');
      if (selectedCollection === parseInt(deleteCollectionId)) {
        setSelectedCollection(null);
        setCollectionDetail(null);
      }
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleAddShowcase = async () => {
    if (!selectedCollection || !showcaseId) {
      showResult('Collection and Showcase ID are required', 'error');
      return;
    }

    try {
      await addShowcaseToCollection(selectedCollection, showcaseId);
      showResult(`Showcase ${showcaseId} added to collection`, 'success');
      setShowcaseId('');
      if (collectionDetail) {
        handleGetCollectionById();
      }
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleRemoveShowcase = async () => {
    if (!selectedCollection || !showcaseId) {
      showResult('Collection and Showcase ID are required', 'error');
      return;
    }

    try {
      await removeShowcaseFromCollection(selectedCollection, showcaseId);
      showResult(`Showcase ${showcaseId} removed from collection`, 'success');
      setShowcaseId('');
      if (collectionDetail) {
        handleGetCollectionById();
      }
    } catch (err) {
      showResult(err.response?.data?.message || err.message, 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please login first to test collection features
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Login Page
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FolderOpen className="w-10 h-10 text-blue-600" />
                Collection Test Page
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Testing collection API integration with backend
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Logged in as</div>
              <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3"
            >
              <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">Loading...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
            </motion.div>
          )}

          {actionResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                actionType === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {actionType === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <span className={`font-medium ${
                actionType === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {actionResult}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collections Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              All Collections ({collections.length})
            </h2>
            <button
              onClick={fetchCollections}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Refresh
            </button>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FolderPlus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No collections yet. Create one below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {collections.map(col => (
                <motion.div
                  key={col.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCollection === col.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <FolderOpen className={`w-5 h-5 ${
                      selectedCollection === col.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                    }`} />
                    <span className={`text-xs font-mono px-2 py-1 rounded ${
                      selectedCollection === col.id
                        ? 'bg-blue-700'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      #{col.id}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{col.name}</h3>
                  <p className={`text-sm ${
                    selectedCollection === col.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {col.showcases_count || 0} showcases
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CRUD Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CREATE */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <FolderPlus className="w-5 h-5 text-green-600" />
              Create Collection
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Collection
              </button>
            </div>
          </motion.div>

          {/* GET by ID */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-yellow-600" />
              Get Collection Detail
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Selected Collection:</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {selectedCollection ? `#${selectedCollection}` : 'None - Click a collection above'}
                </div>
              </div>
              <button
                onClick={handleGetCollectionById}
                disabled={!selectedCollection}
                className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Get Collection Detail
              </button>
            </div>
          </motion.div>

          {/* UPDATE */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Edit3 className="w-5 h-5 text-blue-600" />
              Update Collection
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Collection ID"
                value={updateCollectionId}
                onChange={(e) => setUpdateCollectionId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="New collection name"
                value={updateCollectionName}
                onChange={(e) => setUpdateCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdateCollection()}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={handleUpdateCollection}
                disabled={!updateCollectionId || !updateCollectionName.trim()}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Update Collection
              </button>
            </div>
          </motion.div>

          {/* DELETE */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Collection
            </h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Collection ID"
                value={deleteCollectionId}
                onChange={(e) => setDeleteCollectionId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDeleteCollection()}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={handleDeleteCollection}
                disabled={!deleteCollectionId}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Collection
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ⚠️ This action cannot be undone
              </p>
            </div>
          </motion.div>
        </div>

        {/* Showcase Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Showcase Management
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Selected Collection:</span>
              <div className="font-semibold text-gray-900 dark:text-white">
                {selectedCollection ? `#${selectedCollection}` : 'None'}
              </div>
            </div>
            <input
              type="number"
              placeholder="Showcase ID (1-21)"
              value={showcaseId}
              onChange={(e) => setShowcaseId(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddShowcase}
                disabled={!selectedCollection || !showcaseId}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
              <button
                onClick={handleRemoveShowcase}
                disabled={!selectedCollection || !showcaseId}
                className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Minus className="w-5 h-5" />
                Remove
              </button>
            </div>
          </div>
        </motion.div>

        {/* Collection Detail View */}
        {collectionDetail && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                Collection Details
              </h3>
              <button
                onClick={() => setCollectionDetail(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Collection Name</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{collectionDetail.name}</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Collection ID</div>
                  <div className="font-semibold text-gray-900 dark:text-white">#{collectionDetail.id}</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400 mb-1">Total Showcases</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{collectionDetail.showcases?.length || 0}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created At</div>
                <div className="text-gray-900 dark:text-white">
                  {new Date(collectionDetail.created_at).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Showcases ({collectionDetail.showcases?.length || 0})
                </h4>
                {collectionDetail.showcases?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {collectionDetail.showcases.map(showcase => (
                      <div
                        key={showcase.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {showcase.title}
                          </div>
                          <span className="text-xs font-mono px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
                            #{showcase.id}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          by {showcase.user?.name || 'Unknown'}
                        </div>
                        <div className="mt-2">
                          <span className="inline-block text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                            {showcase.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No showcases in this collection</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Guide */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            📝 Quick Testing Guide
          </h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Create a new collection using the form above</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Click on a collection card to select it</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Get collection details to view all showcases</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Add showcases (ID 1-21) to your collection</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">5.</span>
              <span>Update collection name or delete collections as needed</span>
            </li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionTestPage;
