/**
 * AdminAnalyticsPage
 *
 * Halaman analytics untuk admin yang menampilkan metrik aplikasi,
 * chart, dan statistik utama. Mengambil data dari `adminService`
 * dan menyediakan retry/refresh untuk kegagalan koneksi.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AnalyticsPageSkeleton } from '../../components/ui/SkeletonLoading';
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
    PieChart,
    Eye
} from 'lucide-react';
import adminService from '../../services/admin.service';
import UserAvatar from '../../components/ui/UserAvatar';

const AdminAnalyticsPage = () => {
    const navigate = useNavigate();
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
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setError(error.response?.data?.message || error.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <AnalyticsPageSkeleton />;
    }

    if (error || !analytics) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Failed to load analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {error || 'Please try refreshing the page'}
                </p>
                <button
                    onClick={fetchAnalytics}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/20"
                >
                    Retry
                </button>
            </div>
        );
    }

    const { overview, showcases_per_month, users_per_month, top_contributors, showcases_by_category, popular_tags, top_viewed_showcases } = analytics;

    const colorVariants = {
        violet: {
            bg: 'bg-violet-100 dark:bg-violet-900/20',
            text: 'text-violet-600 dark:text-violet-400'
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400'
        },
        yellow: {
            bg: 'bg-yellow-300 dark:bg-yellow-900/20',
            text: 'text-yellow-400 dark:text-yellow-400'
        },
        red: {
            bg: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-600 dark:text-red-400'
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, subtitle, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colorVariants[color]?.bg || 'bg-gray-100'} ${colorVariants[color]?.text || 'text-gray-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 dark:text-white font-zentry tracking-wide">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-100 dark:bg-yellow-200/30 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-violet-600 dark:text-yellow-300" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-wide">ANALYTICS DASHBOARD</h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        Platform insights and statistics
                    </p>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={overview.total_users}
                    color="violet"
                    delay={0.1}
                />
                <StatCard
                    icon={FileText}
                    label="Total Showcases"
                    value={overview.total_showcases}
                    color="blue"
                    delay={0.2}
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={overview.approved_showcases}
                    color="green"
                    delay={0.3}
                />
                <StatCard
                    icon={Clock}
                    label="Pending"
                    value={overview.pending_showcases}
                    color="yellow"
                    delay={0.4}
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={overview.rejected_showcases}
                    color="red"
                    delay={0.5}
                />
            </div>

            {/* Total Views Card */}
            {overview.total_views !== undefined && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-linear-to-br from-violet-600 to-indigo-600 dark:from-yellow-300 dark:to-yellow-400 rounded-3xl p-8 text-white dark:text-main-black shadow-2xl shadow-violet-500/20 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                        <TrendingUp className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="w-8 h-8" />
                                <h3 className="text-xl font-bold uppercase tracking-wider">Total Views</h3>
                            </div>
                            <p className="text-6xl font-black font-zentry tracking-wide mb-2">
                                {overview.total_views?.toLocaleString() || 0}
                            </p>
                            <p className="text-white/80 font-medium dark:text-dark-gray">
                                Across all approved showcases
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <TrendingUp className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Showcases Per Month */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                            SHOWCASES PER MONTH
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {showcases_per_month.map((item, index) => {
                            const maxCount = Math.max(...showcases_per_month.map(i => i.count));
                            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-600 dark:text-gray-400">{item.month}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                            className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Users Per Month */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-xl">
                            <Users className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                            USER REGISTRATIONS
                        </h3>
                    </div>
                    <div className="space-y-6">
                        {users_per_month.map((item, index) => {
                            const maxCount = Math.max(...users_per_month.map(i => i.count));
                            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-600 dark:text-gray-400">{item.month}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                            className="bg-violet-600 dark:bg-violet-400 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Contributors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-yellow-200 dark:bg-yellow-900/20 rounded-xl">
                            <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                            TOP CONTRIBUTORS
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {top_contributors.map((user, index) => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl font-black text-sm md:text-lg shadow-lg shrink-0 ${index === 0 ? 'bg-yellow-400 text-yellow-900' :
                                        index === 1 ? 'bg-gray-300 text-gray-800' :
                                            index === 2 ? 'bg-orange-300 text-orange-900' :
                                                'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="hidden md:block">
                                        <UserAvatar 
                                            user={user} 
                                            size="lg"
                                        />
                                    </div>
                                    <div className="md:hidden">
                                        <UserAvatar 
                                            user={user} 
                                            size="md"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-900 dark:text-white truncate text-sm md:text-base">{user.name}</p>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 pl-2">
                                    <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white font-zentry">
                                        {user.showcases_count}
                                    </p>
                                    <p className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">showcases</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Showcases by Category */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                            <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                            SHOWCASES BY CATEGORY
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {showcases_by_category.map((item, index) => {
                            const maxCount = Math.max(...showcases_by_category.map(i => i.count));
                            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-gray-600 dark:text-gray-400">{item.category || 'N/A'}</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                                            className="bg-green-600 dark:bg-green-400 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Top Viewed Showcases */}
            {top_viewed_showcases && top_viewed_showcases.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
                            <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                            MOST VIEWED SHOWCASES
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {top_viewed_showcases.map((showcase, index) => (
                            <motion.div
                                key={showcase.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => navigate(`/design/${showcase.id}`)}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-lg shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="w-full sm:w-24 h-48 sm:h-16 rounded-xl shadow-md overflow-hidden shrink-0">
                                        <img
                                            src={showcase.image_url}
                                            alt={showcase.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                        {showcase.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="px-2 py-1 bg-gray-200 dark:bg-white/10 rounded-md text-xs font-bold text-gray-600 dark:text-gray-300">
                                            {showcase.category?.name || 'N/A'}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            by {showcase.user?.name || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2 text-indigo-600 dark:text-indigo-400 w-full sm:w-auto bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        <span className="text-sm font-bold sm:hidden">Views</span>
                                    </div>
                                    <span className="font-black text-xl font-zentry">{showcase.views_count?.toLocaleString() || 0}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Popular Tags */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-xl">
                        <Tag className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-zentry tracking-wide">
                        MOST POPULAR TAGS
                    </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    {popular_tags.map((tag) => (
                        <motion.div
                            key={tag.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-white/5 hover:bg-pink-50 dark:hover:bg-pink-900/20 border border-gray-200 dark:border-white/5 rounded-xl transition-colors cursor-pointer group"
                        >
                            <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">#{tag.name}</span>
                            <span className="px-2 py-0.5 bg-white dark:bg-black/20 rounded-lg text-xs font-black text-gray-500 dark:text-gray-400">
                                {tag.showcases_count}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAnalyticsPage;
