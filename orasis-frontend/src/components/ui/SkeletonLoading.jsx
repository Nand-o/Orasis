import React from 'react';

// Base Skeleton component
export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4', rounded = 'rounded' }) => (
    <div className={`${width} ${height} ${rounded} bg-gray-200 dark:bg-white/5 animate-pulse ${className}`} />
);

// Card Skeleton for Dashboard Overview
export const DashboardCardSkeleton = () => (
    <div className="bg-white dark:bg-dark-gray rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <Skeleton width="w-12" height="h-12" rounded="rounded-lg" />
            <Skeleton width="w-16" height="h-6" rounded="rounded-full" />
        </div>
        <Skeleton width="w-24" height="h-8" className="mb-2" />
        <Skeleton width="w-32" height="h-4" />
    </div>
);

// Table Row Skeleton for Showcases List
export const TableRowSkeleton = ({ columns = 6 }) => (
    <tr className="border-b border-gray-100 dark:border-white/10">
        {[...Array(columns)].map((_, index) => (
            <td key={index} className="px-4 py-4">
                {index === 0 ? (
                    <div className="flex items-center gap-3">
                        <Skeleton width="w-16" height="h-16" rounded="rounded-lg" />
                        <div className="flex-1">
                            <Skeleton width="w-32" height="h-4" className="mb-2" />
                            <Skeleton width="w-24" height="h-3" />
                        </div>
                    </div>
                ) : index === columns - 1 ? (
                    <div className="flex gap-2 justify-end">
                        <Skeleton width="w-8" height="h-8" rounded="rounded-lg" />
                        <Skeleton width="w-8" height="h-8" rounded="rounded-lg" />
                    </div>
                ) : (
                    <Skeleton width="w-20" height="h-4" />
                )}
            </td>
        ))}
    </tr>
);

// Grid Card Skeleton for Collections
export const CollectionCardSkeleton = () => (
    <div className="bg-white dark:bg-dark-gray rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm">
        <Skeleton width="w-full" height="h-48" rounded="rounded-none" />
        <div className="p-4">
            <Skeleton width="w-3/4" height="h-5" className="mb-2" />
            <Skeleton width="w-1/2" height="h-4" className="mb-3" />
            <div className="flex items-center justify-between">
                <Skeleton width="w-16" height="h-4" />
                <Skeleton width="w-8" height="h-8" rounded="rounded-full" />
            </div>
        </div>
    </div>
);

// Pending Review Card Skeleton
export const PendingReviewCardSkeleton = () => (
    <div className="bg-white dark:bg-dark-gray rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex gap-4">
            <Skeleton width="w-32" height="h-32" rounded="rounded-lg" className="shrink-0" />
            <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <Skeleton width="w-48" height="h-6" className="mb-2" />
                        <Skeleton width="w-32" height="h-4" />
                    </div>
                    <Skeleton width="w-20" height="h-6" rounded="rounded-full" />
                </div>
                <Skeleton width="w-full" height="h-4" className="mb-2" />
                <Skeleton width="w-3/4" height="h-4" className="mb-4" />
                <div className="flex gap-2">
                    <Skeleton width="w-24" height="h-9" rounded="rounded-lg" />
                    <Skeleton width="w-24" height="h-9" rounded="rounded-lg" />
                    <Skeleton width="w-24" height="h-9" rounded="rounded-lg" />
                </div>
            </div>
        </div>
    </div>
);

// Analytics Chart Skeleton
export const ChartSkeleton = () => (
    <div className="bg-white dark:bg-dark-gray rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
        <Skeleton width="w-40" height="h-6" className="mb-4" />
        <div className="space-y-3">
            <div className="flex items-end gap-2 h-48">
                {[...Array(7)].map((_, index) => (
                    <Skeleton 
                        key={index} 
                        width="w-full" 
                        height={`h-${Math.floor(Math.random() * 40) + 20}`}
                        rounded="rounded-t-lg" 
                    />
                ))}
            </div>
            <div className="flex justify-between">
                {[...Array(7)].map((_, index) => (
                    <Skeleton key={index} width="w-8" height="h-3" />
                ))}
            </div>
        </div>
    </div>
);

// Stats Card Skeleton for Analytics
export const StatsCardSkeleton = () => (
    <div className="bg-white dark:bg-dark-gray rounded-xl p-6 border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <Skeleton width="w-32" height="h-5" />
            <Skeleton width="w-10" height="h-10" rounded="rounded-lg" />
        </div>
        <Skeleton width="w-24" height="h-8" className="mb-2" />
        <Skeleton width="w-20" height="h-4" />
    </div>
);

// Full Page Loading Skeletons for each page type

