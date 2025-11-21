import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Package, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DESIGNS } from '../../../data/mockData';
import { useCollections } from '../context/CollectionContext';

const CollectionDetailModal = ({ isOpen, onClose, collection }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { removeDesignFromCollection, collections } = useCollections();

    // Get the latest collection data from context to ensure real-time updates
    const currentCollection = useMemo(() => {
        if (!collection) return null;
        return collections.find(c => c.id === collection.id) || collection;
    }, [collection, collections]);

    // Get full design objects from designIds
    const designs = useMemo(() => {
        if (!currentCollection) return [];
        return currentCollection.designIds
            .map(id => MOCK_DESIGNS.find(d => d.id === id))
            .filter(Boolean);
    }, [currentCollection]);

    // Filter designs by search query
    const filteredDesigns = useMemo(() => {
        if (!searchQuery.trim()) return designs;
        const query = searchQuery.toLowerCase();
        return designs.filter(design =>
            design.title.toLowerCase().includes(query) ||
            design.category.toLowerCase().includes(query)
        );
    }, [designs, searchQuery]);

    const handleRemove = (designId) => {
        removeDesignFromCollection(currentCollection.id, designId);
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
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900">{currentCollection.name}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="px-6 pt-4 pb-2">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search designs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Design List */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {filteredDesigns.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                            {searchQuery ? (
                                                <SearchX className="w-8 h-8 text-gray-400" />
                                            ) : (
                                                <Package className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {searchQuery ? 'No designs found' : 'This collection is empty'}
                                        </h4>
                                        <p className="text-gray-500 text-center max-w-xs">
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
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                                            >
                                                {/* Preview Image */}
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={design.imageUrl}
                                                        alt={design.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Design Info */}
                                                <div className="flex-1 min-w-0">
                                                    <button
                                                        onClick={() => handleTitleClick(design.id)}
                                                        className="text-left w-full group/title"
                                                    >
                                                        <h3 className="font-semibold text-gray-900 group-hover/title:text-indigo-600 transition-colors truncate">
                                                            {design.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">{design.category}</p>
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => handleRemove(design.id)}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors opacity-0 group-hover:opacity-100"
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
