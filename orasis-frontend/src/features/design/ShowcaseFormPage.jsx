import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import showcaseService from '../../services/showcase.service';
import { useAuth } from '../../context/AuthContext';

const ShowcaseFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL if editing
    const { user } = useAuth();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url_website: '',
        image_url: '',
        category: 'Landing Page'
    });

    const [errors, setErrors] = useState({});

    const categories = [
        'Landing Page',
        'SaaS',
        'E-commerce',
        'Portfolio',
        'Dashboard',
        'Blog',
        'Web Design',
        'App Design',
        'Other'
    ];

    // Load showcase data if editing
    useEffect(() => {
        if (isEditMode && id) {
            loadShowcaseData(id);
        }
    }, [id, isEditMode]);

    const loadShowcaseData = async (showcaseId) => {
        try {
            setInitialLoading(true);
            const response = await showcaseService.getById(showcaseId);
            const showcase = response.data;

            // Check if user owns this showcase or is admin
            if (showcase.user_id !== user.id && user.role !== 'admin') {
                setMessage({ 
                    type: 'error', 
                    text: 'You do not have permission to edit this showcase.' 
                });
                setTimeout(() => navigate('/dashboard'), 2000);
                return;
            }

            setFormData({
                title: showcase.title,
                description: showcase.description,
                url_website: showcase.url_website,
                image_url: showcase.image_url,
                category: showcase.category
            });
        } catch (error) {
            console.error('Failed to load showcase:', error);
            setMessage({ 
                type: 'error', 
                text: 'Failed to load showcase data. Redirecting...' 
            });
            setTimeout(() => navigate('/dashboard'), 2000);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.url_website.trim()) {
            newErrors.url_website = 'Website URL is required';
        } else if (!isValidUrl(formData.url_website)) {
            newErrors.url_website = 'Please enter a valid URL';
        }

        if (!formData.image_url.trim()) {
            newErrors.image_url = 'Image URL is required';
        } else if (!isValidUrl(formData.image_url)) {
            newErrors.image_url = 'Please enter a valid image URL';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage({ 
                type: 'error', 
                text: 'Please fix the errors in the form.' 
            });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                url_website: formData.url_website.trim(),
                image_url: formData.image_url.trim(),
                category: formData.category
            };

            if (isEditMode) {
                await showcaseService.update(id, submitData);
                setMessage({ 
                    type: 'success', 
                    text: 'Showcase updated successfully!' 
                });
            } else {
                await showcaseService.create(submitData);
                setMessage({ 
                    type: 'success', 
                    text: 'Showcase created successfully!' 
                });
            }

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Form submission error:', error);
            const errorMessage = error.response?.data?.message 
                || error.message 
                || `Failed to ${isEditMode ? 'update' : 'create'} showcase`;
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Spinner size="xl" color="gray" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Loading showcase data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={handleCancel}
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 mb-4 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {isEditMode ? 'Edit Showcase' : 'Create New Showcase'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isEditMode 
                                ? 'Update the details of your showcase below.'
                                : 'Share your amazing work with the community.'
                            }
                        </p>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                    : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Showcase Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Modern E-Commerce Dashboard"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.title 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                                    } dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your showcase... What makes it special? What technologies did you use?"
                                    rows="5"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.description 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                                    } dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {formData.description.length} characters
                                </p>
                            </div>

                            {/* Website URL */}
                            <div>
                                <label htmlFor="url_website" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Website URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    id="url_website"
                                    name="url_website"
                                    value={formData.url_website}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.url_website 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                                    } dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                                />
                                {errors.url_website && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url_website}</p>
                                )}
                            </div>

                            {/* Image URL */}
                            <div>
                                <label htmlFor="image_url" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Image URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.image_url 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                                    } dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                                />
                                {errors.image_url && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image_url}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Use a direct link to your showcase screenshot or preview image
                                </p>
                                
                                {/* Image Preview */}
                                {formData.image_url && isValidUrl(formData.image_url) && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                                        <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                            <img 
                                                src={formData.image_url} 
                                                alt="Preview" 
                                                className="w-full h-64 object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.category 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                                    } dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent transition-colors`}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" color="white" />
                                        <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{isEditMode ? 'Update Showcase' : 'Create Showcase'}</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> Your showcase will be submitted for review. Once approved by an admin, it will be visible to all users.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ShowcaseFormPage;
