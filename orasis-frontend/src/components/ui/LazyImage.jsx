import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage - Image component with lazy loading and placeholder
 * Uses Intersection Observer API to load images only when they enter viewport
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} className - CSS classes for the image
 * @param {string} placeholderSrc - Optional placeholder image (defaults to gradient)
 * @param {function} onLoad - Optional callback when image loads
 * @param {function} onError - Optional callback when image fails to load
 */
const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderSrc = null,
    onLoad = null,
    onError = null,
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const imgRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 2;

    useEffect(() => {
        // Reset state when src changes
        setIsLoading(true);
        setIsError(false);
        setImageSrc(placeholderSrc);
        retryCountRef.current = 0;

        // Create Intersection Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Image is in viewport, start loading
                        loadImage();
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before image enters viewport
                threshold: 0.01
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src]);

    const loadImage = () => {
        const img = new Image();
        img.src = src;

        // Add timeout for slow loading images (15 seconds for Microlink API)
        const timeoutId = setTimeout(() => {
            if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                console.log(`Retrying image load (${retryCountRef.current}/${maxRetries}):`, src);
                loadImage(); // Retry
            } else {
                setIsError(true);
                setIsLoading(false);
                if (onError) onError();
            }
        }, 15000); // 15 second timeout

        img.onload = () => {
            clearTimeout(timeoutId);
            setImageSrc(src);
            setIsLoading(false);
            setIsError(false);
            if (onLoad) onLoad();
        };

        img.onerror = () => {
            clearTimeout(timeoutId);
            if (retryCountRef.current < maxRetries) {
                retryCountRef.current++;
                console.log(`Retrying image load after error (${retryCountRef.current}/${maxRetries}):`, src);
                setTimeout(() => loadImage(), 1000); // Retry after 1 second
            } else {
                setIsError(true);
                setIsLoading(false);
                if (onError) onError();
            }
        };
    };

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Loading placeholder */}
            {isLoading && !isError && (
                <div className="absolute inset-0 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/30 dark:via-white/20 dark:to-white/50 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-300 dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="absolute inset-0 bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-white/30 dark:via-white/20 dark:to-white/50 flex items-center justify-center">
                    <div className="text-center p-4">
                        <svg
                            className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Image unavailable</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Click to view details</p>
                    </div>
                </div>
            )}

            {/* Actual image */}
            <img
                src={imageSrc || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default LazyImage;
