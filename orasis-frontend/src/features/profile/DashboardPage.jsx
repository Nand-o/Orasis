import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, Grid, Plus, Trash2, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollection } from '../../context/CollectionContext';
import userService from '../../services/user.service';
import adminService from '../../services/admin.service';
import ShowcaseCard from '../showcase/components/ShowcaseCard';
import CollectionCard from '../collections/components/CollectionCard';
import { ShowcasesPageSkeleton, CollectionsPageSkeleton } from '../../components/ui/SkeletonLoading';
import StatusBadge from '../../components/ui/StatusBadge';
import cacheManager from '../../utils/cacheManager';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { collections, loading: collectionsLoading } = useCollection();
    const [myShowcases, setMyShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('showcases'); // 'showcases' | 'collections'
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, showcase: null });
    const [deleting, setDeleting] = useState(false);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        document.title = isAdmin ? 'All Showcases | Admin | Orasis' : 'My Showcases | Orasis';
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

            // Clear showcase cache
            cacheManager.clearShowcases();

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

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {activeTab === 'showcases' ? 'My Showcases' : 'My Collections'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage and organize your portfolio content
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tabs */}
                    <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setActiveTab('showcases')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'showcases'
                                ? 'bg-white dark:bg-main-black text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Showcases
                        </button>
                        <button
                            onClick={() => setActiveTab('collections')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'collections'
                                ? 'bg-white dark:bg-main-black text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Collections
                        </button>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => navigate(activeTab === 'showcases' ? '/showcase/new' : '/collections')}
                        className="px-4 py-2.5 bg-violet-600 dark:bg-yellow-300 text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-violet-500/20 dark:shadow-yellow-300/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Create New</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
            >
                {activeTab === 'showcases' && (
                    <>
                        {loading ? (
                            <ShowcasesPageSkeleton />
                        ) : myShowcases.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myShowcases.map((showcase) => (
                                    <div key={showcase.id} className="relative group/card">
                                        <ShowcaseCard
                                            design={showcase}
                                            onClick={() => navigate(`/design/${showcase.id}`)}
                                            showBookmark={false}
                                        />

                                        {/* Overlay Actions */}
                                        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                                            <StatusBadge status={showcase.status} size="sm" />
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t dark:from-black/80 dark:via-black/40 from-black/30 via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-b-xl flex justify-end gap-2 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/showcase/edit/${showcase.id}`);
                                                }}
                                                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteClick(showcase, e)}
                                                className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-lg text-white transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No showcases yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs text-center">
                                    Share your work with the world. Create your first showcase project today.
                                </p>
                                <button
                                    onClick={() => navigate('/showcase/new')}
                                    className="px-6 py-3 bg-violet-600 dark:bg-yellow-300 text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Create Showcase
                                </button>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'collections' && (
                    <>
                        {collectionsLoading ? (
                            <CollectionsPageSkeleton />
                        ) : collections.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {collections.map((collection) => (
                                    <CollectionCard
                                        key={collection.id}
                                        collection={collection}
                                        onClick={() => navigate('/collections')}
                                        onDelete={() => { }}
                                        previewImages={getCollectionPreviews(collection.showcases)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="w-16 h-16 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                    <Grid className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No collections yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs text-center">
                                    Organize your favorite designs into collections for easy access.
                                </p>
                                <button
                                    onClick={() => navigate('/collections')}
                                    className="px-6 py-3 bg-violet-600 dark:bg-yellow-300 text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
                                >
                                    Create Collection
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleDeleteCancel}
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
                                    onClick={handleDeleteCancel}
                                    disabled={deleting}
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

export default DashboardPage;
