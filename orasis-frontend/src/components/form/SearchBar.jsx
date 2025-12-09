/**
 * SearchBar
 *
 * Komponen input pencarian yang simple dan dapat digunakan di header.
 * - Menavigasi ke halaman hasil pencarian saat Enter ditekan
 * - Props: `value`, `onChange`, `placeholder`, `className`
 */
import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ value, onChange, placeholder = "Search designs...", className = "" }) => {
    const navigate = useNavigate();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-black dark:text-white" />
            </div>
            <input
                type="text"
                className="block w-full xl:w-[25vw] pl-10 pr-3 py-3 border-none rounded-full leading-5 bg-gray-100 dark:bg-dark-gray text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 focus:outline-none focus:bg-light-gray dark:focus:bg-dark-gray sm:text-sm transition-colors duration-200"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchBar;
