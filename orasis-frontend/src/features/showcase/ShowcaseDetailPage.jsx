import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Share2, Bookmark, Eye } from 'lucide-react';
import showcaseService from '../../services/showcase.service';
import ShowcaseCard from './components/ShowcaseCard';
import CollectionModal from '../collections/components/CollectionModal';
import { useCollection } from '../../context/CollectionContext';

const ShowcaseDetailPage = () => {
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
                    const cached = JSON.parse(cachedData);
                    setDesign(cached.design);
                    setSimilarDesigns(cached.similar);
                    document.title = `${cached.design.title} | Orasis`;
                    setLoading(false);
                    
                    // Track view even when using cache
                    showcaseService.trackView(id);
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
            <motion.div 
                className="flex items-center justify-center min-h-[70vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="text-center">
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white rounded-full"></div>
                    </motion.div>
                    <motion.p
                        className="text-gray-600 dark:text-gray-400 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Loading showcase...
                    </motion.p>
                </div>
            </motion.div>
        );
    }

    if (error || !design) {
        return (
            <motion.div 
                className="flex items-center justify-center min-h-[70vh] px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center max-w-md">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6"
                    >
                        <svg 
                            className="w-12 h-12 text-gray-400 dark:text-gray-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                        {error ? 'Oops! Something went wrong' : 'Showcase Not Found'}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                    >
                        {error 
                            ? `We couldn't load this showcase. ${error.includes('404') || error.includes('Not Found') ? "It may have been removed or doesn't exist." : 'Please try again later.'}`
                            : "The showcase you're looking for doesn't exist or has been removed."
                        }
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-all transform hover:scale-105"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                            Try Again
                        </button>
                    </motion.div>
                </div>
            </motion.div>
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
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Views</h3>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                                <Eye className="w-4 h-4" />
                                <span className="font-semibold">{design.views_count?.toLocaleString() || 0}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Published</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                {new Date(design.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
                            <div className="text-gray-900 dark:text-white text-sm">
                                {design.category?.name || 'N/A'}
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

export default ShowcaseDetailPage;
