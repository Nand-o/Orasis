import React, { useState, useEffect } from 'react';
import {
    User, Shield, Settings,
    LogOut, HelpCircle, Trash2, ChevronDown, Camera, Lock, Mail, MapPin, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import CircularImageCropper from '../../components/ui/CircularImageCropper';
import DeleteAccountModal from '../../components/ui/DeleteAccountModal';

const ProfilePageNew = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    // Profile Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    // Profile Picture State
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const [toggles, setToggles] = useState({
        darkMode: true,
        emailNotif: false,
        twoFactor: true
    });

    const [activeTab, setActiveTab] = useState('Profile');

    // Load user data on mount
    useEffect(() => {
        document.title = 'Profile Settings | Orasis';
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (profileFieldErrors[name]) {
            setProfileFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (passwordFieldErrors[name]) {
            setPasswordFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle Profile Picture Selection
    const handleProfilePictureSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setProfileMessage({ type: 'error', text: 'Image size should be less than 5MB' });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePicturePreview(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Profile Picture Crop
    const handleCropComplete = (croppedFile, previewUrl) => {
        setProfilePicture(croppedFile);
        setProfilePicturePreview(previewUrl);
        setShowCropper(false);
    };

    // Validate Profile Form
    const validateProfileForm = () => {
        const errors = {};
        
        if (!formData.name) {
            errors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }
        
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
            // Use FormData if profile picture is present
            if (profilePicture) {
                const formDataObj = new FormData();
                formDataObj.append('_method', 'PUT');
                formDataObj.append('name', formData.name);
                formDataObj.append('email', formData.email);
                formDataObj.append('profile_picture', profilePicture);
                
                const response = await userService.updateProfileWithFile(formDataObj);
                if (response.data) {
                    updateUser(response.data);
                }
            } else {
                const response = await userService.updateProfile(formData);
                if (response.data) {
                    updateUser(response.data);
                }
            }
            
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            setProfilePicture(null);
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
            await userService.changePassword(passwordForm);
            setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (error) {
            let errorMessage = 'Failed to change password';
            if (error.response?.data?.errors) {
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

    // Handle Logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Handle Delete Account
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await userService.deleteAccount();
            // Logout and clear all user data
            logout();
            // Close modal
            setShowDeleteModal(false);
            // Redirect to landing page
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Failed to delete account:', error);
            
            let errorMessage = 'Failed to delete account. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
            setIsDeleting(false);
        }
    };

    const navItems = [
        { icon: User, label: 'Profile' },
        { icon: Shield, label: 'Security' },
        { icon: Settings, label: 'Preferences' },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-main-black text-main-black dark:text-white font-family-general flex flex-col items-center p-4 md:p-8 pt-24 transition-colors duration-300">
            <div className="w-full max-w-5xl flex flex-col gap-8">

                {/* Header Card */}
                <div className="relative rounded-xl p-8 flex flex-col md:flex-row items-center justify-between mb-2 bg-white dark:bg-dark-gray border border-gray-100 dark:border-dark-gray overflow-hidden shadow-sm">
                    {/* Decorative Blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-300/10 dark:bg-yellow-300/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                        <div className="relative group">
                            <div className="w-20 h-20 rounded-full p-1 border-2 border-violet-300 dark:border-yellow-300">
                                <img
                                    src={profilePicturePreview || user?.profile_picture_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                                    className="w-full h-full rounded-full object-cover"
                                    alt="User Avatar"
                                />
                            </div>
                            <label htmlFor="profile-picture-input" className="absolute bottom-0 right-0 p-2 bg-violet-300 dark:bg-yellow-300 text-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                <Camera className="w-4 h-4" />
                                <input
                                    id="profile-picture-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-xl font-black mb-1 tracking-tight">
                                {user?.name || 'Guest User'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                {user?.email || 'guest@orasis.design'}
                            </p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-violet-100 dark:bg-yellow-300/10 text-violet-600 dark:text-yellow-300 text-xs font-bold uppercase tracking-wider">
                                {user?.role || 'Member'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 md:mt-0 w-full md:w-auto justify-end relative z-10">
                        <button 
                            onClick={() => navigate('/help')}
                            className="p-3 rounded-xl bg-white dark:bg-black/20 text-main-black dark:text-white hover:text-violet-300 dark:hover:text-yellow-300 transition-all cursor-pointer"
                        >
                            <HelpCircle className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-black/20 text-main-black dark:text-white hover:text-red-500 dark:hover:text-red-500 transition-all font-medium text-sm cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="sticky top-24 bg-white dark:bg-dark-gray rounded-xl p-4 flex flex-col gap-2 border border-gray-100 dark:border-dark-gray shadow-sm">
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => setActiveTab(item.label)}
                                    className={`
                                        flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 w-full text-left
                                        ${activeTab === item.label
                                            ? 'bg-violet-300 dark:bg-yellow-300 text-white dark:text-black shadow-md transform scale-[1.02]'
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white cursor-pointer'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.label ? 'text-white dark:text-main-black' : 'text-gray-400'}`} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 space-y-8">

                        {/* Profile Information Section */}
                        {activeTab === 'Profile' && (
                            <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-dark-gray rounded-xl p-8 border border-gray-100 dark:border-dark-gray shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-violet-300 to-violet-300/50 dark:from-yellow-300 dark:to-yellow-300/50" />

                                {/* Success/Error Message */}
                                {profileMessage.text && (
                                    <div className={profileMessage.type === 'success' ? 'mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}>
                                        {profileMessage.text}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-base font-black uppercase tracking-tight mb-1">Personal Information</h2>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs">Update your personal details here.</p>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isLoadingProfile}
                                        className="px-6 py-2.5 rounded-sm bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black font-bold text-sm shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        icon={User}
                                        placeholder="Your Name"
                                        error={profileFieldErrors.name}
                                    />
                                    <InputField
                                        label="Email Address"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        icon={Mail}
                                        placeholder="email@example.com"
                                        error={profileFieldErrors.email}
                                    />
                                </div>
                            </form>
                        )}

                        {/* Preferences Section - Shown in Profile Tab */}
                        {activeTab === 'Profile' && (
                            <div className="bg-white dark:bg-dark-gray rounded-xl p-8 border border-gray-100 dark:border-dark-gray shadow-sm">
                                <h2 className="text-base font-black uppercase tracking-tight mb-6">Preferences</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <ToggleItem
                                        label="Dark Mode"
                                        desc="Toggle dark theme appearance"
                                        checked={toggles.darkMode}
                                        onChange={() => handleToggle('darkMode')}
                                    />
                                    <ToggleItem
                                        label="Email Notifications"
                                        desc="Receive updates via email"
                                        checked={toggles.emailNotif}
                                        onChange={() => handleToggle('emailNotif')}
                                    />

                                    {/* Language Select */}
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-900 dark:text-white">Language</label>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">System language</span>
                                        </div>
                                        <div className="relative">
                                            <select className="appearance-none rounded-xl bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 pl-4 pr-10 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 cursor-pointer transition-all">
                                                <option>English</option>
                                                <option>Bahasa Indonesia</option>
                                                <option>Bahasa Gaul</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone - Shown in Profile Tab */}
                        {activeTab === 'Profile' && (
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-100 dark:border-red-900/20">
                                <h2 className="text-base font-black uppercase tracking-tight mb-3 text-red-500 dark:text-red-500">Danger Zone</h2>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Delete your account and all associated data.</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This action cannot be undone.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-6 py-2.5 rounded-xl bg-white dark:bg-dark-gray text-red-500 dark:text-red-500 font-bold text-sm border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/40 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Section */}
                        {activeTab === 'Security' && (
                            <div className="bg-white dark:bg-dark-gray rounded-xl p-8 border border-gray-100 dark:border-dark-gray shadow-sm">
                                <h2 className="text-base font-black uppercase tracking-tight mb-6">Security Settings</h2>
                                
                                {/* Password Change Form */}
                                <form onSubmit={handlePasswordSubmit} className="space-y-6 mb-6">
                                    {/* Success/Error Message */}
                                    {passwordMessage.text && (
                                        <div className={passwordMessage.type === 'success' ? 'p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}>
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="p-4 rounded-sm bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-dark-gray space-y-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-yellow-300/10 text-violet-600 dark:text-yellow-300">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm">Change Password</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Update your password regularly for security</p>
                                            </div>
                                        </div>

                                        <PasswordField
                                            label="Current Password"
                                            name="current_password"
                                            value={passwordForm.current_password}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.current}
                                            onToggleShow={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            error={passwordFieldErrors.current_password}
                                        />

                                        <PasswordField
                                            label="New Password"
                                            name="password"
                                            value={passwordForm.password}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.new}
                                            onToggleShow={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            error={passwordFieldErrors.password}
                                        />

                                        <PasswordField
                                            label="Confirm New Password"
                                            name="password_confirmation"
                                            value={passwordForm.password_confirmation}
                                            onChange={handlePasswordChange}
                                            show={showPasswords.confirm}
                                            onToggleShow={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            error={passwordFieldErrors.password_confirmation}
                                        />

                                        <button 
                                            type="submit"
                                            disabled={isLoadingPassword}
                                            className="w-full px-6 py-2.5 rounded-sm bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black font-bold text-sm shadow-lg cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingPassword ? 'Changing Password...' : 'Change Password'}
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-6">
                                    <ToggleItem
                                        label="Two-Factor Authentication"
                                        desc="Add an extra layer of security to your account"
                                        checked={toggles.twoFactor}
                                        onChange={() => handleToggle('twoFactor')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Danger Zone - Shown in Security Tab */}
                        {activeTab === 'Security' && (
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-100 dark:border-red-900/20">
                                <h2 className="text-base font-black uppercase tracking-tight mb-3 text-red-500 dark:text-red-500">Danger Zone</h2>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Delete your account and all associated data.</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This action cannot be undone.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-6 py-2.5 rounded-xl bg-white dark:bg-dark-gray text-red-500 dark:text-red-500 font-bold text-sm border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/40 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Preferences Section */}
                        {activeTab === 'Preferences' && (
                            <>
                                <div className="bg-white dark:bg-dark-gray rounded-xl p-8 border border-gray-100 dark:border-dark-gray shadow-sm">
                                    <h2 className="text-base font-black uppercase tracking-tight mb-6">Preferences</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <ToggleItem
                                            label="Dark Mode"
                                            desc="Toggle dark theme appearance"
                                            checked={toggles.darkMode}
                                            onChange={() => handleToggle('darkMode')}
                                        />
                                        <ToggleItem
                                            label="Email Notifications"
                                            desc="Receive updates via email"
                                            checked={toggles.emailNotif}
                                            onChange={() => handleToggle('emailNotif')}
                                        />

                                        {/* Language Select */}
                                        <div className="flex items-center justify-between py-2">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 dark:text-white">Language</label>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">System language</span>
                                            </div>
                                            <div className="relative">
                                                {/* Implementation Change Language Placeholder */}
                                                <select className="appearance-none rounded-xl bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 pl-4 pr-10 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 cursor-pointer transition-all">
                                                    <option>English</option>
                                                    <option>Bahasa Indonesia</option>
                                                    <option>Bahasa Gaul</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-100 dark:border-red-900/20">
                                    <h2 className="text-base font-black uppercase tracking-tight mb-3 text-red-500 dark:text-red-500">Danger Zone</h2>
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Delete your account and all associated data.</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This action cannot be undone.</p>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-6 py-2.5 rounded-xl bg-white dark:bg-dark-gray text-red-500 dark:text-red-500 font-bold text-sm border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/40 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                    </main>
                </div>
            </div>

            {/* Circular Image Cropper Modal */}
            {showCropper && profilePicturePreview && (
                <CircularImageCropper
                    image={profilePicturePreview}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropper(false)}
                />
            )}

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isDeleting}
            />
        </div>
    );
};

// Sub-components

const InputField = ({ label, type = "text", value, onChange, name, placeholder, icon: Icon, error }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-600 dark:group-focus-within:text-yellow-300 transition-colors" />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full rounded-xl bg-gray-50 dark:bg-black/20 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} px-4 py-3.5 pl-12 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-1 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all`}
            />
        </div>
        {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
);

const PasswordField = ({ label, name, value, onChange, show, onToggleShow, error }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1">{label}</label>
        <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-violet-600 dark:group-focus-within:text-yellow-300 transition-colors" />
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl bg-gray-50 dark:bg-black/20 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} px-4 py-3.5 pl-12 pr-12 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-1 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all`}
            />
            <button
                type="button"
                onClick={onToggleShow}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors"
            >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
);

const ToggleItem = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white">{label}</label>
            <span className="text-xs text-gray-500 dark:text-gray-400">{desc}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
            <div className={`
                w-12 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer 
                peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 
                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm
                peer-checked:bg-violet-600 dark:peer-checked:bg-yellow-300 dark:peer-checked:after:bg-black
            `}></div>
        </label>
    </div>
);

export default ProfilePageNew;
