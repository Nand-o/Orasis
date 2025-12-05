import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    ArrowDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/admin.service';
import { OverviewPageSkeleton } from '../../components/ui/SkeletonLoading';

const AdminOverviewPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
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

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
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
                    <button className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-violet-300/90 hover:bg-violet-300 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 dark:text-main-black text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-500/20">
                        Refresh Data
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
        </div>
    );
};

export default AdminOverviewPage;
