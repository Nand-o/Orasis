/**
 * Cache Manager Utility
 * Manages sessionStorage cache for showcases data
 */

const CACHE_KEYS = {
    SHOWCASES: 'showcases_cache',
    SHOWCASES_TIME: 'showcases_cache_time',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheManager = {
    /**
     * Get cached showcases data
     * @returns {Array|null} Cached data or null if expired/not found
     */
    getShowcases() {
        try {
            const cachedData = sessionStorage.getItem(CACHE_KEYS.SHOWCASES);
            const cacheTime = sessionStorage.getItem(CACHE_KEYS.SHOWCASES_TIME);
            
            if (!cachedData || !cacheTime) {
                return null;
            }

            const now = Date.now();
            const age = now - parseInt(cacheTime);

            // Check if cache is still valid
            if (age > CACHE_DURATION) {
                this.clearShowcases();
                return null;
            }

            return JSON.parse(cachedData);
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    },

    /**
     * Set showcases cache
     * @param {Array} data - Showcases data to cache
     */
    setShowcases(data) {
        try {
            sessionStorage.setItem(CACHE_KEYS.SHOWCASES, JSON.stringify(data));
            sessionStorage.setItem(CACHE_KEYS.SHOWCASES_TIME, Date.now().toString());
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    },

    /**
     * Clear showcases cache
     */
    clearShowcases() {
        try {
            sessionStorage.removeItem(CACHE_KEYS.SHOWCASES);
            sessionStorage.removeItem(CACHE_KEYS.SHOWCASES_TIME);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    },

    /**
     * Clear all caches
     */
    clearAll() {
        try {
            sessionStorage.clear();
        } catch (error) {
            console.error('Error clearing all cache:', error);
        }
    },

    /**
     * Check if cache exists and is valid
     * @returns {boolean}
     */
    hasValidCache() {
        const cachedData = sessionStorage.getItem(CACHE_KEYS.SHOWCASES);
        const cacheTime = sessionStorage.getItem(CACHE_KEYS.SHOWCASES_TIME);
        
        if (!cachedData || !cacheTime) {
            return false;
        }

        const now = Date.now();
        const age = now - parseInt(cacheTime);
        
        return age <= CACHE_DURATION;
    }
};

export default cacheManager;
