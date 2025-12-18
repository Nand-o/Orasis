import React from 'react';

/**
 * ShowcaseCardSkeleton - Skeleton loader for showcase cards
 */
export const ShowcaseCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-dark-gray rounded-2xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-64 bg-gray-200 dark:bg-white/5"></div>

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-5/6"></div>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-white/5 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-white/5 rounded-full"></div>
                    <div className="h-6 w-14 bg-gray-200 dark:bg-white/5 rounded-full"></div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/5"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-white/5 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-white/5 rounded"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * TableRowSkeleton - Skeleton loader for table rows
 */
export const TableRowSkeleton = ({ columns = 5 }) => {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, index) => (
                <td key={index} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-dark-gray rounded w-3/4"></div>
                </td>
            ))}
        </tr>
    );
};

/**
 * CollectionCardSkeleton - Skeleton loader for collection cards
 */
export const CollectionCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-dark-gray rounded-2xl p-6 border border-gray-200 dark:border-white/10 animate-pulse">
            <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-200 dark:bg-white/5 rounded-xl"></div>

                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-white/5 rounded w-2/3"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-4/5"></div>
                </div>

                {/* Count */}
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/3"></div>
            </div>
        </div>
    );
};

/**
 * BadgeSkeleton - Skeleton loader for badge/tag items
 */
export const BadgeSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-dark-gray rounded-full" style={{ width: `${Math.random() * 40 + 80}px` }}></div>
        </div>
    );
};

/**
 * ShowcaseDetailSkeleton - Skeleton loader for showcase detail page
 */
export const ShowcaseDetailSkeleton = () => {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 bg-gray-200 dark:bg-dark-gray rounded w-1/3"></div>
                <div className="flex space-x-2">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-dark-gray rounded-lg"></div>
                    <div className="w-10 h-10 bg-gray-200 dark:bg-dark-gray rounded-lg"></div>
                </div>
            </div>

            {/* Two Column Layout: Sidebar + Image */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    {/* Visit Website Button */}
                    <div className="h-10 bg-gray-200 dark:bg-dark-gray rounded-lg w-full"></div>

                    {/* Metadata Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        {/* Views */}
                        <div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/3 mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-dark-gray rounded w-1/2"></div>
                        </div>

                        {/* Published */}
                        <div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/3 mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-dark-gray rounded w-3/4"></div>
                        </div>

                        {/* Category */}
                        <div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/3 mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-dark-gray rounded w-2/3"></div>
                        </div>

                        {/* Created by */}
                        <div>
                            <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/3 mb-2"></div>
                            <div className="h-5 bg-gray-200 dark:bg-dark-gray rounded w-3/4"></div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/4 mb-2"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-7 bg-gray-200 dark:bg-dark-gray rounded-full w-16"></div>
                            <div className="h-7 bg-gray-200 dark:bg-dark-gray rounded-full w-20"></div>
                            <div className="h-7 bg-gray-200 dark:bg-dark-gray rounded-full w-14"></div>
                            <div className="h-7 bg-gray-200 dark:bg-dark-gray rounded-full w-18"></div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Image Skeleton */}
                <div className="flex justify-end">
                    <div className="bg-gray-200 dark:bg-dark-gray rounded-xl w-full h-[70vh] max-h-[85vh]"></div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mt-12 max-w-3xl space-y-4">
                <div className="h-7 bg-gray-200 dark:bg-dark-gray rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-dark-gray rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-dark-gray rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-dark-gray rounded w-4/5"></div>
                </div>
            </div>

            {/* Similar Websites Section */}
            <div className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">
                <div className="h-8 bg-gray-200 dark:bg-dark-gray rounded w-1/5 mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="space-y-4">
                            {/* Card Image */}
                            <div className="relative aspect-4/3 bg-gray-200 dark:bg-dark-gray rounded-3xl overflow-hidden p-12 py-16">
                                <div className="w-full h-full bg-gray-300 dark:bg-main-black rounded-lg"></div>
                            </div>
                            {/* Card Content */}
                            <div className="flex items-center space-x-3 px-1">
                                <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-dark-gray shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-dark-gray rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-dark-gray rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * PageLoader - Full page loading overlay
 */
export const PageLoader = () => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-main-black z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
            </div>
        </div>
    );
};
