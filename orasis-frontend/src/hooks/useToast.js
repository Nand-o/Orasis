import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({
            isVisible: true,
            message,
            type
        });

        setTimeout(() => {
            setToast(prev => ({ ...prev, isVisible: false }));
        }, duration);
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }, []);

    return {
        toast,
        showToast,
        hideToast
    };
};
