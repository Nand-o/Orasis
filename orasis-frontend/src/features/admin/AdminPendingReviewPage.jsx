import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Eye, Calendar, User as UserIcon, ExternalLink, AlertCircle, Square, CheckSquare } from 'lucide-react';
import adminService from '../../services/admin.service';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import cacheManager from '../../utils/cacheManager';

const AdminPendingReviewPage = () => {
    const { user } = useAuth();
    const [pendingShowcases, setPendingShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedShowcase, setSelectedShowcase] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    useEffect(() => {
        document.title = 'Pending Review | Admin | Orasis';
        fetchPendingShowcases();
    }, []);

    const fetchPendingShowcases = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingShowcases();
            setPendingShowcases(response.data || []);
        } catch (error) {
            console.error('Error fetching pending showcases:', error);
            setMessage({ type: 'error', text: 'Failed to load pending showcases' });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (showcaseId, newStatus) => {
        try {
            setActionLoading(showcaseId);
            await adminService.updateShowcaseStatus(showcaseId, newStatus);
            
            // Clear cache after status update
            cacheManager.clearShowcases();
            
            // Remove from pending list
            setPendingShowcases(prev => prev.filter(s => s.id !== showcaseId));
            
            setMessage({
                type: 'success',
                text: `Showcase ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`
            });

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating status:', error);
            setMessage({
                type: 'error',
                text: 'Failed to update showcase status'
            });
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkAction = async (status) => {
        if (selectedIds.length === 0) {
            setMessage({
                type: 'error',
                text: 'Please select at least one showcase'
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            return;
        }

        const action = status === 'approved' ? 'approve' : 'reject';
        if (!confirm(`Are you sure you want to ${action} ${selectedIds.length} showcase(s)?`)) {
            return;
        }

        try {
            setBulkActionLoading(true);
            await adminService.bulkUpdateStatus(selectedIds, status);
            
            // Clear cache after bulk status update
            cacheManager.clearShowcases();
            
            // Remove from pending list
            setPendingShowcases(prev => prev.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);
            
            setMessage({
                type: 'success',
                text: `${selectedIds.length} showcase(s) ${status === 'approved' ? 'approved' : 'rejected'} successfully!`
            });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error bulk updating status:', error);
            setMessage({
                type: 'error',
                text: 'Failed to update showcases'
            });
        } finally {
            setBulkActionLoading(false);
        }
    };

    const toggleSelect = (showcaseId) => {
        setSelectedIds(prev => 
            prev.includes(showcaseId) 
                ? prev.filter(id => id !== showcaseId)
                : [...prev, showcaseId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === pendingShowcases.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingShowcases.map(s => s.id));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Spinner size="xl" color="gray" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Loading pending reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Review</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Review and approve or reject submitted showcases
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-2">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <div className="text-sm">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                            {pendingShowcases.length} Pending
                        </p>
                        <p className="text-yellow-600 dark:text-yellow-400">Awaiting review</p>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {pendingShowcases.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={toggleSelectAll}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                {selectedIds.length === pendingShowcases.length ? (
                                    <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                    <Square className="w-5 h-5 text-gray-400" />
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {selectedIds.length === pendingShowcases.length ? 'Deselect All' : 'Select All'}
                                </span>
                            </motion.button>
                            {selectedIds.length > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    {selectedIds.length} selected
                                </motion.span>
                            )}
                        </div>
                        
                        <AnimatePresence>
                            {selectedIds.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex gap-3"
                                >
                                    <motion.button
                                        onClick={() => handleBulkAction('rejected')}
                                        disabled={bulkActionLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject {selectedIds.length}
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleBulkAction('approved')}
                                        disabled={bulkActionLoading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve {selectedIds.length}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl ${
                            message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            )}
                            <p className={message.type === 'success' 
                                ? 'text-green-800 dark:text-green-200' 
                                : 'text-red-800 dark:text-red-200'
                            }>
                                {message.text}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pending Showcases List */}
            {pendingShowcases.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        All Caught Up!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        No pending showcases to review at the moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingShowcases.map((showcase, index) => (
                        <motion.div
                            key={showcase.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Image Preview */}
                                <div className="lg:w-2/5 relative">
                                    <img
                                        src={showcase.image_url}
                                        alt={showcase.title}
                                        className="w-full h-64 lg:h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <motion.button
                                            onClick={() => toggleSelect(showcase.id)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`p-2 rounded-lg transition-colors ${
                                                selectedIds.includes(showcase.id)
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400'
                                            }`}
                                        >
                                            {selectedIds.includes(showcase.id) ? (
                                                <CheckSquare className="w-5 h-5" />
                                            ) : (
                                                <Square className="w-5 h-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">
                                            Pending
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="lg:w-3/5 p-6 flex flex-col">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {showcase.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                                    {showcase.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {showcase.category && (
                                                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-medium">
                                                            {showcase.category.name}
                                                        </span>
                                                    )}
                                                    {showcase.tags?.map(tag => (
                                                        <span 
                                                            key={tag.id}
                                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs"
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <UserIcon className="w-4 h-4" />
                                                <span>By {showcase.user?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>Submitted {formatDate(showcase.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Website Link */}
                                        <a
                                            href={showcase.url_website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Visit Website
                                        </a>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => window.open(`/design/${showcase.id}`, '_blank')}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(showcase.id, 'rejected')}
                                            disabled={actionLoading === showcase.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {actionLoading === showcase.id ? 'Processing...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(showcase.id, 'approved')}
                                            disabled={actionLoading === showcase.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {actionLoading === showcase.id ? 'Processing...' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPendingReviewPage;
