import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Grid,
    CheckCircle,
    Clock,
    Plus,
    TrendingUp,
    Trash2,
    Pencil,
    Folder,
    Settings,
    ChevronRight,
    ArrowRight,
    Sparkles,
    Layout
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollection } from '../../context/CollectionContext';
import userService from '../../services/user.service';
import { OverviewPageSkeleton } from '../../components/ui/SkeletonLoading';
import StatusBadge from '../../components/ui/StatusBadge';
import cacheManager from '../../utils/cacheManager';

const UserOverviewPage = () => {
    const { user } = useAuth();
    const { collections } = useCollection();
    const [loading, setLoading] = useState(true);
    const [myShowcases, setMyShowcases] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, showcase: null });
    const [deleting, setDeleting] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0
    });

    useEffect(() => {
        document.title = 'Dashboard Overview | Orasis';
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
                rejected: showcases.filter(s => s.status === 'rejected').length
            });
        } catch (error) {
            console.error('Error fetching showcases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.showcase) return;

        try {
            setDeleting(true);
            await userService.deleteShowcase(deleteModal.showcase.id);
            cacheManager.clearShowcases();
            setMyShowcases(prev => prev.filter(s => s.id !== deleteModal.showcase.id));
            setStats(prev => ({
                ...prev,
                total: prev.total - 1,
                [deleteModal.showcase.status]: prev[deleteModal.showcase.status] - 1
            }));
            setDeleteModal({ isOpen: false, showcase: null });
        } catch (error) {
            console.error('Failed to delete showcase:', error);
            alert('Failed to delete showcase. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <OverviewPageSkeleton />;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-linear-to-br from-violet-600 to-indigo-600 dark:from-violet-900 dark:to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                                Dashboard
                            </span>
                            <span className="text-white/60 text-sm font-medium">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black font-family-zentry mb-2">
                            Welcome back, {user?.name?.split(' ')[0]}!
                        </h1>
                        <p className="text-indigo-100 max-w-lg text-lg mb-8">
                            Ready to showcase your next big idea? You have <span className="font-bold text-white">{stats.total} projects</span> in your portfolio.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => window.location.href = '/showcase/new'}
                                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Create New Showcase
                            </button>
                            <button
                                onClick={() => window.location.href = '/profile'}
                                className="px-6 py-3 bg-indigo-700/50 hover:bg-indigo-700/70 text-white rounded-xl font-bold transition-colors backdrop-blur-sm"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats Bento */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-rows-2 gap-6"
                >
                    <div className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                                Live
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stats.approved}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Approved Showcases</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                        <div className="flex items-start justify-between">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                                In Review
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stats.pending}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending Review</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity / Showcases */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white dark:bg-dark-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-50 dark:bg-yellow-300/10 rounded-xl">
                                <Sparkles className="w-5 h-5 text-violet-600 dark:text-yellow-300" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Showcases</h2>
                        </div>
                        <a href="/dashboard/showcases" className="text-sm font-bold text-violet-600 dark:text-yellow-300 hover:opacity-80 transition-opacity flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="p-4">
                        {myShowcases.length > 0 ? (
                            <div className="space-y-3">
                                {myShowcases.slice(0, 4).map((showcase) => (
                                    <div
                                        key={showcase.id}
                                        onClick={() => window.location.href = `/design/${showcase.id}`}
                                        className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                                    >
                                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/40 shrink-0 relative">
                                            {showcase.image_url ? (
                                                <img
                                                    src={showcase.image_url}
                                                    alt={showcase.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                                {showcase.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{new Date(showcase.created_at).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                <span>{showcase.category?.name || 'Uncategorized'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StatusBadge status={showcase.status} size="sm" />
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/showcase/edit/${showcase.id}`;
                                                    }}
                                                    className="p-2 hover:bg-white dark:hover:bg-black/40 rounded-lg text-gray-500 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors shadow-sm"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteModal({ isOpen: true, showcase });
                                                    }}
                                                    className="p-2 hover:bg-white dark:hover:bg-black/40 rounded-lg text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-black/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Layout className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No showcases yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                                    Start building your portfolio by creating your first showcase project.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/showcase/new'}
                                    className="px-5 py-2.5 bg-violet-600 dark:bg-yellow-300 text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Create Showcase
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Collections & Quick Actions */}
                <div className="space-y-6">
                    {/* Collections Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Grid className="w-5 h-5 text-pink-500" />
                                Collections
                            </h2>
                            <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-300">
                                {collections.length}
                            </span>
                        </div>

                        {collections.length > 0 ? (
                            <div className="space-y-3">
                                {collections.slice(0, 3).map((collection) => (
                                    <div
                                        key={collection.id}
                                        onClick={() => window.location.href = '/collections'}
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl hover:bg-gray-100 dark:hover:bg-black/40 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-pink-500 transition-colors shadow-sm">
                                            <Folder className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                                {collection.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {collection.showcases_count || 0} items
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No collections yet</p>
                                <button
                                    onClick={() => window.location.href = '/collections'}
                                    className="text-sm font-bold text-pink-500 hover:underline"
                                >
                                    + Create Collection
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black dark:bg-white rounded-3xl p-6 text-white dark:text-black shadow-xl"
                    >
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => window.location.href = '/dashboard/showcases'}
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors text-left"
                            >
                                <div className="p-2 bg-white/10 dark:bg-black/10 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Manage Showcases</span>
                            </button>
                            <button
                                onClick={() => window.location.href = '/profile'}
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 dark:bg-black/5 hover:bg-white/20 dark:hover:bg-black/10 transition-colors text-left"
                            >
                                <div className="p-2 bg-white/10 dark:bg-black/10 rounded-lg">
                                    <Settings className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Account Settings</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteModal({ isOpen: false, showcase: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-dark-gray rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-white/10"
                        >
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Showcase?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">"{deleteModal.showcase?.title}"</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, showcase: null })}
                                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    {deleting ? <Spinner size="sm" color="white" /> : 'Delete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserOverviewPage;
