/**
 * TagManagementPage
 *
 * Halaman administrasi untuk mengelola tag. Menyediakan CRUD tag,
 * pencarian, dan feedback status operasi. Berkomunikasi dengan
 * `tagService` untuk operasi backend.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Tag as TagIcon, AlertCircle, CheckCircle, Search, Hash } from 'lucide-react';
import tagService from '../../services/tag.service';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const TagManagementPage = () => {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, tag: null });

    useEffect(() => {
        document.title = 'Tag Management | Admin | Orasis';
        fetchTags();
    }, []);

    useEffect(() => {
        filterTags();
    }, [searchQuery, tags]);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await tagService.getAll();
            setTags(response || []);
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            showMessage('error', 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    const filterTags = () => {
        if (!searchQuery.trim()) {
            setFilteredTags(tags);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = tags.filter(tag =>
            tag.name.toLowerCase().includes(query)
        );
        setFilteredTags(filtered);
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleOpenModal = (tag = null) => {
        if (tag) {
            // Ensure tag has valid ID before proceeding
            if (!tag.id) {
                console.error('Tag ID is missing:', tag);
                showMessage('error', 'Invalid tag data - ID is missing');
                return;
            }
            setEditingTag(tag);
            setFormData({ name: tag.name });
            console.log('Opening edit modal for tag:', tag.id, tag.name);
        } else {
            setEditingTag(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTag(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            showMessage('error', 'Tag name is required');
            return;
        }

        try {
            if (editingTag) {
                // Double-check ID exists before making API call
                if (!editingTag.id) {
                    console.error('Cannot update tag - ID is missing:', editingTag);
                    showMessage('error', 'Cannot update tag - invalid ID');
                    return;
                }
                console.log('Updating tag with ID:', editingTag.id);
                await tagService.update(editingTag.id, formData);
                showMessage('success', 'Tag updated successfully!');
            } else {
                await tagService.create(formData);
                showMessage('success', 'Tag created successfully!');
            }

            fetchTags();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save tag:', error);
            showMessage('error', error.response?.data?.message || 'Failed to save tag');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.tag) {
            console.error('No tag selected for deletion');
            return;
        }

        if (!deleteModal.tag.id) {
            console.error('Tag ID is missing:', deleteModal.tag);
            showMessage('error', 'Cannot delete tag - invalid ID');
            setDeleteModal({ isOpen: false, tag: null });
            return;
        }

        try {
            console.log('Deleting tag with ID:', deleteModal.tag.id);
            await tagService.delete(deleteModal.tag.id);
            showMessage('success', 'Tag deleted successfully!');
            fetchTags();
            setDeleteModal({ isOpen: false, tag: null });
        } catch (error) {
            console.error('Failed to delete tag:', error);
            showMessage('error', error.response?.data?.message || 'Failed to delete tag');
            setDeleteModal({ isOpen: false, tag: null });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Tag Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage tags for categorizing showcase submissions
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white" />
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full lg:w-64 pl-10 pr-4 py-2 bg-white dark:bg-dark-gray border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 text-gray-400 dark:text-white"
                        />
                    </div>
                    <motion.button
                        onClick={() => handleOpenModal()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-violet-300/90 hover:bg-violet-300 dark:bg-yellow-300/90 hover:dark:bg-yellow-300 dark:text-main-black text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-violet-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Tag</span>
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-dark-gray rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tag Name
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRowSkeleton key={index} columns={2} />
                                ))
                            ) : filteredTags.length > 0 ? (
                                filteredTags.map((tag) => (
                                    <tr
                                        key={tag.id}
                                        className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-main-black flex items-center justify-center text-violet-300 dark:text-yellow-300">
                                                    <Hash className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-yellow-300 transition-colors">
                                                    {tag.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(tag)}
                                                    className="p-2 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-yellow-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit tag"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, tag })}
                                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete tag"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <TagIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {searchQuery ? 'No tags found' : 'No tags yet'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white dark:bg-dark-gray rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {editingTag ? 'Edit Tag' : 'Add New Tag'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Tag Name
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="e.g., modern, minimal, dark"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-yellow-300 text-gray-900 dark:text-white transition-all"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 text-white dark:text-main-black rounded-xl font-bold transition-colors shadow-lg shadow-violet-500/20"
                                    >
                                        {editingTag ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setDeleteModal({ isOpen: false, tag: null })}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-white dark:bg-dark-gray rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-white/10"
                        >
                            <div className="mb-6 text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Tag
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete "<strong>#{deleteModal.tag?.name}</strong>"? This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, tag: null })}
                                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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

export default TagManagementPage;
