import api from './api';

const authService = {
    // ===== REGISTER =====
    async register(userData) {
        try {
            const response = await api.post('/register', userData);
            
            // Registration does NOT auto-login
            // User must login manually after successful registration
            // This is better for security and user awareness
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== LOGIN =====
    async login(credentials) {
        try {
            console.log('🔐 Attempting login with:', credentials.email);
            const response = await api.post('/login', credentials);
            console.log('✅ Login response:', response.data);
            
            // Save token and user data to localStorage
            const token = response.data.access_token || response.data.token;
            console.log('🎫 Token received:', token ? 'Yes' : 'No');
            
            if (token) {
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('💾 Saved to localStorage - User:', response.data.user.name);
            }
            
            return response.data;
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('Error details:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // ===== LOGOUT =====
    async logout() {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local cleanup even if API call fails
        } finally {
            // Always clear local storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    // ===== GET CURRENT USER =====
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    },

    // ===== GET TOKEN =====
    getToken() {
        return localStorage.getItem('auth_token');
    },

    // ===== CHECK IF AUTHENTICATED =====
    isAuthenticated() {
        return !!this.getToken();
    },

    // ===== GET USER PROFILE =====
    async getProfile() {
        try {
            const response = await api.get('/user/profile');
            
            // Update local storage with fresh data
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ===== GET CURRENT USER FROM API =====
    async getCurrentUserFromAPI() {
        try {
            const response = await api.get('/user');
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService;
