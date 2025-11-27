import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SlidersHorizontal, 
    X, 
    Check, 
    ChevronDown,
    ArrowUpDown,
    Tag as TagIcon
} from 'lucide-react';

// Categories available in database
const categories = [
    "Landing Page",
    "SaaS",
    "E-commerce",
    "Portfolio"
];

// Sort options
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' }
];

// Common tags (will be populated from API data)
const commonTags = [
    'modern', 'minimal', 'dark', 'colorful', 'professional',
    'creative', 'clean', 'responsive', 'dashboard', 'landing'
];

const FilterBar = ({ 
    activeCategory, 
    onCategoryChange,
    sortBy,
    onSortChange,
    selectedTags = [],
    onTagsChange,
    selectedCategories = [],
    onCategoriesChange,
    onClearFilters
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showTagsDropdown, setShowTagsDropdown] = useState(false);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            onTagsChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagsChange([...selectedTags, tag]);
        }
    };

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            onCategoriesChange(selectedCategories.filter(c => c !== category));
        } else {
            onCategoriesChange([...selectedCategories, category]);
        }
    };

    const hasActiveFilters = selectedTags.length > 0 || selectedCategories.length > 0 || sortBy !== 'newest';

    return (
        <div className="mb-6 relative z-20 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
                <div className="flex items-center overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                    <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
                    {/* Primary Filters: Websites & Mobiles (Segmented Control) */}
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-full relative shrink-0">
                        {["Websites", "Mobiles"].map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => onCategoryChange(tab)}
                                className={`relative px-3 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 z-10 ${activeCategory === tab
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
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2 shrink-0" />

                    {/* Other Categories - Styled as Text Links */}
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`text-xs sm:text-sm font-medium transition-colors duration-200 relative py-1 shrink-0 whitespace-nowrap ${activeCategory === category
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
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 380, 
                                        damping: 35,
                                        mass: 0.5
                                    }}
                                />
                            )}
                        </motion.button>
                    ))}
                    </div>
                </div>

                {/* Right Side: Sort & Advanced Filters */}
                <div className="flex items-center gap-3 shrink-0">
                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-sm whitespace-nowrap"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">{sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}</span>
                            <span className="sm:hidden">Sort</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        <AnimatePresence>
                            {showSortDropdown && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-30" 
                                        onClick={() => setShowSortDropdown(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40 overflow-hidden max-w-xs sm:max-w-none"
                                    >
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    onSortChange(option.value);
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
                                            >
                                                <span>{option.label}</span>
                                                {sortBy === option.value && (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Advanced Filters Button */}
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm ${
                            hasActiveFilters || showAdvancedFilters
                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {(selectedTags.length + selectedCategories.length + (sortBy !== 'newest' ? 1 : 0))}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showAdvancedFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-4 space-y-6">
                            {/* Multi-Category Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={() => onCategoriesChange([])}
                                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['Mobile', ...categories].map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => toggleCategory(category)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                selectedCategories.includes(category)
                                                    ? 'bg-black dark:bg-white text-white dark:text-black'
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {category}
                                            {selectedCategories.includes(category) && (
                                                <Check className="w-3 h-3 inline ml-1.5" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tag Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <TagIcon className="w-4 h-4" />
                                        Tags
                                    </h3>
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => onTagsChange([])}
                                            className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {commonTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear All Filters */}
                            {hasActiveFilters && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            onClearFilters();
                                            setShowAdvancedFilters(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterBar;
