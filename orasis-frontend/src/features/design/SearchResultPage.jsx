import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShowcaseCard from './components/ShowcaseCard';
import FilterBar from '../home/components/FilterBar';
import { useNavigate } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';
import Spinner from '../../components/ui/Spinner';

const SearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Websites');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [selectedTags, setSelectedTags] = useState(
        searchParams.get('tags') ? searchParams.get('tags').split(',') : []
    );
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('categories') ? searchParams.get('categories').split(',') : []
    );

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

    // Update URL params when filters change
    useEffect(() => {
        const params = { q: query };
        if (activeCategory !== 'Websites') params.category = activeCategory;
        if (sortBy !== 'newest') params.sort = sortBy;
        if (selectedTags.length > 0) params.tags = selectedTags.join(',');
        if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
        
        setSearchParams(params);
    }, [activeCategory, sortBy, selectedTags, selectedCategories, query, setSearchParams]);

    const filteredResults = useMemo(() => {
        let filtered = showcases.filter(design => {
            const categoryName = design.category?.name || '';
            
            // Search query filter
            const matchesQuery = design.title.toLowerCase().includes(query.toLowerCase()) ||
                categoryName.toLowerCase().includes(query.toLowerCase()) ||
                (design.description && design.description.toLowerCase().includes(query.toLowerCase())) ||
                (design.tags && design.tags.some(tag => 
                    (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(query.toLowerCase())
                ));

            // Main category filter
            let matchesMainCategory = false;
            if (activeCategory === 'Websites') {
                matchesMainCategory = categoryName !== 'Mobile';
            } else if (activeCategory === 'Mobiles') {
                matchesMainCategory = categoryName === 'Mobile';
            } else {
                matchesMainCategory = categoryName === activeCategory;
            }

            // Multi-category filter
            const matchesAdvancedCategory = selectedCategories.length === 0 || 
                selectedCategories.includes(categoryName);

            // Tag filter
            const matchesTags = selectedTags.length === 0 || (
                design.tags && design.tags.some(tag => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    return selectedTags.some(selectedTag => 
                        tagName.toLowerCase().includes(selectedTag.toLowerCase())
                    );
                })
            );

            return matchesQuery && matchesMainCategory && matchesAdvancedCategory && matchesTags;
        });

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
                case 'oldest':
                    return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return b.title.localeCompare(a.title);
                case 'popular':
                    return (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [showcases, query, activeCategory, sortBy, selectedTags, selectedCategories]);

    const handleClearFilters = () => {
        setActiveCategory('Websites');
        setSortBy('newest');
        setSelectedTags([]);
        setSelectedCategories([]);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Spinner size="xl" color="gray" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Searching showcases...</p>
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

            {/* Enhanced Filter Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <FilterBar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    onClearFilters={handleClearFilters}
                />

                {/* Active Filters Display */}
                {(selectedTags.length > 0 || selectedCategories.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCategories.map(cat => (
                            <span key={cat} className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-sm rounded-full flex items-center gap-2">
                                {cat}
                                <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>
                                    ×
                                </button>
                            </span>
                        ))}
                        {selectedTags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm rounded-full flex items-center gap-2">
                                #{tag}
                                <button onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </motion.div>

            {filteredResults.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} for "{query}"
                        </p>
                    </div>
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
                </>
            ) : (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No results found for "{query}"</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Try adjusting your search terms or filters</p>
                    <button
                        onClick={handleClearFilters}
                        className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                        Clear all filters
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default SearchResultPage;
