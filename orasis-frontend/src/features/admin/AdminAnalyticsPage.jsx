import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from '../../components/ui/Spinner';
import { 
    TrendingUp, 
    Users, 
    FileText, 
    Clock,
    CheckCircle,
    XCircle,
    Tag,
    Award,
    BarChart3,
    PieChart
} from 'lucide-react';
import adminService from '../../services/admin.service';

const AdminAnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Analytics | Admin | Orasis';
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getAnalytics();
            console.log('Analytics response:', response);
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <Spinner size="xl" color="gray" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading analytics data...</p>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="text-center py-20">
                <BarChart3 className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Failed to load analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error || 'Please try refreshing the page'}
                </p>
                <button
                    onClick={fetchAnalytics}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const { overview, showcases_per_month, users_per_month, top_contributors, showcases_by_category, popular_tags } = analytics;

    const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl`}>
                    <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        </motion.div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Platform insights and statistics
                        </p>
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={overview.total_users}
                    color="purple"
                />
                <StatCard
                    icon={FileText}
                    label="Total Showcases"
                    value={overview.total_showcases}
                    color="blue"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={overview.approved_showcases}
                    color="green"
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={overview.pending_showcases}
                    color="yellow"
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={overview.rejected_showcases}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Showcases Per Month */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Showcases Per Month (Last 6 Months)
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {showcases_per_month.map((item, index) => {
                            const maxCount = Math.max(...showcases_per_month.map(i => i.count));
                            const percentage = (item.count / maxCount) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Users Per Month */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            User Registrations (Last 6 Months)
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {users_per_month.map((item, index) => {
                            const maxCount = Math.max(...users_per_month.map(i => i.count));
                            const percentage = (item.count / maxCount) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Contributors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Top Contributors
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {top_contributors.map((user, index) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {user.showcases_count}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">showcases</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Showcases by Category */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Showcases by Category
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {showcases_by_category.map((item, index) => {
                            const maxCount = Math.max(...showcases_by_category.map(i => i.count));
                            const percentage = (item.count / maxCount) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                        <Tag className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Most Popular Tags
                    </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {popular_tags.map((tag) => (
                        <motion.div
                            key={tag.id}
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full"
                        >
                            <span className="font-medium text-gray-900 dark:text-white">{tag.name}</span>
                            <span className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                                {tag.showcases_count}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPage;
