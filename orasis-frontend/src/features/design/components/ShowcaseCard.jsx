import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
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

    return (
        <>
            <motion.div
                className="group cursor-pointer animate-fade-in-up"
                onClick={() => onClick(design)}
                whileTap={{ scale: 0.98 }}
            >
                {/* Image Container - The "Box" */}
                <div className="relative aspect-4/3 bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden mb-4 p-12 transition-colors duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                    <div className="w-full h-full rounded-lg overflow-hidden shadow-sm relative">
                        <LazyImage
                            src={design.image_url || design.imageUrl}
                            alt={design.title}
                            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Optional: Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300" />
                    </div>
                </div>

                {/* Content Container - Outside the box */}
                <div className="flex items-start justify-between px-1">
                    <div className="flex items-center space-x-3">
                        {/* Mock Icon/Logo */}
                        <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-black shadow-md">
                            <span className="text-sm font-bold">{design.title.charAt(0)}</span>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {design.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{design.category?.name || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Action Icon (Bookmark/Save) */}
                    {showBookmark && (
                        <button
                            className={`transition-colors p-2 ${isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                            onClick={handleBookmarkClick}
                        >
                            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                    )}
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
