import React from 'react';

/**
 * ShowcaseCardSkeleton - Skeleton loader for showcase cards
 */
export const ShowcaseCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800"></div>
            
            {/* Content skeleton */}
            <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                
                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                </div>
                
                {/* Tags */}
                <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
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
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="space-y-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                
                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                
                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                </div>
                
                {/* Count */}
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
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
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full" style={{ width: `${Math.random() * 40 + 80}px` }}></div>
        </div>
    );
};

/**
 * PageLoader - Full page loading overlay
 */
export const PageLoader = () => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
            </div>
        </div>
    );
};
