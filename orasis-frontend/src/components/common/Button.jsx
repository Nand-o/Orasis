import React from 'react';
import Spinner from './Spinner';

/**
 * Button
 *
 * Komponen tombol serbaguna dengan state loading dan beberapa variasi
 * style (primary, secondary, danger, ghost). Digunakan di banyak form
 * dan UI kontrol.
 *
 * Props:
 * - `children` (React.ReactNode)
 * - `isLoading` (boolean)
 * - `disabled` (boolean)
 * - `variant` (string): 'primary'|'secondary'|'danger'|'ghost'|'black'
 * - `size` (string): 'sm'|'md'|'lg'
 * - `className` (string)
 * - `onClick` (function)
 * - `type` (string): 'button'|'submit'|'reset'
 */
const Button = ({
    children,
    isLoading = false,
    disabled = false,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400 dark:hover:bg-gray-800 dark:text-gray-300',
        black: 'bg-black hover:bg-gray-800 text-white focus:ring-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:text-black'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5'
    };

    const isDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {isLoading && (
                <Spinner 
                    size={size === 'sm' ? 'sm' : 'sm'} 
                    color={variant === 'secondary' || variant === 'ghost' ? 'gray' : 'white'} 
                />
            )}
            {children}
        </button>
    );
};

export default Button;
