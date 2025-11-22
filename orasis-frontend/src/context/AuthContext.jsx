import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const currentUser = authService.getCurrentUser();
            const token = authService.getToken();
            
            if (currentUser && token) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateUser,
        checkAuth
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
