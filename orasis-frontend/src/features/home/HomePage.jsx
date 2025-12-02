import React, { useState, useMemo, useEffect, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import HeroNew from './components/HeroNew';
import FilterBar from './components/FilterBar';
import ShowcaseCard from '../showcase/components/ShowcaseCard';
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
    // Always start with loading true to show skeleton, will be set to false after data loads
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50; // Items per page

    // Function to fetch showcases (wrapped in useCallback to avoid recreating on each render)
    const fetchShowcases = useCallback(async (forceRefresh = false) => {
        try {
            // Always show skeleton loading for consistent UX
            setLoading(true);
            
            // Check cache first using cache manager
            const cachedData = cacheManager.getShowcases();

            if (cachedData && !forceRefresh) {
                // Show cached data with brief skeleton display for smooth transition
                setShowcases(cachedData);
                setError(null);
                
                // Small delay to show skeleton briefly, then hide
                setTimeout(() => {
                    setLoading(false);
                }, 300);

                // Still fetch fresh data in background to update views counter
                // This runs silently without blocking UI
                fetchFreshDataInBackground();
                return;
            }

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
    }, []);

    // Background fetch function - updates data silently without showing loading
    const fetchFreshDataInBackground = useCallback(async () => {
        try {
            let allShowcases = [];
            let page = 1;
            let hasMorePages = true;

            while (hasMorePages) {
                const data = await showcaseService.getAll({ page, per_page: 50 });
                allShowcases = [...allShowcases, ...data.data];
                hasMorePages = data.current_page < data.last_page;
                page++;
            }

            const transformedData = allShowcases.map(showcase => ({
                ...showcase,
                imageUrl: showcase.image_url,
                urlWebsite: showcase.url_website,
            }));

            // Update cache and state silently
            cacheManager.setShowcases(transformedData);
            setShowcases(transformedData);
        } catch (err) {
            // Fail silently - user still sees cached data
            console.log('Background refresh failed, using cached data');
        }
    }, []);

    useEffect(() => {
        document.title = 'Inspiration | Orasis';

        // Fetch showcases with cache-first strategy
        fetchShowcases(false);

        // Also listen for visibility changes (tab switching)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                const cachedData = cacheManager.getShowcases();
                if (cachedData) {
                    fetchFreshDataInBackground();
                } else {
                    fetchShowcases(false);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchShowcases]);

    // Sync state from URL params when they change (e.g. navigation from Navbar)
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categoryParam !== activeCategory) {
            setActiveCategory(categoryParam);
        } else if (!categoryParam && activeCategory !== 'Websites') {
            // Only reset if we are supposed to be at default but aren't
            // But be careful not to loop if setParams effect triggers
            setActiveCategory('Websites');
        }

        const sortParam = searchParams.get('sort');
        if (sortParam && sortParam !== sortBy) {
            setSortBy(sortParam);
        }

        // We don't auto-sync tags/categories arrays back from URL to avoid complex loops 
        // unless strictly needed, but for the main category toggle it's essential.
    }, [searchParams]);

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
            const categoryName = design.category?.name || '';

            if (selectedCategories.length > 0) {
                // Advanced filter takes precedence
                matchesCategory = selectedCategories.includes(categoryName);
            } else {
                // Use main category toggle
                if (activeCategory === 'Websites') {
                    matchesCategory = categoryName !== 'Mobile';
                } else if (activeCategory === 'Mobiles') {
                    // Match plural 'Mobiles' with singular 'Mobile' category
                    matchesCategory = categoryName === 'Mobile';
                } else {
                    matchesCategory = categoryName === activeCategory;
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
                case 'most_viewed':
                    return (b.views_count || 0) - (a.views_count || 0);
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

    // Select most viewed designs for hero carousel (top 5 by views_count)
    const popularDesigns = useMemo(() => {
        return [...showcases]
            .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
            .slice(0, 5);
    }, [showcases]);

    // 🔥 Loading state with skeleton
    if (loading) {
        return (
            <div className="space-y-12">
                {/* Hero skeleton */}
                <div className="h-96 bg-gray-200 dark:bg-dark-gray rounded-3xl animate-pulse"></div>

                {/* Filter bar skeleton */}
                <div className="h-16 bg-gray-200 dark:bg-dark-gray rounded-xl animate-pulse"></div>

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

            {/* <HeroSection designs={popularDesigns} /> */}
            <HeroNew designs={popularDesigns} />

            <div className="mt-8">
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
