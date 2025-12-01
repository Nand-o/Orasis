import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        document.title = 'Register | Orasis';
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
        // Clear field error when user types
        setFieldErrors({
            ...fieldErrors,
            [e.target.name]: ''
        });
    };

    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain uppercase, lowercase, and number';
        }

        // Password confirmation
        if (!formData.password_confirmation) {
            errors.password_confirmation = 'Please confirm your password';
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError('Please fix the errors below');
            setLoading(false);
            return;
        }

        try {
            await register(formData);

            // Show success message
            setSuccess(true);
            showToast('Account created successfully! Redirecting to login...', 'success');

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Account created successfully! Please login with your credentials.'
                    }
                });
            }, 2000);
        } catch (err) {
            console.error('❌ Registration error:', err);
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Floating Animation Variants
    const floatTransition = {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-blue-200 flex items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
            {/* Background Glow Effects (Dark Mode Only) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-300/20 rounded-full blur-[120px] hidden dark:block" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[120px] hidden dark:block" />

            {/* Background Elements (Light Mode) */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:hidden opacity-50" />

            {/* Decorative Floating Elements (Desktop Only) */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block max-w-7xl mx-auto">
                {/* Left Side Elements */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -15 }}
                    transition={floatTransition}
                    className="absolute left-10 top-1/3 p-4 bg-white dark:bg-blue-200/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-none"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gray-200 dark:bg-blue-50/20 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-blue-50 rounded-full shadow-sm" />
                        </div>
                        <div className="h-2 w-16 bg-gray-200 dark:bg-blue-50/20 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 20 }}
                    transition={{ ...floatTransition, delay: 1 }}
                    className="absolute left-20 bottom-1/4 p-3 bg-white dark:bg-blue-200/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-xl shadow-lg dark:shadow-none"
                >
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-blue-50/30" />
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-blue-50/30" />
                        <div className="w-2 h-2 rounded-full bg-violet-500 dark:bg-violet-300" />
                    </div>
                </motion.div>

                {/* Right Side Elements */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -20 }}
                    transition={{ ...floatTransition, delay: 0.5 }}
                    className="absolute right-10 top-1/4 p-4 bg-white dark:bg-blue-200/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-none"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <div className="h-2 w-20 bg-gray-200 dark:bg-blue-50/20 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 15 }}
                    transition={{ ...floatTransition, delay: 1.5 }}
                    className="absolute right-24 bottom-1/3 p-4 bg-white dark:bg-blue-200/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-none"
                >
                    <div className="space-y-2">
                        <div className="h-2 w-24 bg-gray-200 dark:bg-blue-50/20 rounded-full" />
                        <div className="h-2 w-16 bg-gray-200 dark:bg-blue-50/20 rounded-full opacity-60" />
                    </div>
                </motion.div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Register Card */}
                <div className="bg-white dark:bg-blue-200/50 backdrop-blur-md border border-gray-200 dark:border-violet-300/30 rounded-2xl shadow-xl dark:shadow-[0_0_40px_rgba(87,36,255,0.15)] p-8 transition-all duration-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <img
                            src="/logo-black.svg"
                            alt="Orasis Logo"
                            className="h-12 mx-auto mb-6 dark:hidden transition-opacity duration-300 border border-black dark:border-white rounded-lg"
                        />
                        <img
                            src="/logo-white.svg"
                            alt="Orasis Logo"
                            className="h-12 mx-auto mb-6 hidden dark:block transition-opacity duration-300 border border-black dark:border-white rounded-lg"
                        />

                        <h1 className="text-4xl font-family-zentry text-gray-900 dark:text-blue-50 mb-2 tracking-wide transition-colors">
                            Create Account
                        </h1>
                        <p className="font-family-circular-web text-gray-500 dark:text-blue-50/60 transition-colors">
                            Join Orasis community today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
                                <p className="text-green-700 dark:text-green-400 text-sm font-family-circular-web">
                                    ✅ Account created successfully! Redirecting to login page...
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4">
                                <p className="text-red-700 dark:text-red-400 text-sm font-family-circular-web">
                                    ❌ {error}
                                </p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-family-general uppercase tracking-wider text-gray-500 dark:text-blue-50/80 mb-2 transition-colors">
                                Full Name
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-blue-50/5 border ${fieldErrors.name
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-300'
                                        } text-gray-900 dark:text-blue-50 placeholder-gray-400 dark:placeholder-blue-50/20 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-300 transition-all duration-300 font-family-circular-web`}
                                    placeholder="Suzumiya Haruhi"
                                />
                                <div className="absolute inset-0 rounded-lg bg-violet-500/5 dark:bg-violet-300/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {fieldErrors.name && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-family-circular-web">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-family-general uppercase tracking-wider text-gray-500 dark:text-blue-50/80 mb-2 transition-colors">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-blue-50/5 border ${fieldErrors.email
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-300'
                                        } text-gray-900 dark:text-blue-50 placeholder-gray-400 dark:placeholder-blue-50/20 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-300 transition-all duration-300 font-family-circular-web`}
                                    placeholder="your@email.com"
                                />
                                <div className="absolute inset-0 rounded-lg bg-violet-500/5 dark:bg-violet-300/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-family-circular-web">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-family-general uppercase tracking-wider text-gray-500 dark:text-blue-50/80 mb-2 transition-colors">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-blue-50/5 border ${fieldErrors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-300'
                                        } text-gray-900 dark:text-blue-50 placeholder-gray-400 dark:placeholder-blue-50/20 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-300 transition-all duration-300 font-family-circular-web`}
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-0 rounded-lg bg-violet-500/5 dark:bg-violet-300/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-family-circular-web">{fieldErrors.password}</p>
                            )}
                            <p className="mt-1 text-[10px] text-gray-400 dark:text-blue-50/40 font-family-circular-web">
                                Min 8 characters, must include uppercase, lowercase, and number
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="password_confirmation" className="block text-xs font-family-general uppercase tracking-wider text-gray-500 dark:text-blue-50/80 mb-2 transition-colors">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-blue-50/5 border ${fieldErrors.password_confirmation
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-300'
                                        } text-gray-900 dark:text-blue-50 placeholder-gray-400 dark:placeholder-blue-50/20 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:focus:ring-violet-300 transition-all duration-300 font-family-circular-web`}
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-0 rounded-lg bg-violet-500/5 dark:bg-violet-300/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {fieldErrors.password_confirmation && (
                                <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-family-circular-web">{fieldErrors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 rounded-lg bg-violet-600 dark:bg-violet-300 hover:bg-violet-700 dark:hover:bg-violet-300/90 text-white dark:text-black font-family-general uppercase tracking-widest font-bold shadow-lg shadow-violet-200 dark:shadow-[0_0_10px_rgba(87,36,255,0.2)] hover:shadow-violet-300 dark:hover:shadow-[0_0_20px_rgba(87,36,255,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-4 bg-white dark:bg-blue-200 text-gray-500 dark:text-blue-50/40 font-family-general tracking-widest transition-colors">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <button className="flex items-center justify-center py-2.5 rounded-lg bg-gray-50 dark:bg-blue-50/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-blue-50/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group">
                            <FaGoogle className="text-gray-600 dark:text-blue-50/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                        <button className="flex items-center justify-center py-2.5 rounded-lg bg-gray-50 dark:bg-blue-50/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-blue-50/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group">
                            <FaApple className="text-gray-600 dark:text-blue-50/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                        <button className="flex items-center justify-center py-2.5 rounded-lg bg-gray-50 dark:bg-blue-50/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-blue-50/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group">
                            <FaFacebook className="text-gray-600 dark:text-blue-50/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-blue-50/60 font-family-circular-web transition-colors">
                            Already have an account?{' '}
                            <Link to="/login" className="text-violet-600 dark:text-violet-300 hover:text-violet-700 dark:hover:text-violet-200 font-semibold transition-colors">
                                Login
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-xs text-gray-400 dark:text-blue-50/40 hover:text-gray-600 dark:hover:text-blue-50/80 transition-colors font-family-circular-web uppercase tracking-wider"
                        >
                            ← Back to Landing Page
                        </Link>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default RegisterPage;
