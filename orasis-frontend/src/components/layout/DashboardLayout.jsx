import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Menu,
    X,
    LayoutDashboard,
    FileText,
    Clock,
    Users,
    Folder,
    Tag,
    TrendingUp,
    Grid,
    Sun,
    Moon,
    Settings,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import adminService from '../../services/admin.service';

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initialize collapsed state based on screen size
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return window.innerWidth < 1024; // Collapsed on screens smaller than 1024px (tablet and mobile)
    });

    // Memoize setSidebarCollapsed to prevent re-renders
    const handleSetCollapsed = useCallback((value) => {
        setSidebarCollapsed(value);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Admin Pending Count Logic (Duplicate for Mobile Menu Badge)
    const [pendingCount, setPendingCount] = useState(0);
    useEffect(() => {
        if (isAdmin) {
            const fetchPendingCount = async () => {
                try {
                    const response = await adminService.getPendingShowcases();
                    setPendingCount(response.data?.length || 0);
                } catch (error) {
                    console.error('Failed to fetch pending count:', error);
                }
            };
            fetchPendingCount();
            const interval = setInterval(fetchPendingCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAdmin]);

    const getPageTitle = () => {
        const path = location.pathname;

        // Admin Routes
        if (path === '/dashboard/pending') return { main: 'Pending Review', sub: 'Moderation Queue' };
        if (path === '/dashboard/users') return { main: 'Users', sub: 'User Management' };
        if (path === '/dashboard/categories') return { main: 'Categories', sub: 'Taxonomy' };
        if (path === '/dashboard/tags') return { main: 'Tags', sub: 'Taxonomy' };
        if (path === '/dashboard/analytics') return { main: 'Analytics', sub: 'Insights & Stats' };

        // User Routes
        if (path === '/dashboard/collections') return { main: 'Collections', sub: 'My Saved Items' };

        // Shared Routes (Context dependent)
        if (path === '/dashboard/showcases') return { main: 'Showcases', sub: 'Manage Content' };
        if (path === '/dashboard') return { main: 'Dashboard', sub: 'Overview' };

        return { main: 'Dashboard', sub: 'Overview' };
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    // Calculate margin based on sidebar state + spacing
    // Sidebar is fixed at left-4 (16px)
    // Width is 280px or 88px
    // We want some gap after the sidebar, say 24px
    const contentMargin = sidebarCollapsed ? '120px' : '320px';

    const adminMenuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: FileText, label: 'Showcases', path: '/dashboard/showcases', badge: null },
        { icon: Clock, label: 'Pending Review', path: '/dashboard/pending', badge: 'pending' },
        { icon: Users, label: 'Users', path: '/dashboard/users' },
        { icon: Folder, label: 'Categories', path: '/dashboard/categories' },
        { icon: Tag, label: 'Tags', path: '/dashboard/tags' },
        { icon: TrendingUp, label: 'Analytics', path: '/dashboard/analytics' },
    ];

    const userMenuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: FileText, label: 'My Showcases', path: '/dashboard/showcases' },
        { icon: Grid, label: 'Collections', path: '/dashboard/collections' },
    ];

    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-main-black transition-colors duration-300">
            <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={handleSetCollapsed} />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-dark-gray z-50 md:hidden border-r border-gray-200 dark:border-white/10 flex flex-col shadow-2xl"
                        >
                            {/* Drawer Header */}
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-white/5">
                                <span className="font-bold text-lg text-gray-900 dark:text-white font-zentry tracking-wide">ORASIS</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* User Profile */}
                            <div className="p-4 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-300/80 to-violet-300 dark:from-yellow-300/80 dark:to-yellow-300 p-0.5 shrink-0">
                                        <img
                                            src={user?.profile_picture_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                            alt={user?.name}
                                            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-gray"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                                    ? 'bg-violet-600 dark:bg-yellow-300 text-white dark:text-black shadow-lg shadow-violet-500/20 dark:shadow-yellow-300/20'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${active ? 'text-white dark:text-black' : ''}`} />
                                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                            {item.badge === 'pending' && pendingCount > 0 && (
                                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                                    {pendingCount}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>

                            {/* Bottom Actions */}
                            <div className="p-4 border-t border-gray-100 dark:border-white/5 space-y-2">
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                </button>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="text-sm font-medium">Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div
                style={{
                    marginLeft: window.innerWidth >= 768 ? contentMargin : '0px',
                    width: window.innerWidth >= 768 ? `calc(100% - ${contentMargin})` : '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="flex-1 min-h-screen flex flex-col relative"
            >
                {/* Top Navbar - Glassmorphism */}
                <header className="h-20 flex items-center px-4 md:px-8 sticky top-0 z-40 bg-gray-50 dark:bg-main-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-all">
                    <div className="flex items-center justify-between w-full">
                        {/* Mobile: Hamburger & Logo */}
                        <div className="md:hidden flex items-center gap-3">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <span className="font-bold text-lg text-gray-900 dark:text-white font-zentry tracking-wide">ORASIS</span>
                        </div>

                        {/* Desktop: Breadcrumbs or Page Title */}
                        <div className="hidden md:flex flex-col">
                            <h1 className="text-xl font-bold uppercase tracking-tight text-violet-300 dark:text-yellow-300">
                                {getPageTitle().main}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {getPageTitle().sub}
                            </p>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-6">
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="/home" className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Home Page
                                </a>
                            </nav>

                            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                            {/* Date/Time or other widget could go here */}
                            <div className="text-xs font-medium text-gray-400 dark:text-gray-500 hidden md:block">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-6 px-8 border-t border-gray-200 dark:border-white/5 mt-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500 font-medium">
                        <div>
                            <span>© 2025 Orasis. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
