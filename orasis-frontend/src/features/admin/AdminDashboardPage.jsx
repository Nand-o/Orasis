import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Clock, CheckCircle, XCircle, Trash2, Eye, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import showcaseService from '../../services/showcase.service';
import { ShowcasesPageSkeleton } from '../../components/ui/SkeletonLoading';

const AdminDashboardPage = () => {
    useAuth();
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'users'
    const [showcases, setShowcases] = useState([]);
    const [pendingShowcases, setPendingShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(25);
    const [jumpToPage, setJumpToPage] = useState('');
    const [stats, setStats] = useState({
        totalShowcases: 0,
        approvedShowcases: 0,
        pendingShowcases: 0,
        rejectedShowcases: 0,
        totalUsers: 0
    });

    useEffect(() => {
        document.title = 'All Showcases | Admin | Orasis';
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all showcases for admin (no pagination)
            const showcasesResponse = await showcaseService.getAllForAdmin();
            const allShowcases = showcasesResponse.data;
            setShowcases(allShowcases);

            // Filter pending showcases
            const pending = allShowcases.filter(s => s.status === 'pending');
            setPendingShowcases(pending);

            // Calculate stats
            setStats({
                totalShowcases: allShowcases.length,
                approvedShowcases: allShowcases.filter(s => s.status === 'approved').length,
                pendingShowcases: pending.length,
                rejectedShowcases: allShowcases.filter(s => s.status === 'rejected').length,
                totalUsers: 0 // TODO: Add user count from backend
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (showcaseId) => {
        if (!confirm('Are you sure you want to delete this showcase?')) return;

        try {
            await showcaseService.delete(showcaseId);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error deleting showcase:', error);
            alert('Failed to delete showcase');
        }
    };

    const handleStatusChange = async (showcaseId, newStatus) => {
        try {
            // TODO: Add admin status update endpoint
            await showcaseService.updateStatus(showcaseId, newStatus);
            fetchDashboardData(); // Refresh data
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            pending: 'bg-yellow-300 dark:bg-yellow-900/30 text-yellow-400 dark:text-yellow-400',
            rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return badges[status] || badges.pending;
    };

    // Pagination Logic
    const totalPages = Math.ceil(showcases.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentShowcases = showcases.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const page = parseInt(jumpToPage);
        if (page >= 1 && page <= totalPages) {
            handlePageChange(page);
            setJumpToPage('');
        }
    };

    const renderPagination = () => {
        const pages = [];
        const showPages = 5; // Show 5 page numbers at a time
        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 dark:border-white/5 pt-6 gap-4">
                {/* Left: Info */}
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{Math.min(endIndex, showcases.length)}</span> of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{showcases.length}</span> showcases
                </div>

                {/* Center: Pagination */}
                <div className="flex items-center gap-2 justify-center w-full md:w-auto">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => handlePageChange(1)}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="text-gray-400">...</span>}
                        </>
                    )}

                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-violet-600 dark:bg-yellow-300 text-white dark:text-black'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Right: Jump to Page */}
                <form onSubmit={handleJumpToPage} className="flex items-center gap-2 justify-center md:justify-end w-full md:w-auto">
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Go to:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        placeholder="Page"
                        className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-white/5 rounded-lg bg-white dark:bg-dark-gray text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Go
                    </button>
                </form>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-main-black py-8 px-4 sm:px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <ShowcasesPageSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage all showcases and moderate submissions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Showcases</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white font-zentry">{stats.totalShowcases}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/20 transition-colors" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Review</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white font-zentry">{stats.pendingShowcases}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-yellow-300 dark:bg-yellow-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-yellow-400 dark:text-yellow-400" />
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-yellow-50 dark:bg-yellow-900/10 rounded-full blur-2xl group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/20 transition-colors" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Approved</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white font-zentry">{stats.approvedShowcases}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full blur-2xl group-hover:bg-green-100 dark:group-hover:bg-green-900/20 transition-colors" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-dark-gray rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group"
                >
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white font-zentry">{stats.rejectedShowcases}</h3>
                    </div>
                    <div className="absolute right-4 top-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full blur-2xl group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors" />
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="border-b border-gray-100 dark:border-white/5">
                    <div className="flex p-2 gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all'
                                ? 'bg-indigo-50 dark:bg-yellow-200/20 text-indigo-600 dark:text-yellow-300 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            All Showcases ({stats.totalShowcases})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending'
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                        >
                            Pending Review ({stats.pendingShowcases})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-0">
                    {activeTab === 'all' && (
                        <>
                            {/* Mobile Card View (Visible on Mobile) */}
                            <div className="md:hidden p-4 space-y-4">
                                {currentShowcases.map((showcase) => (
                                    <div key={showcase.id} className="bg-white dark:bg-dark-gray rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm">
                                        <div className="flex gap-4">
                                            {/* Image placeholder or actual image if available in object, assuming standard 'image_url' */}
                                            {showcase.image_url && (
                                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 mt-1">
                                                    <img src={showcase.image_url} alt={showcase.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                                        {showcase.title}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStatusBadge(showcase.status)}`}>
                                                        {showcase.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                    by {showcase.user?.name || 'Unknown'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                    {new Date(showcase.created_at).toLocaleDateString()}
                                                </p>

                                                <div className="flex gap-2 mt-3">
                                                    <a
                                                        href={`/design/${showcase.id}`}
                                                        className="flex-1 py-1.5 bg-white dark:bg-black/20 text-center rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                                                    >
                                                        View
                                                    </a>
                                                    <a
                                                        href={`/showcase/edit/${showcase.id}`}
                                                        className="flex-1 py-1.5 bg-violet-50 dark:bg-yellow-200/30 text-center rounded-lg text-xs font-bold text-violet-600 dark:text-yellow-300"
                                                    >
                                                        Edit
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(showcase.id)}
                                                        className="flex-1 py-1.5 bg-red-50 dark:bg-red-900/20 text-center rounded-lg text-xs font-bold text-red-600 dark:text-red-400"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Showcase</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {currentShowcases.map((showcase) => (
                                            <tr key={showcase.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        {showcase.image_url && (
                                                            <img src={showcase.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-white/10" />
                                                        )}
                                                        <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{showcase.title}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                                    {showcase.user?.name || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusBadge(showcase.status)}`}>
                                                        {showcase.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                                    {showcase.category?.name || 'N/A'}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(showcase.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <a
                                                            href={`/design/${showcase.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-yellow-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                        <a
                                                            href={`/showcase/edit/${showcase.id}`}
                                                            className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Edit showcase"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(showcase.id)}
                                                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {showcases.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No showcases found</p>
                                </div>
                            ) : (
                                <div className="p-4 border-t border-gray-100 dark:border-white/5">
                                    {renderPagination()}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'pending' && (
                        <div className="p-4 space-y-4">
                            {pendingShowcases.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-12 h-12 text-green-300 dark:text-green-900/50 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">All caught up! No pending reviews.</p>
                                </div>
                            ) : (
                                pendingShowcases.map((showcase) => (
                                    <motion.div
                                        key={showcase.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4 sm:p-6 hover:border-yellow-300 dark:hover:border-yellow-300/50 transition-colors group"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start gap-4">
                                            {/* Image for pending items if available */}
                                            {showcase.image_url && (
                                                <div className="w-full sm:w-32 h-48 sm:h-24 rounded-xl overflow-hidden shrink-0">
                                                    <img src={showcase.image_url} alt={showcase.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                        {showcase.title}
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-yellow-300 dark:bg-yellow-900/30 text-yellow-400 dark:text-yellow-400 shrink-0">
                                                        Pending Review
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                    {showcase.description}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                        By {showcase.user?.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                        {new Date(showcase.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                <button
                                                    onClick={() => handleStatusChange(showcase.id, 'approved')}
                                                    className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-green-500/20"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(showcase.id, 'rejected')}
                                                    className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
