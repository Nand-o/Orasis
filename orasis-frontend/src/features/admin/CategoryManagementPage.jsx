import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Tag, AlertCircle, CheckCircle } from 'lucide-react';
import categoryService from '../../services/category.service';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });

    useEffect(() => {
        document.title = 'Category Management | Admin | Orasis';
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll();
            setCategories(response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            showMessage('error', 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        } else {
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            showMessage('error', 'Category name is required');
            return;
        }

        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, formData);
                showMessage('success', 'Category updated successfully!');
            } else {
                await categoryService.create(formData);
                showMessage('success', 'Category created successfully!');
            }

            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save category:', error);
            showMessage('error', error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.category) return;

        try {
            await categoryService.delete(deleteModal.category.id);
            showMessage('success', 'Category deleted successfully!');
            fetchCategories();
            setDeleteModal({ isOpen: false, category: null });
        } catch (error) {
            console.error('Failed to delete category:', error);
            showMessage('error', error.response?.data?.message || 'Failed to delete category');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Category Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Manage website categories for showcase submissions
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRowSkeleton key={index} columns={2} />
                                    ))
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(category)}
                                                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="Edit category"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal({ isOpen: true, category })}
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete category"
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
                                                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 dark:text-gray-400">No categories yet</p>
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
                                        {editingCategory ? 'Edit Category' : 'Add New Category'}
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
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="e.g., E-commerce, Blog, Portfolio"
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
                                            {editingCategory ? 'Update' : 'Create'}
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
                                onClick={() => setDeleteModal({ isOpen: false, category: null })}
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
                                        Delete Category
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Are you sure you want to delete "<strong>{deleteModal.category?.name}</strong>"? This action cannot be undone.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: false, category: null })}
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

export default CategoryManagementPage;
