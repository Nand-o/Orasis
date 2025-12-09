import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SlidersHorizontal,
    X,
    Check,
    ChevronDown,
    ArrowUpDown,
    Tag as TagIcon
} from 'lucide-react';
/**
 * FilterBar
 *
 * Komponen bar filter untuk halaman eksplorasi/beranda.
 * Memungkinkan pengguna memilih kategori, sorting, dan melakukan search.
 * Props diharapkan berupa handler untuk perubahan filter.
 */
import categoryService from '../../../services/category.service';
import tagService from '../../../services/tag.service';

// Sort options
const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_viewed', label: 'Most Viewed' },
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' }
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

    // State for categories and tags from database
    // Initialize with cached or default values for instant render
    const [categories, setCategories] = useState(() => {
        const cached = sessionStorage.getItem('orasis_categories');
        return cached ? JSON.parse(cached) : ['Landing Page', 'SaaS', 'E-commerce', 'Portfolio'];
    });
    const [availableTags, setAvailableTags] = useState(() => {
        const cached = sessionStorage.getItem('orasis_tags');
        return cached ? JSON.parse(cached) : ['modern', 'minimal', 'dark', 'colorful', 'professional', 'creative', 'clean', 'responsive'];
    });

    // Fetch categories and tags from database (background refresh)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch fresh data (no loading state since we have initial values)
                const cats = await categoryService.getAll();
                const filteredCategories = cats.filter(cat => cat.name !== 'Mobile').map(cat => cat.name);

                // Update cache and state silently
                sessionStorage.setItem('orasis_categories', JSON.stringify(filteredCategories));
                setCategories(filteredCategories);
            } catch (error) {
                console.error('Failed to load categories:', error);
                // Keep existing state (from cache or default)
            }
        };

        const fetchTags = async () => {
            try {
                // Fetch fresh data (no loading state since we have initial values)
                const tags = await tagService.getAll();
                const tagNames = tags.map(tag => tag.name);

                // Update cache and state silently
                sessionStorage.setItem('orasis_tags', JSON.stringify(tagNames));
                setAvailableTags(tagNames);
            } catch (error) {
                console.error('Failed to load tags:', error);
                // Keep existing state (from cache or default)
            }
        };

        fetchCategories();
        fetchTags();
    }, []);

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
        <div className="mb-6 relative z-40">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
                <div className="flex items-center overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
                    <div className="flex items-center space-x-4 sm:space-x-6 min-w-0">
                        {/* Primary Filters: Websites & Mobiles (Segmented Control) */}
                        <div className="flex p-1 bg-light-gray dark:bg-dark-gray rounded-full relative shrink-0">
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-dark-gray rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium whitespace-nowrap"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">{sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}</span>
                            <span className="sm:hidden">Sort</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showSortDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-55"
                                        onClick={() => setShowSortDropdown(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-48 bg-white dark:bg-dark-gray rounded-2xl shadow-xl z-56 overflow-hidden max-w-xs sm:max-w-none p-1"
                                    >
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    onSortChange(option.value);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left text-sm rounded-xl transition-colors flex items-center justify-between ${sortBy === option.value
                                                    ? 'bg-violet-300 text-white dark:text-main-black dark:bg-yellow-300 font-family-general'
                                                    : 'hover:bg-violet-300/70 hover:text-white dark:hover:bg-yellow-300/70 dark:hover:text-main-black'
                                                    }`}
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-medium ${hasActiveFilters || showAdvancedFilters
                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-gray-200 dark:shadow-none'
                            : 'bg-gray-100 dark:bg-dark-gray text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
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
                        <div className="bg-light-gray dark:bg-dark-gray rounded-lg p-6 mt-4 space-y-6">
                            {/* Multi-Category Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Categories</h3>
                                    {selectedCategories.length > 0 && (
                                        <button
                                            onClick={() => onCategoriesChange([])}
                                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
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
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategories.includes(category)
                                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                                : 'bg-white dark:bg-main-black text-gray-700 dark:text-gray-300 hover:bg-light-gray dark:hover:bg-gray-600'
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
                                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTags.includes(tag)
                                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                                : 'bg-white dark:bg-main-black text-gray-600 dark:text-gray-400 hover:bg-light-gray dark:hover:bg-gray-600'
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
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-bold"
                                    >
                                        <X className="w-4 h-4" />
                                        Reset All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default FilterBar;
