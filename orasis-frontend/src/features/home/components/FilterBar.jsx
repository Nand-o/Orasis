import React from 'react';

const categories = [
    "Landing Page",
    "SaaS",
    "E-commerce",
    "Portfolio",
    "Dashboard",
    "Agency",
    "App Landing",
    "Blog",
    "Healthcare",
    "Real Estate",
    "NFT/Crypto",
    "Social Media"
];

const FilterBar = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="flex items-center overflow-x-auto pb-4 mb-6 scrollbar-hide">
            <div className="flex items-center space-x-6">
                {/* Primary Filters: Websites & Mobiles (Segmented Control) */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-full relative">
                    {["Websites", "Mobiles"].map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => onCategoryChange(tab)}
                            className={`relative px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 z-10 ${activeCategory === tab
                                ? 'text-white dark:text-black'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            {activeCategory === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black dark:bg-white rounded-full -z-10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            {tab}
                        </motion.button>
                    ))}
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

                {/* Other Categories - Styled as Text Links */}
                {categories.map((category) => (
                    <motion.button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`text-sm font-medium transition-colors duration-200 relative py-1 ${activeCategory === category
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        whileTap={{ scale: 0.95 }}
                    >
                        {category}
                        {/* Active Underline */}
                        {activeCategory === category && (
                            <motion.span
                                layoutId="activeCategoryLine"
                                className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 dark:bg-white rounded-full"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
