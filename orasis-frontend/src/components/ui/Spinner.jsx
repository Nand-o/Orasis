import React from 'react';

/**
 * Spinner - Loading indicator component
 * @param {string} size - Size of spinner: 'sm', 'md', 'lg', 'xl'
 * @param {string} color - Color variant: 'primary', 'white', 'gray'
 * @param {string} className - Additional CSS classes
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
