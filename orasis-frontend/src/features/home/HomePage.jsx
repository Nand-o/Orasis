import React, { useState, useMemo, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import ShowcaseCard from '../design/components/ShowcaseCard';
import { MOCK_DESIGNS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import showcaseService from '../../services/showcase.service';

const HomePage = ({ searchValue }) => {
    const [activeCategory, setActiveCategory] = useState('Websites');
    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Inspiration | Orasis';
        
        // 🔥 TEST: Fetch data dari API
        const fetchShowcases = async () => {
            try {
                setLoading(true);
                const data = await showcaseService.getAll();
                console.log('✅ API Response:', data); // Debug log
                setShowcases(data.data || []);
                setError(null);
            } catch (err) {
                console.error('❌ API Error:', err);
                setError(err.message || 'Failed to fetch showcases');
                // Fallback ke mock data jika API gagal
                setShowcases(MOCK_DESIGNS);
            } finally {
                setLoading(false);
            }
        };

        fetchShowcases();
    }, []);

    // 🔥 Gunakan data dari API atau fallback ke MOCK
    const dataSource = showcases.length > 0 ? showcases : MOCK_DESIGNS;

    const filteredDesigns = useMemo(() => {
        return dataSource.filter(design => {
            let matchesCategory = false;
            if (activeCategory === 'Websites') {
                matchesCategory = design.category !== 'Mobile';
            } else if (activeCategory === 'Mobiles') {
                matchesCategory = design.category === 'Mobile';
            } else {
                matchesCategory = design.category === activeCategory;
            }

            const matchesSearch = design.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                (design.tags && design.tags.some(tag => 
                    (typeof tag === 'string' ? tag : tag.name).toLowerCase().includes(searchValue.toLowerCase())
                ));
            return matchesCategory && matchesSearch;
        });
    }, [dataSource, activeCategory, searchValue]);

    // Select popular designs for carousel (first 5)
    const popularDesigns = dataSource.slice(0, 5);

    // 🔥 Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading showcases...</p>
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
                />

                {filteredDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDesigns.map((design) => (
                            <ShowcaseCard
                                key={design.id}
                                design={design}
                                onClick={() => navigate(`/design/${design.id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No designs found matching your criteria.</p>
                        <button
                            onClick={() => { setActiveCategory('Websites'); }}
                            className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomePage;
