import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(formData);
            // Redirect to home or previous page
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Login to your Orasis account
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-800 dark:text-red-200 text-sm">
                                    ❌ {error}
                                </p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                Don't have an account?
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link
                        to="/register"
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Create Account
                    </Link>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Test Credentials */}
                <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm mb-2">
                        🔑 Test Credentials
                    </h4>
                    <div className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                        <p><strong>Admin:</strong> admin@orasis.com / <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">admin123</code></p>
                        <p><strong>User:</strong> faris@orasis.com / <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">password</code></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
