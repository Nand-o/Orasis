import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Users, 
    FileText, 
    Clock, 
    CheckCircle, 
    XCircle,
    Eye,
    Heart,
    MessageCircle,
    ArrowUp,
    ArrowDown,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/admin.service';
import Spinner from '../../components/ui/Spinner';
import { useCollection } from '../../context/CollectionContext';

const AdminOverviewPage = () => {
    const { user } = useAuth();
    const { collections } = useCollection();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalShowcases: 0,
        approvedShowcases: 0,
        pendingShowcases: 0,
        rejectedShowcases: 0,
        totalUsers: 4, // TODO: Get from API
        newUsersThisMonth: 2,
        totalViews: 1250,
        totalLikes: 340
    });
    const [recentShowcases, setRecentShowcases] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllShowcases();
            const showcases = response.data;

            setStats({
                totalShowcases: showcases.length,
                approvedShowcases: showcases.filter(s => s.status === 'approved').length,
                pendingShowcases: showcases.filter(s => s.status === 'pending').length,
                rejectedShowcases: showcases.filter(s => s.status === 'rejected').length,
                totalUsers: 4,
                newUsersThisMonth: 2,
                totalViews: 1250,
                totalLikes: 340
            });

            // Get 5 most recent showcases
            setRecentShowcases(showcases.slice(0, 5));

            // Mock activity data
            setRecentActivity([
                { type: 'new_showcase', user: 'John Doe', action: 'submitted a new showcase', time: '5 minutes ago' },
                { type: 'approved', user: 'Admin', action: 'approved "Modern Dashboard"', time: '1 hour ago' },
                { type: 'new_user', user: 'Jane Smith', action: 'joined Orasis', time: '2 hours ago' },
                { type: 'rejected', user: 'Admin', action: 'rejected "Old Design"', time: '3 hours ago' },
                { type: 'new_showcase', user: 'Bob Wilson', action: 'submitted a new showcase', time: '5 hours ago' },
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Showcases',
            value: stats.totalShowcases,
            change: '+12%',
            isPositive: true,
            icon: FileText,
            color: 'indigo',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            title: 'Pending Review',
            value: stats.pendingShowcases,
            change: stats.pendingShowcases > 5 ? 'High' : 'Normal',
            isPositive: stats.pendingShowcases <= 5,
            icon: Clock,
            color: 'yellow',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            iconColor: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            change: '+2 this month',
            isPositive: true,
            icon: Users,
            color: 'green',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: '+18%',
            isPositive: true,
            icon: Eye,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400'
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner size="xl" color="gray" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Here's what's happening with your platform today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${
                                        stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {stat.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        <span className="font-medium">{stat.change}</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Showcases */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Showcases</h2>
                            <a href="/dashboard/showcases" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                View all
                            </a>
                        </div>
                        <div className="space-y-4">
                            {recentShowcases.map((showcase) => (
                                <div
                                    key={showcase.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                    onClick={() => window.location.href = `/design/${showcase.id}`}
                                >
                                    <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        {showcase.image_url ? (
                                            <img 
                                                src={showcase.image_url} 
                                                alt={showcase.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-500', 'to-purple-600');
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-black dark:bg-white flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-white dark:text-black" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {showcase.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            by {showcase.user?.name} • {new Date(showcase.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        showcase.status === 'approved' 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : showcase.status === 'pending'
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    }`}>
                                        {showcase.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Activity Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        activity.type === 'approved' 
                                            ? 'bg-green-100 dark:bg-green-900/30'
                                            : activity.type === 'rejected'
                                            ? 'bg-red-100 dark:bg-red-900/30'
                                            : 'bg-indigo-100 dark:bg-indigo-900/30'
                                    }`}>
                                        {activity.type === 'approved' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                        {activity.type === 'rejected' && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                                        {activity.type === 'new_showcase' && <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                        {activity.type === 'new_user' && <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            <span className="font-semibold">{activity.user}</span>
                                            {' '}{activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-black dark:bg-white rounded-2xl p-8 text-white dark:text-black"
                >
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => window.location.href = '/dashboard/pending'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <Clock className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">Review Pending</h3>
                            <p className="text-sm opacity-80">{stats.pendingShowcases} awaiting review</p>
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard/users'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <Users className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">Manage Users</h3>
                            <p className="text-sm opacity-80">{stats.totalUsers} total users</p>
                        </button>
                        <button
                            onClick={() => window.location.href = '/dashboard/tags'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <TrendingUp className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">View Analytics</h3>
                            <p className="text-sm opacity-80">Detailed insights</p>
                        </button>
                    </div>
                </motion.div>
        </div>
    );
};

export default AdminOverviewPage;
