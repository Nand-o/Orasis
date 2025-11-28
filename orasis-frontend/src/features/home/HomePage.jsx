import React, { useState, useMemo, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import ShowcaseCard from '../design/components/ShowcaseCard';
import Pagination from '../../components/ui/Pagination';
import { ShowcaseCardSkeleton } from '../../components/ui/Skeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';
import cacheManager from '../../utils/cacheManager';

const HomePage = ({ searchValue }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Initialize state from URL params
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'Websites');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    const [selectedTags, setSelectedTags] = useState(
        searchParams.get('tags') ? searchParams.get('tags').split(',') : []
    );
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('categories') ? searchParams.get('categories').split(',') : []
    );
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50; // Items per page

    useEffect(() => {
        document.title = 'Inspiration | Orasis';
        
        // 🔥 Fetch data with caching
        const fetchShowcases = async () => {
            try {
                // Check cache first using cache manager
                const cachedData = cacheManager.getShowcases();
                
                if (cachedData) {
                    setShowcases(cachedData);
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                
                // Fetch all showcases - use multiple pages if needed
                let allShowcases = [];
                let page = 1;
                let hasMorePages = true;
                
                while (hasMorePages) {
                    const data = await showcaseService.getAll({ page, per_page: 50 });
                    
                    allShowcases = [...allShowcases, ...data.data];
                    
                    // Check if there are more pages
                    hasMorePages = data.current_page < data.last_page;
                    page++;
                }
                
                // Transform snake_case to camelCase for compatibility with existing components
                const transformedData = allShowcases.map(showcase => ({
                    ...showcase,
                    imageUrl: showcase.image_url,
                    urlWebsite: showcase.url_website,
                }));
                
                // Save to cache using cache manager
                cacheManager.setShowcases(transformedData);
                
                setShowcases(transformedData);
                setError(null);
            } catch (err) {
                console.error('❌ API Error:', err);
                console.error('❌ Error details:', err.response || err);
                setError(err.message || 'Failed to fetch showcases');
                setShowcases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchShowcases();
    }, []);

    // Update URL params when filters change
    useEffect(() => {
        const params = {};
        if (activeCategory !== 'Websites') params.category = activeCategory;
        if (sortBy !== 'newest') params.sort = sortBy;
        if (selectedTags.length > 0) params.tags = selectedTags.join(',');
        if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
        
        setSearchParams(params);
    }, [activeCategory, sortBy, selectedTags, selectedCategories, setSearchParams]);

    const filteredDesigns = useMemo(() => {
        let filtered = showcases.filter(design => {
            // Category filter logic:
            // 1. If advanced filter has specific categories selected, use those ONLY
            // 2. Otherwise, use main category toggle (Websites/Mobiles)
            let matchesCategory = false;
            
            if (selectedCategories.length > 0) {
                // Advanced filter takes precedence
                matchesCategory = selectedCategories.includes(design.category);
            } else {
                // Use main category toggle
                if (activeCategory === 'Websites') {
                    matchesCategory = design.category !== 'Mobile';
                } else if (activeCategory === 'Mobiles') {
                    matchesCategory = design.category === 'Mobile';
                } else {
                    matchesCategory = design.category === activeCategory;
                }
            }

            // Search filter
            const matchesSearch = design.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                (design.description && design.description.toLowerCase().includes(searchValue.toLowerCase())) ||
                (design.tags && design.tags.some(tag => 
                    (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(searchValue.toLowerCase())
                ));

            // Tag filter
            const matchesTags = selectedTags.length === 0 || (
                design.tags && design.tags.some(tag => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    return selectedTags.some(selectedTag => 
                        tagName.toLowerCase().includes(selectedTag.toLowerCase())
                    );
                })
            );

            return matchesCategory && matchesSearch && matchesTags;
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
                default:
                    return 0;
            }
        });
        
        return filtered;
    }, [showcases, activeCategory, sortBy, selectedTags, selectedCategories, searchValue]);

    // Rename for clarity
    const filteredShowcases = filteredDesigns;

    // Pagination logic
    const totalPages = Math.ceil(filteredShowcases.length / itemsPerPage);
    const paginatedShowcases = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredShowcases.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredShowcases, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, sortBy, selectedTags, selectedCategories, searchValue]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle filter clear
    const handleClearFilters = () => {
        setActiveCategory('Websites');
        setSortBy('newest');
        setSelectedTags([]);
        setSelectedCategories([]);
        setCurrentPage(1);
    };

    // Select popular designs for carousel (first 5)
    const popularDesigns = showcases.slice(0, 5);

    // 🔥 Loading state with skeleton
    if (loading) {
        return (
            <div className="space-y-12">
                {/* Hero skeleton */}
                <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                
                {/* Filter bar skeleton */}
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                
                {/* Showcase cards skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ShowcaseCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* 🔥 Error notification */}
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                API Connection Issue. Using fallback data.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <HeroSection designs={popularDesigns} />

            {/* <HeroImageSlider /> */}

            <div className="mt-12">
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

                {paginatedShowcases.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredShowcases.length} {filteredShowcases.length === 1 ? 'showcase' : 'showcases'}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {paginatedShowcases.map((design) => (
                                <ShowcaseCard
                                    key={design.id}
                                    design={design}
                                    onClick={() => navigate(`/design/${design.id}`)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredShowcases.length}
                        />
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-gray-500 text-lg mb-2">No showcases found</p>
                        <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search query</p>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomePage;
