/**
 * AdminOverviewPage
 *
 * Ringkasan dashboard untuk admin yang menampilkan metrik cepat,
 * aktivitas terbaru, dan statistik yang relevan. Mengumpulkan data
 * dari beberapa endpoint admin untuk ditampilkan di satu layar.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Users,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Download,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/admin.service';
import { OverviewPageSkeleton } from '../../components/ui/SkeletonLoading';

const AdminOverviewPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportOptions, setExportOptions] = useState({
        summary: true,
        showcases: true,
        users: false,
        activity: false
    });
    const [exporting, setExporting] = useState(false);
    const [stats, setStats] = useState({
        totalShowcases: 0,
        approvedShowcases: 0,
        pendingShowcases: 0,
        rejectedShowcases: 0,
        totalUsers: 0,
        newUsersThisMonth: 0,
        totalViews: 0,
        totalLikes: 0
    });
    const [recentShowcases, setRecentShowcases] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        document.title = 'Admin Dashboard | Orasis';
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            
            // Fetch showcases and users in parallel
            const [showcasesResponse, usersResponse] = await Promise.all([
                adminService.getAllShowcases(),
                adminService.getAllUsers()
            ]);
            
            const showcases = showcasesResponse.data || [];
            const users = usersResponse.data || [];

            // Calculate stats
            const totalShowcases = showcases.length;
            const approvedShowcases = showcases.filter(s => s.status === 'approved').length;
            const pendingShowcases = showcases.filter(s => s.status === 'pending').length;
            const rejectedShowcases = showcases.filter(s => s.status === 'rejected').length;
            const totalViews = showcases.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
            const totalLikes = showcases.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);
            
            // Calculate new users this month
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const newUsersThisMonth = users.filter(u => {
                const createdAt = new Date(u.created_at);
                return createdAt >= firstDayOfMonth;
            }).length;

            setStats({
                totalShowcases,
                approvedShowcases,
                pendingShowcases,
                rejectedShowcases,
                totalUsers: users.length,
                newUsersThisMonth,
                totalViews,
                totalLikes
            });

            // Get 5 most recent showcases
            setRecentShowcases(showcases.slice(0, 5));

            // Mock recent activity based on showcases
            const activity = showcases.slice(0, 5).map(s => ({
                type: s.status === 'approved' ? 'approved' : s.status === 'rejected' ? 'rejected' : 'new_showcase',
                user: s.user?.name || 'Unknown User',
                action: s.status === 'approved' ? 'showcase approved' : s.status === 'rejected' ? 'showcase rejected' : 'submitted a new showcase',
                time: new Date(s.created_at).toLocaleDateString()
            }));
            setRecentActivity(activity);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchDashboardData(true);
    };

    const toggleExportOption = (option) => {
        setExportOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const generateCSV = (data, filename) => {
        const csv = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = async () => {
        setExporting(true);
        
        try {
            const timestamp = new Date().toISOString().split('T')[0];

            // Export Summary
            if (exportOptions.summary) {
                const summaryData = [
                    ['Metric', 'Value', 'Date'],
                    ['Total Users', stats.totalUsers, timestamp],
                    ['Total Showcases', stats.totalShowcases, timestamp],
                    ['Approved Showcases', stats.approvedShowcases, timestamp],
                    ['Pending Showcases', stats.pendingShowcases, timestamp],
                    ['Rejected Showcases', stats.rejectedShowcases, timestamp],
                    ['Total Views', stats.totalViews, timestamp],
                    ['New Users This Month', stats.newUsersThisMonth, timestamp]
                ];
                generateCSV(summaryData, `dashboard-summary-${timestamp}.csv`);
            }

            // Export Showcases
            if (exportOptions.showcases) {
                const showcasesResponse = await adminService.getAllShowcases();
                const showcases = showcasesResponse.data || [];
                const showcasesData = [
                    ['ID', 'Title', 'Author', 'Status', 'Category', 'Views', 'Created Date', 'URL']
                ];
                showcases.forEach(s => {
                    showcasesData.push([
                        s.id,
                        `"${s.title.replace(/"/g, '""')}"`,
                        `"${s.user?.name || 'Unknown'}"`,
                        s.status,
                        s.category?.name || 'Uncategorized',
                        s.views_count || 0,
                        new Date(s.created_at).toLocaleDateString(),
                        s.url_website || ''
                    ]);
                });
                generateCSV(showcasesData, `showcases-${timestamp}.csv`);
            }

            // Export Users
            if (exportOptions.users) {
                const usersResponse = await adminService.getAllUsers();
                const users = usersResponse.data || [];
                const usersData = [
                    ['ID', 'Name', 'Email', 'Role', 'Joined Date', 'Total Showcases']
                ];
                users.forEach(u => {
                    usersData.push([
                        u.id,
                        `"${u.name.replace(/"/g, '""')}"`,
                        u.email,
                        u.role,
                        new Date(u.created_at).toLocaleDateString(),
                        u.showcases?.length || 0
                    ]);
                });
                generateCSV(usersData, `users-${timestamp}.csv`);
            }

            // Export Activity
            if (exportOptions.activity) {
                const activityData = [
                    ['User', 'Action', 'Type', 'Date']
                ];
                recentActivity.forEach(a => {
                    activityData.push([
                        `"${a.user.replace(/"/g, '""')}"`,
                        `"${a.action.replace(/"/g, '""')}"`,
                        a.type,
                        a.time
                    ]);
                });
                generateCSV(activityData, `activity-log-${timestamp}.csv`);
            }

            setShowExportModal(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return <OverviewPageSkeleton />;
    }

    const colorVariants = {
        violet: {
            bg: 'bg-violet-100 dark:bg-violet-900/20',
            text: 'text-violet-600 dark:text-violet-400'
        },
        yellow: {
            bg: 'bg-yellow-300 dark:bg-yellow-900/20',
            text: 'text-yellow-400 dark:text-yellow-400'
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400'
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-gray p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorVariants[color].bg} ${colorVariants[color].text}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-3xl font-black text-gray-900 dark:text-white font-zentry">{value}</p>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white font-zentry tracking-wide">
                        DASHBOARD OVERVIEW
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
                        Welcome back, {user?.name || 'Admin'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowExportModal(true)}
                        className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button 
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="px-4 py-2 bg-violet-300/90 hover:bg-violet-300 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 dark:text-main-black text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="violet"
                    trend={12}
                />
                <StatCard
                    title="Pending Reviews"
                    value={stats.pendingShowcases}
                    icon={Clock}
                    color="yellow"
                    trend={-5}
                />
                <StatCard
                    title="Total Showcases"
                    value={stats.totalShowcases}
                    icon={FileText}
                    color="blue"
                    trend={8}
                />
                <StatCard
                    title="Total Views"
                    value={stats.totalViews.toLocaleString()}
                    icon={Eye}
                    color="green"
                    trend={24}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Showcases */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">RECENT SHOWCASES</h2>
                        <button
                            onClick={() => navigate('/dashboard/showcases')}
                            className="text-sm font-bold text-violet-300/90 hover:text-violet-300 dark:text-yellow-300/90 dark:hover:text-yellow-300 cursor-pointer"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentShowcases.map((showcase) => (
                            <motion.div
                                key={showcase.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => navigate(`/design/${showcase.id}`)}
                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
                                    {showcase.image_url ? (
                                        <img
                                            src={showcase.image_url}
                                            alt={showcase.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                        {showcase.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        by {showcase.user?.name || 'Unknown'} • {new Date(showcase.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${showcase.status === 'approved'
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : showcase.status === 'pending'
                                        ? 'bg-yellow-300 dark:bg-yellow-900/20 text-yellow-400 dark:text-yellow-400'
                                        : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                    }`}>
                                    {showcase.status}
                                </span>
                            </motion.div>
                        ))}
                        {recentShowcases.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium">
                                No showcases found
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide mb-6">RECENT ACTIVITY</h2>
                    <div className="space-y-6">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex gap-4 relative">
                                {index !== recentActivity.length - 1 && (
                                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100 dark:bg-white/5 -mb-6"></div>
                                )}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.type === 'approved'
                                    ? 'bg-green-100 dark:bg-green-900/20'
                                    : activity.type === 'rejected'
                                        ? 'bg-red-100 dark:bg-red-900/20'
                                        : 'bg-indigo-100 dark:bg-indigo-900/20'
                                    }`}>
                                    {activity.type === 'approved' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                                    {activity.type === 'rejected' && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                                    {activity.type === 'new_showcase' && <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                                        <span className="font-bold">{activity.user}</span>
                                        {' '}{activity.action}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-violet-300 dark:bg-yellow-300 rounded-3xl p-8 text-white dark:text-black shadow-xl">
                <h2 className="text-2xl font-black font-zentry tracking-wide mb-6">QUICK ACTIONS</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => window.location.href = '/dashboard/pending'}
                        className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-left transition-colors group"
                    >
                        <Clock className="w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg mb-1">Review Pending</h3>
                        <p className="text-sm opacity-70 font-medium">{stats.pendingShowcases} awaiting review</p>
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/users'}
                        className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-left transition-colors group"
                    >
                        <Users className="w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg mb-1">Manage Users</h3>
                        <p className="text-sm opacity-70 font-medium">{stats.totalUsers} total users</p>
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard/analytics'}
                        className="bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 backdrop-blur-sm rounded-2xl p-6 text-left transition-colors group"
                    >
                        <TrendingUp className="w-8 h-8 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                        <h3 className="font-bold text-lg mb-1">View Analytics</h3>
                        <p className="text-sm opacity-70 font-medium">Detailed insights</p>
                    </button>
                </div>
            </div>

            {/* Export Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowExportModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white dark:bg-dark-gray rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center">
                                        <Download className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Data</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Select data to export</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 mb-6">
                                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.summary}
                                        onChange={() => toggleExportOption('summary')}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-white/20 text-violet-600 dark:text-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                            Dashboard Summary
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Overview statistics and metrics</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.showcases}
                                        onChange={() => toggleExportOption('showcases')}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-white/20 text-violet-600 dark:text-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                            All Showcases
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete showcase data with details</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.users}
                                        onChange={() => toggleExportOption('users')}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-white/20 text-violet-600 dark:text-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                            All Users
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">User list with join dates</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.activity}
                                        onChange={() => toggleExportOption('activity')}
                                        className="w-5 h-5 rounded border-gray-300 dark:border-white/20 text-violet-600 dark:text-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                            Activity Log
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Recent platform activities</p>
                                    </div>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowExportModal(false)}
                                    disabled={exporting}
                                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={exporting || (!exportOptions.summary && !exportOptions.showcases && !exportOptions.users && !exportOptions.activity)}
                                    className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 text-white dark:text-main-black rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {exporting ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Export CSV
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOverviewPage;
