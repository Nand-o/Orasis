/**
 * CollectionDetailModal
 *
 * Modal yang menampilkan isi sebuah collection, memberikan listing
 * showcase di dalamnya, pencarian internal, dan opsi untuk
 * menghapus showcase dari collection.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Package, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCollection } from '../../../context/CollectionContext';

const CollectionDetailModal = ({ isOpen, onClose, collection }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { removeShowcaseFromCollection, collections } = useCollection();

    // Get the latest collection data from context to ensure real-time updates
    const currentCollection = useMemo(() => {
        if (!collection) return null;
        return collections.find(c => c.id === collection.id) || collection;
    }, [collection, collections]);

    // Get showcases from collection (they come from backend now)
    const designs = useMemo(() => {
        if (!currentCollection) return [];
        return currentCollection.showcases || [];
    }, [currentCollection]);

    // Filter designs by search query
    const filteredDesigns = useMemo(() => {
        if (!searchQuery.trim()) return designs;
        const query = searchQuery.toLowerCase();
        return designs.filter(design => {
            const categoryName = design.category?.name || '';
            return design.title.toLowerCase().includes(query) ||
                categoryName.toLowerCase().includes(query);
        });
    }, [designs, searchQuery]);

    const handleRemove = async (designId) => {
        try {
            await removeShowcaseFromCollection(currentCollection.id, designId);
        } catch (error) {
            console.error('Failed to remove showcase:', error);
        }
    };

    const handleTitleClick = (designId) => {
        navigate(`/design/${designId}`);
        onClose();
    };

    if (!currentCollection) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-main-black rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/50">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentCollection.name}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-gray rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-white" />
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="px-6 pt-4 pb-2">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-main-black dark:text-white" />
                                    <input
                                        type="text"
                                        placeholder="Search designs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-yellow-300 text-gray-900 placeholder-gray-400 dark:bg-dark-gray dark:text-white dark:placeholder-white/50"
                                    />
                                </div>
                            </div>

                            {/* Design List */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {filteredDesigns.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-gray flex items-center justify-center mb-4">
                                            {searchQuery ? (
                                                <SearchX className="w-8 h-8 text-gray-400 dark:text-white" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-400 dark:text-white" />
                                            )}
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {searchQuery ? 'No designs found' : 'This collection is empty'}
                                        </h4>
                                        <p className="text-gray-500 text-center max-w-xs dark:text-white/50">
                                            {searchQuery
                                                ? `No results for "${searchQuery}". Try different keywords.`
                                                : 'Start adding designs from the homepage to build your collection'
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredDesigns.map((design) => (
                                            <motion.div
                                                key={design.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-violet-300 dark:hover:bg-yellow-300 transition-colors group"
                                            >
                                                {/* Preview Image */}
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-gray shrink-0">
                                                    <img
                                                        src={design.image_url || design.imageUrl}
                                                        alt={design.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>                                                {/* Design Info */}
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => handleTitleClick(design.id)}
                                                        className="text-left w-full group/title"
                                                    >
                                                        <h3 className="font-semibold text-main-black dark:text-white group-hover:text-white dark:group-hover:text-main-black transition-colors truncate">
                                                            {design.title}
                                                        </h3>
                                                        <p className="text-sm text-dark-gray dark:text-white/50 group-hover:text-white/70 dark:group-hover:text-dark-gray truncate">{design.category?.name || 'N/A'}</p>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(design.id)}
                                                    className="px-4 py-2 text-sm font-medium text-main-black bg-white dark:bg-dark-gray dark:text-white rounded-full hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CollectionDetailModal;
