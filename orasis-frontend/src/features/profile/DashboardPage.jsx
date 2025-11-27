import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Grid, Plus, BarChart3, Pencil, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollection } from '../../context/CollectionContext';
import userService from '../../services/user.service';
import adminService from '../../services/admin.service';
import ShowcaseCard from '../design/components/ShowcaseCard';
import CollectionCard from '../collections/components/CollectionCard';
import Spinner from '../../components/ui/Spinner';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { collections } = useCollection();
    const [myShowcases, setMyShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('showcases'); // 'showcases' | 'collections'
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, showcase: null });
    const [deleting, setDeleting] = useState(false);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        document.title = isAdmin ? 'All Showcases | Admin' : 'My Dashboard | Orasis';
        fetchMyShowcases();
    }, [isAdmin]);

    const fetchMyShowcases = async () => {
        try {
            setLoading(true);
            
            // If admin, get all showcases, otherwise get user's showcases
            const response = isAdmin 
                ? await adminService.getAllShowcases()
                : await userService.getMyShowcases();
            
            // Transform data
            const transformedData = response.data.map(showcase => ({
                ...showcase,
                imageUrl: showcase.image_url,
                urlWebsite: showcase.url_website,
            }));
            
            setMyShowcases(transformedData);
        } catch (error) {
            console.error('Failed to fetch showcases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (showcase, e) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, showcase });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.showcase) return;

        try {
            setDeleting(true);
            await userService.deleteShowcase(deleteModal.showcase.id);
            
            // Remove from local state
            setMyShowcases(prev => prev.filter(s => s.id !== deleteModal.showcase.id));
            
            // Close modal
            setDeleteModal({ isOpen: false, showcase: null });
        } catch (error) {
            console.error('Failed to delete showcase:', error);
            alert('Failed to delete showcase. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, showcase: null });
    };

    const getCollectionPreviews = (showcases) => {
        if (!showcases || !Array.isArray(showcases)) return [];
        return showcases
            .map(s => s.image_url || s.imageUrl)
            .filter(Boolean)
            .slice(0, 4);
    };

    // Stats
    const stats = [
        {
            label: 'Total Showcases',
            value: myShowcases.length,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            label: 'Collections',
            value: collections.length,
            icon: Grid,
            color: 'bg-purple-500',
        },
        {
            label: 'Approved',
            value: myShowcases.filter(s => s.status === 'approved').length,
            icon: BarChart3,
            color: 'bg-green-500',
        },
        {
            label: 'Pending',
            value: myShowcases.filter(s => s.status === 'pending').length,
            icon: BarChart3,
            color: 'bg-yellow-500',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your showcases and collections
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
                className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <button
                    onClick={() => setActiveTab('showcases')}
                    className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'showcases'
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    My Showcases
                    {activeTab === 'showcases' && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                            layoutId="activeTab"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('collections')}
                    className={`px-6 py-3 font-medium transition-colors relative ${
                        activeTab === 'collections'
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    My Collections
                    {activeTab === 'collections' && (
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                            layoutId="activeTab"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                {activeTab === 'showcases' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {isAdmin ? `All Showcases (${myShowcases.length})` : `Your Showcases (${myShowcases.length})`}
                            </h2>
                            {!isAdmin && (
                                <button
                                    onClick={() => navigate('/showcase/new')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Spinner size="xl" color="gray" />
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading your showcases...</p>
                            </div>
                        ) : myShowcases.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myShowcases.map((showcase) => (
                                    <div key={showcase.id} className="relative group/card">
                                        <ShowcaseCard
                                            design={showcase}
                                            onClick={() => navigate(`/design/${showcase.id}`)}
                                            showBookmark={false}
                                        />
                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                showcase.status === 'approved'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : showcase.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                                {showcase.status}
                                            </span>
                                            {isAdmin && showcase.user && (
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                                    By {showcase.user.name}
                                                </span>
                                            )}
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="absolute bottom-16 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/showcase/edit/${showcase.id}`);
                                                }}
                                                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 border border-gray-200 dark:border-gray-700"
                                                title={isAdmin ? "Edit showcase (Admin)" : "Edit showcase"}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(showcase, e)}
                                                className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:scale-110 border border-gray-200 dark:border-gray-700"
                                                title="Delete showcase"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No showcases yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Create your first showcase to get started
                                </p>
                                <button
                                    onClick={() => navigate('/showcase/new')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Showcase
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'collections' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Your Collections ({collections.length})
                            </h2>
                            <button
                                onClick={() => navigate('/collections')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
                            >
                                <Grid className="w-4 h-4" />
                                Manage Collections
                            </button>
                        </div>

                        {collections.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {collections.map((collection) => (
                                    <CollectionCard
                                        key={collection.id}
                                        collection={collection}
                                        onClick={() => navigate('/collections')}
                                        onDelete={() => {}}
                                        previewImages={getCollectionPreviews(collection.showcases)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No collections yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Start organizing your favorite showcases
                                </p>
                                <button
                                    onClick={() => navigate('/collections')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-90 transition-opacity"
                                >
                                    <Grid className="w-5 h-5" />
                                    Go to Collections
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleDeleteCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Delete Showcase
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDeleteCancel}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <p className="text-gray-600 dark:text-gray-300 mb-3">
                                    Are you sure you want to delete{' '}
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        "{deleteModal.showcase?.title}"
                                    </span>
                                    ?
                                </p>
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-300">
                                        ⚠️ This will permanently remove the showcase from your account and all collections.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete Showcase
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

export default DashboardPage;
