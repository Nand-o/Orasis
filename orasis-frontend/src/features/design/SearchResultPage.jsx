import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShowcaseCard from './components/ShowcaseCard';
import { MOCK_DESIGNS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = query ? `Search - ${query} | Orasis` : 'Search | Orasis';
        
        // Fetch showcases from API
        const fetchShowcases = async () => {
            try {
                setLoading(true);
                let allShowcases = [];
                let page = 1;
                let hasMorePages = true;
                
                while (hasMorePages) {
                    const data = await showcaseService.getAll({ page, per_page: 50 });
                    allShowcases = [...allShowcases, ...data.data];
                    hasMorePages = data.current_page < data.last_page;
                    page++;
                }
                
                // Transform snake_case to camelCase
                const transformedData = allShowcases.map(showcase => ({
                    ...showcase,
                    imageUrl: showcase.image_url,
                    urlWebsite: showcase.url_website,
                }));
                
                setShowcases(transformedData);
            } catch (err) {
                console.error('❌ API Error:', err);
                // Fallback to mock data
                setShowcases(MOCK_DESIGNS);
            } finally {
                setLoading(false);
            }
        };
        
        fetchShowcases();
    }, [query]);

    const dataSource = showcases.length > 0 ? showcases : MOCK_DESIGNS;

    const filteredResults = dataSource.filter(design =>
        design.title.toLowerCase().includes(query.toLowerCase()) ||
        design.category.toLowerCase().includes(query.toLowerCase()) ||
        (design.tags && design.tags.some(tag => 
            (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(query.toLowerCase())
        ))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Searching...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header with fade-in animation */}
            <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <h1 className="text-4xl font-light text-gray-900 dark:text-white">
                    Search results for "{query}"
                </h1>
            </motion.div>

            {/* Filter buttons with fade-in */}
            <motion.div
                className="flex justify-center space-x-4 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    All Results <span className="ml-1 text-gray-500 dark:text-gray-400">{filteredResults.length}</span>
                </button>
            </motion.div>

            {filteredResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredResults.map((design, index) => (
                        <motion.div
                            key={design.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut"
                            }}
                        >
                            <ShowcaseCard
                                design={design}
                                onClick={() => navigate(`/design/${design.id}`)}
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <p className="text-gray-500 text-lg">No results found for "{query}"</p>
                </motion.div>
            )}
        </div>
    );
};

export default SearchResultPage;
