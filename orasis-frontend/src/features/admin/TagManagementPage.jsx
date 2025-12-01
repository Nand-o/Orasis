import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Tag as TagIcon, AlertCircle, CheckCircle } from 'lucide-react';
import tagService from '../../services/tag.service';
import { BadgeSkeleton } from '../../components/ui/Skeleton';

const TagManagementPage = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, tag: null });

    useEffect(() => {
        document.title = 'Tag Management | Admin | Orasis';
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await tagService.getAll();
            setTags(response);
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            showMessage('error', 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleOpenModal = (tag = null) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({ name: tag.name });
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
        if (!deleteModal.tag) return;

        try {
            await tagService.delete(deleteModal.tag.id);
            showMessage('success', 'Tag deleted successfully!');
            fetchTags();
            setDeleteModal({ isOpen: false, tag: null });
        } catch (error) {
            console.error('Failed to delete tag:', error);
            showMessage('error', error.response?.data?.message || 'Failed to delete tag');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Tag Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage tags for categorizing showcase submissions
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Tag
                    </button>
                </div>

                {/* Message */}
                <AnimatePresence>
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                                message.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                            }`}
                        >
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3">
                            {loading ? (
                                Array.from({ length: 12 }).map((_, index) => (
                                    <BadgeSkeleton key={index} />
                                ))
                            ) : tags.length > 0 ? (
                                tags.map((tag) => (
                                        <motion.div
                                            key={tag.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800 group"
                                        >
                                            <TagIcon className="w-4 h-4" />
                                            <span className="text-sm font-medium">#{tag.name}</span>
                                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(tag)}
                                                    className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded transition-colors"
                                                    title="Edit tag"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteModal({ isOpen: true, tag })}
                                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
                                                    title="Delete tag"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="w-full text-center py-12">
                                        <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">No tags yet</p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={handleCloseModal}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingTag ? 'Edit Tag' : 'Add New Tag'}
                                    </h2>
                                    <button
                                        onClick={handleCloseModal}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tag Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="e.g., modern, minimal, dark"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                                        >
                                            {editingTag ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteModal.isOpen && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                                onClick={() => setDeleteModal({ isOpen: false, tag: null })}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                            >
                                <div className="mb-4">
                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        Delete Tag
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Are you sure you want to delete "<strong>#{deleteModal.tag?.name}</strong>"? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: false, tag: null })}
                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TagManagementPage;
