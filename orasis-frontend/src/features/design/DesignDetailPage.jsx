import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, Share2, Bookmark } from 'lucide-react';
import showcaseService from '../../services/showcase.service';
import ShowcaseCard from './components/ShowcaseCard';
import CollectionModal from '../collections/components/CollectionModal';
import { useCollection } from '../../context/CollectionContext';

const DesignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [design, setDesign] = useState(null);
    const [similarDesigns, setSimilarDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { collections } = useCollection();

    // Check if design is saved in any collection
    const isSaved = collections.some(col => 
        col.showcases?.some(s => s.id === parseInt(id))
    );

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                // Check cache first (valid for 5 minutes)
                const cacheKey = `showcase_detail_${id}`;
                const cachedData = sessionStorage.getItem(cacheKey);
                const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
                const now = Date.now();
                const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
                
                if (cachedData && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
                    console.log(`✅ Using cached detail for showcase ${id}`);
                    const cached = JSON.parse(cachedData);
                    setDesign(cached.design);
                    setSimilarDesigns(cached.similar);
                    document.title = `${cached.design.title} | Orasis`;
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                const response = await showcaseService.getById(id);
                
                // Transform snake_case to camelCase
                const transformedDesign = {
                    ...response.data,
                    imageUrl: response.data.image_url || response.data.imageUrl,
                    urlWebsite: response.data.url_website || response.data.urlWebsite,
                };
                
                // Transform similar showcases
                const transformedSimilar = (response.similar || []).map(showcase => ({
                    ...showcase,
                    imageUrl: showcase.image_url || showcase.imageUrl,
                    urlWebsite: showcase.url_website || showcase.urlWebsite,
                }));
                
                // Save to cache
                sessionStorage.setItem(cacheKey, JSON.stringify({
                    design: transformedDesign,
                    similar: transformedSimilar
                }));
                sessionStorage.setItem(`${cacheKey}_time`, now.toString());
                
                setDesign(transformedDesign);
                setSimilarDesigns(transformedSimilar);
                document.title = `${transformedDesign.title} | Orasis`;
            } catch (err) {
                console.error('Error fetching showcase:', err);
                setError(err.message || 'Failed to load showcase');
            } finally {
                setLoading(false);
            }
        };

        fetchDesign();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading showcase...</p>
                </div>
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {error ? 'Error Loading Showcase' : 'Design not found'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
                >
                    Back to Home
                </button>
            </div>
        );
    }

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
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className={`p-2 rounded-lg border transition-colors ${
                            isSaved 
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                        }`}
                        title="Save to collection"
                    >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
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
                    {design.urlWebsite && (
                        <a
                            href={design.urlWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-medium transition-colors"
                        >
                            <span>Visit Website</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    )}

                    {/* Metadata */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Published</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                {new Date(design.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                {design.category}
                            </div>
                        </div>

                        {design.user && (
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created by</h3>
                                <div className="text-gray-900 dark:text-white text-sm">
                                    {design.user.name}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {design.tags && design.tags.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {design.tags.map(tag => (
                                    <span key={tag.id || tag.name} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                        {tag.name || tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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
                            src={design.image_url || design.imageUrl}
                            alt={design.title}
                            className="h-full object-contain"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Description Section */}
            {design.description && (
                <motion.div
                    className="mt-12 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this design</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {design.description}
                    </p>
                </motion.div>
            )}

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

            {/* Collection Modal */}
            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                designId={parseInt(id)}
            />
        </div>
    );
};

export default DesignDetailPage;
