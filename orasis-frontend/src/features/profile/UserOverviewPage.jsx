import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Grid, 
    CheckCircle, 
    Clock,
    XCircle,
    Plus,
    TrendingUp,
    Eye,
    Heart,
    Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollection } from '../../context/CollectionContext';
import userService from '../../services/user.service';

const UserOverviewPage = () => {
    const { user } = useAuth();
    const { collections } = useCollection();
    const [loading, setLoading] = useState(true);
    const [myShowcases, setMyShowcases] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        views: 0,
        likes: 0
    });

    useEffect(() => {
        fetchMyShowcases();
    }, []);

    const fetchMyShowcases = async () => {
        try {
            setLoading(true);
            const response = await userService.getMyShowcases();
            const showcases = response.data;
            setMyShowcases(showcases);

            setStats({
                total: showcases.length,
                approved: showcases.filter(s => s.status === 'approved').length,
                pending: showcases.filter(s => s.status === 'pending').length,
                rejected: showcases.filter(s => s.status === 'rejected').length,
                views: 0, // TODO: Add views tracking
                likes: 0  // TODO: Add likes tracking
            });
        } catch (error) {
            console.error('Error fetching showcases:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Showcases',
            value: stats.total,
            icon: FileText,
            color: 'indigo',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            iconColor: 'text-indigo-600 dark:text-indigo-400'
        },
        {
            title: 'Approved',
            value: stats.approved,
            icon: CheckCircle,
            color: 'green',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Pending',
            value: stats.pending,
            icon: Clock,
            color: 'yellow',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            iconColor: 'text-yellow-600 dark:text-yellow-400'
        },
        {
            title: 'Collections',
            value: collections.length,
            icon: Grid,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                        Track your showcases and manage your portfolio
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
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
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
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Recent Showcases</h2>
                            <a href="/dashboard/showcases" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                View all
                            </a>
                        </div>

                        {myShowcases.length > 0 ? (
                            <div className="space-y-4">
                                {myShowcases.slice(0, 5).map((showcase) => (
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
                                                {new Date(showcase.created_at).toLocaleDateString()}
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
                        ) : (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400 mb-4">No showcases yet</p>
                                <button
                                    onClick={() => window.location.href = '/dashboard/showcases'}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                    Create Your First Showcase
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* My Collections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Collections</h2>
                            <a href="/dashboard/collections" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                View all
                            </a>
                        </div>

                        {collections.length > 0 ? (
                            <div className="space-y-3">
                                {collections.slice(0, 4).map((collection) => (
                                    <div
                                        key={collection.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                        onClick={() => window.location.href = '/collections'}
                                    >
                                        <div className="w-10 h-10 bg-black dark:bg-white rounded-lg shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                                {collection.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {collection.showcases_count || 0} items
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Grid className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">No collections yet</p>
                            </div>
                        )}
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
                            onClick={() => window.location.href = '/dashboard/showcases'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <Plus className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">New Showcase</h3>
                            <p className="text-sm opacity-80">Submit your work</p>
                        </button>
                        <button
                            onClick={() => window.location.href = '/collections'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <Grid className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">Manage Collections</h3>
                            <p className="text-sm opacity-80">Organize your favorites</p>
                        </button>
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 backdrop-blur-sm rounded-xl p-4 text-left transition-colors"
                        >
                            <TrendingUp className="w-6 h-6 mb-2" />
                            <h3 className="font-semibold">Edit Profile</h3>
                            <p className="text-sm opacity-80">Update your info</p>
                        </button>
                    </div>
                </motion.div>
        </div>
    );
};

export default UserOverviewPage;
