import React, { useState, useMemo, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import ShowcaseCard from '../design/components/ShowcaseCard';
import { MOCK_DESIGNS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ searchValue }) => {
    const [activeCategory, setActiveCategory] = useState('Websites');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Inspiration | Orasis';
    }, []);

    const filteredDesigns = useMemo(() => {
        return MOCK_DESIGNS.filter(design => {
            let matchesCategory = false;
            if (activeCategory === 'Websites') {
                matchesCategory = design.category !== 'Mobile';
            } else if (activeCategory === 'Mobiles') {
                matchesCategory = design.category === 'Mobile';
            } else {
                matchesCategory = design.category === activeCategory;
            }

            const matchesSearch = design.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                design.tags.some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchValue]);

    // Select popular designs for carousel (first 5)
    const popularDesigns = MOCK_DESIGNS.slice(0, 5);

    return (
        <>
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
