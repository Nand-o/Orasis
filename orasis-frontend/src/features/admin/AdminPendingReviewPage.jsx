import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Calendar,
    User as UserIcon,
    ExternalLink,
    AlertCircle,
    Square,
    CheckSquare,
    MoreVertical,
    Search,
    Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/admin.service';
import { PendingReviewPageSkeleton } from '../../components/ui/SkeletonLoading';
import cacheManager from '../../utils/cacheManager';

const AdminPendingReviewPage = () => {
    const { user } = useAuth();
    const [pendingShowcases, setPendingShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

            cacheManager.clearShowcases();
            setPendingShowcases(prev => prev.filter(s => s.id !== showcaseId));

            setMessage({
                type: 'success',
                text: `Showcase ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`
            });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error updating status:', error);
            setMessage({ type: 'error', text: 'Failed to update showcase status' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleBulkAction = async (status) => {
        if (selectedIds.length === 0) return;

        const action = status === 'approved' ? 'approve' : 'reject';
        if (!confirm(`Are you sure you want to ${action} ${selectedIds.length} showcase(s)?`)) return;

        try {
            setBulkActionLoading(true);
            await adminService.bulkUpdateStatus(selectedIds, status);

            cacheManager.clearShowcases();
            setPendingShowcases(prev => prev.filter(s => !selectedIds.includes(s.id)));
            setSelectedIds([]);

            setMessage({
                type: 'success',
                text: `${selectedIds.length} showcase(s) ${status === 'approved' ? 'approved' : 'rejected'} successfully!`
            });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Error bulk updating status:', error);
            setMessage({ type: 'error', text: 'Failed to update showcases' });
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
        if (selectedIds.length === filteredShowcases.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredShowcases.map(s => s.id));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredShowcases = pendingShowcases.filter(showcase =>
        showcase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showcase.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <PendingReviewPageSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Review</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage and moderate user submissions
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                        <input
                            type="text"
                            placeholder="Search showcases..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-gray-400 dark:text-white bg-white dark:bg-dark-gray border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl shrink-0">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                            {pendingShowcases.length} Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-violet-600 dark:bg-yellow-300 text-white dark:text-black rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-lg gap-3"
                    >
                        <span className="font-bold">{selectedIds.length} selected</span>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => handleBulkAction('rejected')}
                                disabled={bulkActionLoading}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white/20 dark:bg-black/10 hover:bg-white/30 dark:hover:bg-black/20 rounded-lg font-medium transition-colors backdrop-blur-sm whitespace-nowrap"
                            >
                                Reject Selected
                            </button>
                            <button
                                onClick={() => handleBulkAction('approved')}
                                disabled={bulkActionLoading}
                                className="flex-1 sm:flex-none px-4 py-2 bg-white text-violet-600 dark:bg-black dark:text-yellow-300 rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors shadow-sm whitespace-nowrap"
                            >
                                Approve Selected
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Card View (Visible on Mobile) */}
            <div className="md:hidden space-y-4">
                {filteredShowcases.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                            <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                            <p>No pending reviews found</p>
                        </div>
                    </div>
                ) : (
                    filteredShowcases.map((showcase) => (
                        <div key={showcase.id} className={`bg-white dark:bg-dark-gray rounded-2xl border border-gray-200 dark:border-white/5 p-4 shadow-sm ${selectedIds.includes(showcase.id) ? 'ring-2 ring-violet-500 dark:ring-yellow-300' : ''}`}>
                            <div className="flex items-start gap-4 mb-4">
                                <button
                                    onClick={() => toggleSelect(showcase.id)}
                                    className="pt-1 text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors shrink-0"
                                >
                                    {selectedIds.includes(showcase.id) ? (
                                        <CheckSquare className="w-5 h-5 text-violet-600 dark:text-yellow-300" />
                                    ) : (
                                        <Square className="w-5 h-5" />
                                    )}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                        {showcase.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-violet-600 dark:text-gray-300 shrink-0">
                                            {showcase.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {showcase.user?.name || 'Unknown'}
                                        </span>
                                    </div>
                                    <a
                                        href={showcase.url_website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        {new URL(showcase.url_website).hostname}
                                    </a>
                                </div>
                                <div className="w-16 h-12 rounded-lg bg-gray-100 dark:bg-white/10 shrink-0 overflow-hidden border border-gray-200 dark:border-white/10">
                                    <img
                                        src={showcase.image_url}
                                        alt={showcase.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(showcase.created_at)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => window.open(`/design/${showcase.id}`, '_blank')}
                                        className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(showcase.id, 'rejected')}
                                        disabled={actionLoading === showcase.id}
                                        className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    >
                                        {actionLoading === showcase.id ? <Spinner size="sm" /> : <XCircle className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(showcase.id, 'approved')}
                                        disabled={actionLoading === showcase.id}
                                        className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                                    >
                                        {actionLoading === showcase.id ? <Spinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-left w-12">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors"
                                    >
                                        {selectedIds.length === filteredShowcases.length && filteredShowcases.length > 0 ? (
                                            <CheckSquare className="w-5 h-5 text-violet-600 dark:text-yellow-300" />
                                        ) : (
                                            <Square className="w-5 h-5" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Showcase</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredShowcases.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <CheckCircle className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p>No pending reviews found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredShowcases.map((showcase) => (
                                    <tr
                                        key={showcase.id}
                                        className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${selectedIds.includes(showcase.id) ? 'bg-violet-50/50 dark:bg-transparent' : ''
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleSelect(showcase.id)}
                                                className="text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors"
                                            >
                                                {selectedIds.includes(showcase.id) ? (
                                                    <CheckSquare className="w-5 h-5 text-violet-600 dark:text-yellow-300" />
                                                ) : (
                                                    <Square className="w-5 h-5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10 shrink-0 border border-gray-200 dark:border-white/10">
                                                    <img
                                                        src={showcase.image_url}
                                                        alt={showcase.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                                        {showcase.title}
                                                    </h3>
                                                    <a
                                                        href={showcase.url_website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs text-gray-500 dark:text-gray-400 hover:underline flex items-center gap-1 mt-0.5"
                                                    >
                                                        {new URL(showcase.url_website).hostname}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 dark:from-yellow-300 dark:to-yellow-700 flex items-center justify-center text-white dark:text-main-black text-xs font-bold">
                                                    {showcase.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {showcase.user?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(showcase.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50">
                                                <Clock className="w-3 h-3" />
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => window.open(`/design/${showcase.id}`, '_blank')}
                                                    className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Preview"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(showcase.id, 'approved')}
                                                    disabled={actionLoading === showcase.id}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    {actionLoading === showcase.id ? <Spinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(showcase.id, 'rejected')}
                                                    disabled={actionLoading === showcase.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    {actionLoading === showcase.id ? <Spinner size="sm" /> : <XCircle className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${message.type === 'success'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPendingReviewPage;
