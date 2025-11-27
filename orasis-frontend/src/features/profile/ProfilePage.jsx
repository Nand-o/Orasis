import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import userService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Tab State
    const [activeTab, setActiveTab] = useState('profile');

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Password visibility state
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // UI State
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [profileFieldErrors, setProfileFieldErrors] = useState({});
    const [passwordFieldErrors, setPasswordFieldErrors] = useState({});

    // Load user data on mount
    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    // Validate Profile Form
    const validateProfileForm = () => {
        const errors = {};
        
        if (!profileForm.name) {
            errors.name = 'Name is required';
        } else if (profileForm.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }
        
        if (!profileForm.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        setProfileFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle Profile Update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateProfileForm()) {
            return;
        }
        
        setIsLoadingProfile(true);
        setProfileMessage({ type: '', text: '' });

        try {
            const response = await userService.updateProfile(profileForm);
            if (response.data) {
                updateUser(response.data); // Update user data in AuthContext
            }
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setProfileMessage({
                type: 'error',
                text: error.message || 'Failed to update profile',
            });
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Validate Password Form
    const validatePasswordForm = () => {
        const errors = {};
        
        if (!passwordForm.current_password) {
            errors.current_password = 'Current password is required';
        }
        
        if (!passwordForm.password) {
            errors.password = 'New password is required';
        } else if (passwordForm.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.password)) {
            errors.password = 'Password must contain uppercase, lowercase, and number';
        }
        
        if (!passwordForm.password_confirmation) {
            errors.password_confirmation = 'Password confirmation is required';
        } else if (passwordForm.password !== passwordForm.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match';
        }
        
        setPasswordFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle Password Change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) {
            return;
        }
        
        setIsLoadingPassword(true);
        setPasswordMessage({ type: '', text: '' });

        try {
            console.log('🔐 Sending password change request:', passwordForm);
            await userService.changePassword(passwordForm);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            // Clear form
            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (error) {
            console.error('Password change error:', error);
            console.error('Error response:', error.response);
            
            // Handle validation errors
            let errorMessage = 'Failed to change password';
            if (error.response?.data?.errors) {
                // Laravel validation errors
                const errors = Object.values(error.response.data.errors).flat();
                errorMessage = errors.join(', ');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setPasswordMessage({
                type: 'error',
                text: errorMessage,
            });
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </motion.div>

            {/* Tabs */}
            <motion.div
                className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'profile'
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Profile Information
                    {activeTab === 'profile' && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                            layoutId="activeProfileTab"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'password'
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    Change Password
                    {activeTab === 'password' && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                            layoutId="activeProfileTab"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            {/* Message */}
                            {profileMessage.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl ${
                                        profileMessage.type === 'success'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                    }`}
                                >
                                    {profileMessage.text}
                                </motion.div>
                            )}

                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => {
                                            setProfileForm({ ...profileForm, name: e.target.value });
                                            setProfileFieldErrors(prev => ({ ...prev, name: '' }));
                                        }}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                                            profileFieldErrors.name 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500'
                                        } rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white`}
                                        required
                                        minLength={3}
                                    />
                                </div>
                                {profileFieldErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{profileFieldErrors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(e) => {
                                            setProfileForm({ ...profileForm, email: e.target.value });
                                            setProfileFieldErrors(prev => ({ ...prev, email: '' }));
                                        }}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                                            profileFieldErrors.email 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500'
                                        } rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white`}
                                        required
                                    />
                                </div>
                                {profileFieldErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">{profileFieldErrors.email}</p>
                                )}
                            </div>

                            {/* Role (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={user?.role || 'User'}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoadingProfile}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingProfile ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            {/* Message */}
                            {passwordMessage.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl ${
                                        passwordMessage.type === 'success'
                                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                    }`}
                                >
                                    {passwordMessage.text}
                                </motion.div>
                            )}

                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordForm.current_password}
                                        onChange={(e) => {
                                            setPasswordForm({ ...passwordForm, current_password: e.target.value });
                                            setPasswordFieldErrors(prev => ({ ...prev, current_password: '' }));
                                        }}
                                        className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                                            passwordFieldErrors.current_password 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500'
                                        } rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordFieldErrors.current_password && (
                                    <p className="text-red-500 text-sm mt-1">{passwordFieldErrors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordForm.password}
                                        onChange={(e) => {
                                            setPasswordForm({ ...passwordForm, password: e.target.value });
                                            setPasswordFieldErrors(prev => ({ ...prev, password: '' }));
                                        }}
                                        className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                                            passwordFieldErrors.password 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500'
                                        } rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white`}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordFieldErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{passwordFieldErrors.password}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Min 8 characters, must include uppercase, lowercase, and number
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password *
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordForm.password_confirmation}
                                        onChange={(e) => {
                                            setPasswordForm({ ...passwordForm, password_confirmation: e.target.value });
                                            setPasswordFieldErrors(prev => ({ ...prev, password_confirmation: '' }));
                                        }}
                                        className={`w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border ${
                                            passwordFieldErrors.password_confirmation 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500'
                                        } rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordFieldErrors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">{passwordFieldErrors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoadingPassword}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingPassword ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        Changing Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
