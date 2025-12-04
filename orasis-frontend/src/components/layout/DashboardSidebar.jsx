import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Grid,
    TrendingUp,
    Clock,
    Tag,
    Folder,
    Menu,
    Sun,
    Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import adminService from '../../services/admin.service';

const DashboardSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const isAdmin = user?.role === 'admin';
    const [pendingCount, setPendingCount] = useState(0);

    // Fetch pending count for admin
    useEffect(() => {
        if (isAdmin) {
            fetchPendingCount();

            // Refresh count every 30 seconds
            const interval = setInterval(() => {
                fetchPendingCount();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [isAdmin]);

    // Refresh when navigating to/from pending page
    useEffect(() => {
        if (isAdmin && location.pathname === '/dashboard/pending') {
            fetchPendingCount();
        }
    }, [location.pathname, isAdmin]);

    const fetchPendingCount = async () => {
        try {
            const response = await adminService.getPendingShowcases();
            setPendingCount(response.data?.length || 0);
        } catch (error) {
            console.error('Failed to fetch pending count:', error);
            setPendingCount(0);
        }
    };

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

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed ? 88 : 280,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-4 top-4 bottom-4 bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/10 z-50 flex-col shadow-2xl overflow-hidden hidden md:flex"
        >
            {/* Header & Toggle */}
            <div className="h-20 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <img src="/logo-black.svg" alt="Orasis" className="w-full h-full object-contain dark:hidden" />
                        <img src="/logo-white.svg" alt="Orasis" className="w-full h-full object-contain hidden dark:block" />
                    </div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col min-w-0"
                        >
                            <span className="font-bold text-sm text-violet-300 dark:text-yellow-300 tracking-tight">ORASIS</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                                {isAdmin ? 'Admin Panel' : 'User Dashboard'}
                            </span>
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* User Profile Snippet */}
            <div className={`px-4 mb-6 ${collapsed ? 'flex justify-center' : ''}`}>
                <div className={`flex items-center gap-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 ${collapsed ? 'justify-center w-12 h-12 p-0' : 'p-3'}`}>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-300/80 to-violet-300 dark:from-yellow-300/80 dark:to-yellow-300 p-0.5 shrink-0">
                        <img
                            src={user?.profile_picture_url || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                            alt={user?.name}
                            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-gray"
                        />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-2 scrollbar-hide">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <motion.button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${active
                                ? 'bg-violet-600 dark:bg-yellow-300 text-white dark:text-black shadow-lg shadow-violet-500/20 dark:shadow-yellow-300/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white dark:text-black' : 'group-hover:text-violet-600 dark:group-hover:text-yellow-300'} transition-colors`} />

                            {!collapsed && (
                                <>
                                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                    {item.badge === 'pending' && pendingCount > 0 && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-sm">
                                            {pendingCount}
                                        </span>
                                    )}
                                </>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 mt-auto space-y-2 border-t border-gray-100 dark:border-white/5">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all group ${collapsed ? 'justify-center' : ''}`}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    ) : (
                        <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
                    )}
                    {!collapsed && <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                <button
                    onClick={() => navigate('/profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all group ${collapsed ? 'justify-center' : ''}`}
                >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    {!collapsed && <span className="text-sm font-medium">Settings</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all group ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
};

export default DashboardSidebar;
