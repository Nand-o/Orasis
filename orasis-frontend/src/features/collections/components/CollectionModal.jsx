import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from '../../../context/CollectionContext';

const CollectionModal = ({ isOpen, onClose, designId }) => {
    const { collections, createCollection, addShowcaseToCollection, removeShowcaseFromCollection } = useCollection();
    const [newCollectionName, setNewCollectionName] = useState('');

    const handleCreate = async () => {
        if (newCollectionName.trim()) {
            try {
                await createCollection({ name: newCollectionName });
                setNewCollectionName('');
            } catch (error) {
                console.error('Failed to create collection:', error);
            }
        }
    };

    const toggleDesignInCollection = async (collectionId, showcaseId) => {
        const collection = collections.find(c => c.id === collectionId);
        if (!collection) return;

        try {
            // Check if showcase is already in collection
            const isInCollection = collection.showcases?.some(s => s.id === showcaseId);
            
            if (isInCollection) {
                await removeShowcaseFromCollection(collectionId, showcaseId);
            } else {
                await addShowcaseToCollection(collectionId, showcaseId);
            }
        } catch (error) {
            console.error('Failed to toggle showcase in collection:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Add to a collection</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 max-h-60 overflow-y-auto">
                        {collections.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">No collections yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {collections.map((collection) => {
                                    const isInCollection = collection.showcases?.some(s => s.id === designId) || false;
                                    return (
                                        <label key={collection.id} className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-gray-700 font-medium group-hover:text-gray-900">
                                                {collection.name} ({collection.showcases_count || 0})
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={isInCollection}
                                                onChange={() => toggleDesignInCollection(collection.id, designId)}
                                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="Create a new collection"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            />
                            <button
                                onClick={handleCreate}
                                disabled={!newCollectionName.trim()}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CollectionModal;
