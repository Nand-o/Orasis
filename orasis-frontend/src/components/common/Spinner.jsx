import React from 'react';

/**
 * Spinner
 *
 * Indikator loading sederhana yang mendukung beberapa ukuran dan varian
 * warna. Digunakan pada tombol, proses async, atau komponen yang membutuhkan
 * penanda status pemuatan.
 *
 * Props:
 * - `size` (string): 'sm'|'md'|'lg'|'xl'
 * - `color` (string): 'primary'|'white'|'gray'
 * - `className` (string)
 */
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4'
    };

    const colorClasses = {
        primary: 'border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400',
        white: 'border-white/30 border-t-white',
        gray: 'border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300'
    };

    return (
        <div
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
