import React, { useState } from 'react';
import { Bookmark, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import CollectionModal from '../../collections/components/CollectionModal';
import { useCollection } from '../../../context/CollectionContext';
import LazyImage from '../../../components/ui/LazyImage';

const ShowcaseCard = ({ design, onClick, showBookmark = true }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { collections } = useCollection();

    // Check if this design is saved in ANY collection
    const isSaved = collections.some(col =>
        col.showcases?.some(s => s.id === design.id)
    );

    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    };

    // Determine if this is a mobile showcase
    const isMobile = design.category?.name?.toLowerCase() === 'mobile';
    
    return (
        <>
            <motion.div
                className="group cursor-pointer animate-fade-in-up"
                onClick={() => onClick(design)}
                whileTap={{ scale: 0.98 }}
            >
                {/* Image Container - The "Box" */}
                <div className={`relative ${isMobile ? 'aspect-9/16' : 'aspect-4/3'} bg-light-gray dark:bg-dark-gray rounded-3xl overflow-hidden mb-4 ${isMobile ? 'p-16 py-12' : 'p-12 py-16'} transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-main-black`}>
                    <div className="w-full h-full rounded-lg overflow-hidden shadow-sm relative">
                        <LazyImage
                            src={design.image_url || design.imageUrl}
                            alt={design.title}
                            className="w-full h-full transition-transform duration-500"
                        />
                        {/* Optional: Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                </div>

                {/* Content Container - Outside the box */}
                <div className="flex items-start justify-between px-1 gap-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Logo or Fallback Icon */}
                        {design.logo_url ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-md">
                                <img
                                    src={design.logo_url}
                                    alt={`${design.title} logo`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to initial if logo fails to load
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black"><span class="text-base font-bold">${design.title.charAt(0)}</span></div>`;
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-black shadow-md">
                                <span className="text-sm font-bold">{design.title.charAt(0)}</span>
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-violet-300 dark:group-hover:text-yellow-300 transition-colors truncate pr-2">
                                {design.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium truncate">{design.category?.name || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Right Side: Bookmark and View Count */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* Action Icon (Bookmark/Save) */}
                        {showBookmark && (
                            <button
                                className={`transition-colors p-1.5 ${isSaved ? 'text-indigo-600 dark:text-yellow-300' : 'text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-yellow-300'}`}
                                onClick={handleBookmarkClick}
                            >
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                        )}

                        {/* View Count */}
                        <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{design.views_count?.toLocaleString() || 0}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {showBookmark && (
                <CollectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    designId={design.id}
                />
            )}
        </>
    );
};

export default ShowcaseCard;
