import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';
import CollectionCard from './components/CollectionCard';
import CollectionModal from './components/CollectionModal';
import CollectionDetailModal from './components/CollectionDetailModal';
import ConfirmationModal from '../../components/feedback/ConfirmationModal';

const CollectionPage = () => {
    const { collections = [], deleteCollection } = useCollection();
    const [activeTab, setActiveTab] = useState('Websites'); // 'Websites' | 'Mobiles'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const location = useLocation();
    const isDashboard = location.pathname.includes('/dashboard');

    useEffect(() => {
        document.title = 'My Collections | Orasis';
    }, []);

    // Helper to get preview images for a collection from backend data
    const getCollectionPreviews = (showcases) => {
        if (!showcases || !Array.isArray(showcases)) return [];
        return showcases
            .map(s => s.image_url || s.imageUrl)
            .filter(Boolean)
            .slice(0, 4); // Get up to 4 images
    };

    // Filter collections based on active tab
    const filteredCollections = useMemo(() => {
        if (!Array.isArray(collections)) return [];

        return collections.filter(collection => {
            // Get all showcases in this collection
            const showcases = collection.showcases || [];

            // Show empty collections in all tabs
            if (showcases.length === 0) return true;

            // Check if collection has showcases matching the active category
            if (activeTab === 'Websites') {
                return showcases.some(s => s.category !== 'Mobile');
            } else if (activeTab === 'Mobiles') {
                return showcases.some(s => s.category === 'Mobile');
            }

            return true;
        });
    }, [collections, activeTab]);

    // Delete handlers
    const handleDeleteClick = (collection) => {
        setCollectionToDelete(collection);
    };

    const handleConfirmDelete = () => {
        if (collectionToDelete) {
            deleteCollection(collectionToDelete.id);
            setCollectionToDelete(null);
        }
    };

    return (
        <div className={isDashboard ? "space-y-6" : ""}>
            {/* Header & Tabs */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDashboard ? 'bg-white dark:bg-dark-gray rounded-3xl p-1 border border-gray-100 dark:border-white/5' : 'mb-8'}`}>
                {!isDashboard && (
                    <motion.h1
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Collections
                    </motion.h1>
                )}

                {/* Premium Tabs */}
                <div className={`${isDashboard ? 'w-full' : ''}`}>
                    <div className="flex p-2 gap-2">
                        {["Websites", "Mobiles"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-white dark:bg-main-black text-main-black dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && !isDashboard && (
                                    // Optional: Add a different indicator for non-dashboard if desired, 
                                    // but the background style works well for both now.
                                    null
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredCollections.length === 0 ? (
                <motion.div
                    className="col-span-full flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-gray flex items-center justify-center mb-4">
                        <Grid className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {collections.length === 0 ? "No collections yet" : `No ${activeTab} collections`}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
                        {collections.length === 0
                            ? "Create your first collection to organize your favorite designs"
                            : `Collections with ${activeTab === 'Websites' ? 'website' : 'mobile'} designs will appear here`
                        }
                    </p>
                    {collections.length === 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors shadow-sm"
                        >
                            Create Collection
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {/* Existing Collections with stagger animation */}
                    {filteredCollections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <CollectionCard
                                collection={collection}
                                previewImages={getCollectionPreviews(collection.showcases)}
                                onClick={() => setSelectedCollection(collection)}
                                onDelete={handleDeleteClick}
                            />
                        </motion.div>
                    ))}

                    {/* New Collection Card - Now at the end with animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.3,
                            delay: filteredCollections.length * 0.05,
                            ease: "easeOut"
                        }}
                    >
                        <CollectionCard isNew onClick={() => setIsModalOpen(true)} />
                    </motion.div>
                </div>
            )}

            {/* Reuse Modal for creating new collection (pass null designId to just create) */}
            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                designId={null}
            />

            {/* Collection Detail Modal */}
            <CollectionDetailModal
                isOpen={!!selectedCollection}
                onClose={() => setSelectedCollection(null)}
                collection={selectedCollection}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!collectionToDelete}
                onClose={() => setCollectionToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Collection"
                message={`Are you sure you want to delete "${collectionToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default CollectionPage;
