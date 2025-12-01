import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Clock, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import showcaseService from '../../services/showcase.service';
import Spinner from '../../components/ui/Spinner';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'users'
    const [showcases, setShowcases] = useState([]);
    const [pendingShowcases, setPendingShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
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
            pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
            rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Spinner size="xl" color="gray" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all showcases and moderate submissions
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Showcases</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalShowcases}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Review</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingShowcases}</p>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Approved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approvedShowcases}</p>
                            </div>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejectedShowcases}</p>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                                    activeTab === 'all'
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                All Showcases ({stats.totalShowcases})
                                {activeTab === 'all' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`relative px-6 py-4 text-sm font-medium transition-colors ${
                                    activeTab === 'pending'
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                Pending Review ({stats.pendingShowcases})
                                {activeTab === 'pending' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'all' && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Author</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {showcases.map((showcase) => (
                                            <tr key={showcase.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="py-4 px-4">
                                                    <div className="font-medium text-gray-900 dark:text-white">{showcase.title}</div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                    {showcase.user?.name || 'Unknown'}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(showcase.status)}`}>
                                                        {showcase.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                                    {showcase.category?.name || 'N/A'}
                                                </td>
                                                <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                                                    {new Date(showcase.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={`/design/${showcase.id}`}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(showcase.id)}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {showcases.length === 0 && (
                                    <div className="text-center py-12">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">No showcases found</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'pending' && (
                            <div className="space-y-4">
                                {pendingShowcases.map((showcase) => (
                                    <motion.div
                                        key={showcase.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {showcase.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                    {showcase.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>By {showcase.user?.name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(showcase.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleStatusChange(showcase.id, 'approved')}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(showcase.id, 'rejected')}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {pendingShowcases.length === 0 && (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">All caught up! No pending reviews.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
