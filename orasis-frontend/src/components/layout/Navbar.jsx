import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, Monitor, Settings, User, FileText, Upload, Grid, LogOut, Bookmark, LayoutDashboard, LogIn, Users, BarChart3, Clock, Folder, Tag, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../ui/SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ searchValue, onSearchChange }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "text-black dark:text-white"
            : "text-gray-300 dark:text-gray-400 hover:text-black dark:hover:text-white";
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-main-black">
            <div className="w-full h-18 px-4 sm:px-6 lg:px-16 py-1">
                <div className="flex items-center justify-between h-16 gap-4 ">
                    {/* Left Section: Logo & Nav Links */}
                    <div className="flex items-center shrink-0">
                        <div className="shrink-0 flex items-center">
                            <a href="/" className="cursor-pointer">
                                <img
                                    src="/logo-black.svg"
                                    alt="Orasis"
                                    className="h-14 w-auto dark:invert"
                                />
                            </a>
                        </div>
                        <div className="hidden md:ml-4 md:flex md:space-x-4 h-full items-center">
                            <div className="relative group h-full flex items-center">
                                <motion.a
                                    href="/home"
                                    className={`${isActive('/home')} inline-flex items-center px-1 pt-1 text-base font-bold`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Inspiration
                                </motion.a>

                                {/* Hover Dropdown */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="bg-[#414141] rounded-2xl shadow-xl p-3 flex gap-3 min-w-[240px]">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/home?category=Websites');
                                            }}
                                            className="flex-1 flex flex-col items-center gap-3 p-4 rounded-xl bg-[#4c4c4c] hover:bg-[#5b5b5b] transition-all group/item cursor-pointer"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <Monitor className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-white">Website</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/home?category=Mobiles');
                                            }}
                                            className="flex-1 flex flex-col items-center gap-3 p-4 rounded-xl bg-[#4c4c4c] hover:bg-[#5b5b5b] transition-all group/item cursor-pointer"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <Smartphone className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-white">Mobile</span>
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <motion.a
                                href="/about"
                                className={`${isActive('/about')} inline-flex items-center px-1 pt-1 text-base font-bold`}
                                whileTap={{ scale: 0.95 }}
                            >
                                About Us
                            </motion.a>
                        </div>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="hidden sm:flex flex-1 justify-center max-w-2xl px-4">
                        <SearchBar
                            value={searchValue}
                            onChange={onSearchChange}
                            className="w-full"
                            placeholder="Search Designs..."
                        />
                    </div>

                    {/* Right Section: Bookmark, Profile & Mobile Menu */}
                    <div className="flex items-center shrink-0 space-x-4">
                        {/* Bookmark Icon - Quick access to Collections (Only for authenticated users) */}
                        {isAuthenticated && (
                            <motion.button
                                onClick={() => navigate('/collections')}
                                className={`group relative hidden sm:flex p-2 transition-colors ${location.pathname === '/collections'
                                    ? 'bg-white dark:bg-main-black cursor-pointer'
                                    : 'cursor-pointer'
                                    }`}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Bookmark className={`w-5 h-5 ${location.pathname === '/collections'
                                    ? 'text-violet-300 dark:text-yellow-300 fill-violet-300 dark:fill-yellow-300'
                                    : 'text-main-black dark:text-white'
                                    }`} />
                                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-main-black dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                                    My Collections
                                </span>
                            </motion.button>
                        )}

                        {/* Profile Dropdown or Login Button */}
                        <div className="relative hidden sm:block">
                            {isAuthenticated ? (
                                <>
                                    <motion.button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-gray hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>Hi, {user?.name || 'User'}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-70"
                                                    onClick={() => setIsProfileOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-gray rounded-xl shadow-lg py-2 z-70 font-family-general"
                                                >
                                                    <div className="px-4 py-2">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Theme</span>
                                                            <div className="flex bg-gray-100 dark:bg-main-black rounded-full p-1 relative">
                                                                {['light', 'dark', 'system'].map((t) => (
                                                                    <button
                                                                        key={t}
                                                                        onClick={() => setTheme(t)}
                                                                        className={`relative p-1.5 rounded-full transition-colors z-10 ${theme === t ? 'text-gray-900 dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                                                    >
                                                                        {theme === t && (
                                                                            <motion.div
                                                                                layoutId="activeTheme"
                                                                                className="absolute inset-0 bg-violet-300 dark:bg-yellow-300 rounded-full shadow-sm -z-10"
                                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                            />
                                                                        )}
                                                                        {t === 'light' && <Sun className={`w-4 h-4 ${theme === t ? 'text-white' : 'text-main-black dark:text-white'}`} />}
                                                                        {t === 'dark' && <Moon className={`w-4 h-4 ${theme === t ? 'text-main-black' : 'text-main-black dark:text-white'}`} />}
                                                                        {t === 'system' && <Monitor className={`w-4 h-4 ${theme === t ? 'text-white dark:text-main-black' : 'text-main-black dark:text-white'}`} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="h-px bg-gray-100 dark:bg-white/50 my-1 mx-3" />

                                                    <div className="px-1">
                                                        <a href="/dashboard" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                            <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                            Dashboard
                                                        </a>
                                                        <a href="/profile" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                            <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                            Profile Settings
                                                        </a>
                                                        <a href="/collections" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                            <Grid className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                            Collections
                                                        </a>

                                                        {/* Conditional menu items based on user role */}
                                                        {user?.role === 'admin' ? (
                                                            <>
                                                                <a href="/dashboard/pending" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <Clock className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    Pending Review
                                                                </a>
                                                                <a href="/dashboard/showcases" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <FileText className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    All Submissions
                                                                </a>
                                                                <a href="/dashboard/users" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <Users className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    User Management
                                                                </a>
                                                                <a href="/dashboard/categories" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <Folder className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    Categories
                                                                </a>
                                                                <a href="/dashboard/tags" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <Tag className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    Tags
                                                                </a>
                                                                <a href="/dashboard/analytics" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <BarChart3 className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    Analytics
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <a href="/dashboard/showcases" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <FileText className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    My Submissions
                                                                </a>
                                                                <a href="/showcase/new" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:text-white dark:text-white dark:hover:text-main-black hover:bg-violet-300 dark:hover:bg-yellow-300 rounded-lg">
                                                                    <Upload className="w-4 h-4 mr-3 text-gray-400 group-hover:text-white dark:text-white dark:group-hover:text-main-black" />
                                                                    Submit a site
                                                                </a>
                                                            </>
                                                        )}

                                                        <div className="h-px bg-gray-100 dark:bg-white/50 my-1 mx-3" />
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                        >
                                                            <LogOut className="w-4 h-4 mr-3 text-red-400" />
                                                            Log out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center space-x-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-6 py-2 rounded-full text-sm font-medium transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Login</span>
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center sm:hidden">
                            <motion.button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <a
                            href="/"
                            className={`${location.pathname === '/' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        >
                            Inspiration
                        </a>
                        <a
                            href="/about"
                            className={`${location.pathname === '/about' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        >
                            About Us
                        </a>
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700 px-4">
                        <SearchBar value={searchValue} onChange={onSearchChange} placeholder="Search on Web..." />

                        {/* Mobile Theme Toggle */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Theme</span>
                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1 relative">
                                    {['light', 'dark', 'system'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTheme(t)}
                                            className={`relative p-1.5 rounded-full transition-colors z-10 ${theme === t ? 'text-gray-900 dark:text-black' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                                        >
                                            {theme === t && (
                                                <motion.div
                                                    layoutId="activeThemeMobile"
                                                    className="absolute inset-0 bg-white dark:bg-white rounded-full shadow-sm -z-10"
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}
                                            {t === 'light' && <Sun className="w-4 h-4" />}
                                            {t === 'dark' && <Moon className="w-4 h-4" />}
                                            {t === 'system' && <Monitor className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Profile Links */}
                        {isAuthenticated ? (
                            <div className="mt-4 space-y-2">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Hi, {user?.name || 'User'}</div>
                                <a href="/dashboard" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                    Dashboard
                                </a>
                                <a href="/profile" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <User className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                    Profile Settings
                                </a>
                                <a href="/collections" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                    <Grid className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                    Collections
                                </a>

                                {/* Conditional mobile menu items based on user role */}
                                {user?.role === 'admin' ? (
                                    <>
                                        <a href="/dashboard/showcases" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <FileText className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                            All Submissions
                                        </a>
                                        <a href="/dashboard/analytics" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <Settings className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                            Analytics
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <a href="/dashboard/showcases" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <FileText className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                            My Submissions
                                        </a>
                                        <a href="/showcase/new" className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                                            <Upload className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                                            Submit a site
                                        </a>
                                    </>
                                )}

                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center py-2 text-sm text-red-600 hover:text-red-700 dark:hover:text-red-400"
                                >
                                    <LogOut className="w-4 h-4 mr-3 text-red-400" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black px-6 py-3 rounded-full text-sm font-medium transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
