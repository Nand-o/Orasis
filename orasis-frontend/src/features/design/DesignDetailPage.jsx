import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Heart, Share2 } from 'lucide-react';
import { MOCK_DESIGNS } from '../../data/mockData';
import ShowcaseCard from './components/ShowcaseCard';

const DesignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const design = MOCK_DESIGNS.find(d => d.id === id);

    useEffect(() => {
        if (design) {
            document.title = `${design.title} | Orasis`;
        }
    }, [design]);

    if (!design) {
        return <div className="text-center py-20">Design not found</div>;
    }

    // Similar designs logic (same category, exclude current)
    const similarDesigns = MOCK_DESIGNS
        .filter(d => d.category === design.category && d.id !== design.id)
        .slice(0, 4);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Header - Full Width with fade-in */}
            <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{design.title}</h1>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Two Column Layout: Sidebar + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
                {/* Left Sidebar with slide-in */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    {/* External Link Button */}
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-medium transition-colors"
                    >
                        <span>Visit Website</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </a>

                    {/* Metadata */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Published</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                November 13, 2025
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Categories</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                {design.category}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Credits</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                Sign up to add a credit
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            {design.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - Image with fade-in */}
                <motion.div
                    className="flex justify-end"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-end justify-end bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden max-h-[85vh] w-full">
                        <img
                            src={design.imageUrl}
                            alt={design.title}
                            className="h-full object-contain"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Similar Websites with animation */}
            {similarDesigns.length > 0 && (
                <motion.div
                    className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Similar Websites</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {similarDesigns.map((similar, index) => (
                            <motion.div
                                key={similar.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.4 + (index * 0.1)
                                }}
                            >
                                <ShowcaseCard
                                    design={similar}
                                    onClick={() => {
                                        navigate(`/design/${similar.id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default DesignDetailPage;