export const OverviewPageSkeleton = () => (
    <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-dark-gray rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-white/10">
                <Skeleton width="w-48" height="h-6" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-100 dark:border-white/10">
                        <tr>
                            {[...Array(5)].map((_, index) => (
                                <th key={index} className="px-4 py-3 text-left">
                                    <Skeleton width="w-20" height="h-4" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <TableRowSkeleton key={index} columns={5} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export const ShowcasesPageSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <Skeleton width="w-48" height="h-8" />
            <Skeleton width="w-32" height="h-10" rounded="rounded-lg" />
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
            <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
            <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
            <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
        </div>
        
        {/* Table */}
        <div className="bg-white dark:bg-dark-gray rounded-xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                        <tr>
                            {[...Array(6)].map((_, index) => (
                                <th key={index} className="px-4 py-3 text-left">
                                    <Skeleton width="w-24" height="h-4" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(8)].map((_, index) => (
                            <TableRowSkeleton key={index} columns={6} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export const PendingReviewPageSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <Skeleton width="w-48" height="h-8" className="mb-2" />
                <Skeleton width="w-64" height="h-4" />
            </div>
            <Skeleton width="w-32" height="h-10" rounded="rounded-lg" />
        </div>
        
        {/* Pending Cards */}
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <PendingReviewCardSkeleton key={index} />
            ))}
        </div>
    </div>
);

export const AnalyticsPageSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <Skeleton width="w-48" height="h-8" />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
        </div>
        
        {/* Additional Chart */}
        <ChartSkeleton />
    </div>
);

export const CollectionsPageSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <Skeleton width="w-48" height="h-8" />
            <Skeleton width="w-40" height="h-10" rounded="rounded-lg" />
        </div>
        
        {/* Search */}
        <Skeleton width="w-full" height="h-12" rounded="rounded-lg" />
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
                <CollectionCardSkeleton key={index} />
            ))}
        </div>
    </div>
);

export const ShowcaseFormPageSkeleton = () => (
    <div className="min-h-screen bg-white dark:bg-main-black py-12">
        <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
                <Skeleton width="w-40" height="h-6" className="mb-4" />
                <Skeleton width="w-64" height="h-8" className="mb-2" />
                <Skeleton width="w-96" height="h-5" />
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-dark-gray rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                {/* Image Upload Section */}
                <div>
                    <Skeleton width="w-32" height="h-5" className="mb-2" />
                    <div className="aspect-video rounded-xl bg-gray-200 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center">
                        <Skeleton width="w-48" height="h-12" rounded="rounded-lg" />
                    </div>
                </div>

                {/* Logo Upload Section */}
                <div>
                    <Skeleton width="w-32" height="h-5" className="mb-2" />
                    <div className="w-32 h-32 rounded-xl bg-gray-200 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center">
                        <Skeleton width="w-16" height="h-16" rounded="rounded-lg" />
                    </div>
                </div>

                {/* Title Input */}
                <div>
                    <Skeleton width="w-24" height="h-5" className="mb-2" />
                    <Skeleton width="w-full" height="h-12" rounded="rounded-xl" />
                </div>

                {/* URL Input */}
                <div>
                    <Skeleton width="w-32" height="h-5" className="mb-2" />
                    <Skeleton width="w-full" height="h-12" rounded="rounded-xl" />
                </div>

                {/* Category Dropdown */}
                <div>
                    <Skeleton width="w-24" height="h-5" className="mb-2" />
                    <Skeleton width="w-full" height="h-12" rounded="rounded-xl" />
                </div>

                {/* Description Textarea */}
                <div>
                    <Skeleton width="w-32" height="h-5" className="mb-2" />
                    <Skeleton width="w-full" height="h-32" rounded="rounded-xl" />
                </div>

                {/* Tags Section */}
                <div>
                    <Skeleton width="w-40" height="h-5" className="mb-3" />
                    <div className="flex flex-wrap gap-2">
                        {[...Array(8)].map((_, index) => (
                            <Skeleton 
                                key={index} 
                                width="w-20" 
                                height="h-9" 
                                rounded="rounded-full" 
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
                    <Skeleton width="w-24" height="h-12" rounded="rounded-xl" />
                    <Skeleton width="w-32" height="h-12" rounded="rounded-xl" />
                </div>
            </div>
        </div>
    </div>
);

export default {
    Skeleton,
    DashboardCardSkeleton,
    TableRowSkeleton,
    CollectionCardSkeleton,
    PendingReviewCardSkeleton,
    ChartSkeleton,
    StatsCardSkeleton,
    OverviewPageSkeleton,
    ShowcasesPageSkeleton,
    PendingReviewPageSkeleton,
    AnalyticsPageSkeleton,
    CollectionsPageSkeleton,
    ShowcaseFormPageSkeleton
};
