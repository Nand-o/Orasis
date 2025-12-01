import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Folder
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/admin.service';

const DashboardSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
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
            animate={{ width: collapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col"
        >
                {/* Header */}
                <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 gap-3 shrink-0">
                    {/* Toggle Button - SUPER VISIBLE */}
                    <motion.button
                        onClick={() => setCollapsed(!collapsed)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-black dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 rounded-xl transition-all shadow-2xl border-2 border-gray-300 dark:border-gray-700 shrink-0"
                        title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
                        style={{ zIndex: 50 }}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-6 h-6 text-white dark:text-black" strokeWidth={3} />
                        ) : (
                            <ChevronLeft className="w-6 h-6 text-white dark:text-black" strokeWidth={3} />
                        )}
                    </motion.button>

                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col"
                        >
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">Orasis</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {isAdmin ? 'Admin Panel' : 'User Dashboard'}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* User Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0"
                >
                    {collapsed ? (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                {user?.profile_picture_url ? (
                                    <img 
                                        src={user.profile_picture_url} 
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                {user?.profile_picture_url ? (
                                    <img 
                                        src={user.profile_picture_url} 
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-semibold text-base">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 min-h-0">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <motion.button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    whileHover={{ x: collapsed ? 0 : 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                        active
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                                    {!collapsed && (
                                        <>
                                            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                            {item.badge === 'pending' && pendingCount > 0 && (
                                                <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                                                    {pendingCount}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-1 shrink-0 bg-white dark:bg-gray-900">
                    <motion.button
                        onClick={() => navigate('/profile')}
                        whileHover={{ x: collapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Settings className={`w-5 h-5 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="text-sm font-medium">Settings</span>}
                    </motion.button>
                    <motion.button
                        onClick={handleLogout}
                        whileHover={{ x: collapsed ? 0 : 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className={`w-5 h-5 shrink-0 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </motion.button>
                </div>
        </motion.aside>
    );
};

export default DashboardSidebar;
