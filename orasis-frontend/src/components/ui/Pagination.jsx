/**
 * Pagination
 *
 * Komponen navigasi pagination reusable.
 * Props penting:
 * - `currentPage` (number): halaman saat ini
 * - `totalPages` (number): total halaman
 * - `onPageChange` (function): callback saat pindah halaman
 * - `itemsPerPage` (number)
 * - `totalItems` (number)
 *
 * Menampilkan kontrol halaman untuk desktop dan indicator sederhana untuk mobile.
 */
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange,
    itemsPerPage = 12,
    totalItems = 0
}) => {
    const pages = [];
    const maxVisiblePages = 5;

    // Calculate page range to display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            {/* Items info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-2">
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                1
                            </button>
                            {startPage > 2 && (
                                <span className="text-gray-500 dark:text-gray-500">...</span>
                            )}
                        </>
                    )}

                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                                page === currentPage
                                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && (
                                <span className="text-gray-500 dark:text-gray-500">...</span>
                            )}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile: Current page indicator */}
                <div className="sm:hidden px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {currentPage} / {totalPages}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
