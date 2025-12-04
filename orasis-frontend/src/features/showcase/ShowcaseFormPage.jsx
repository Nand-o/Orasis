import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import showcaseService from '../../services/showcase.service';
import tagService from '../../services/tag.service';
import categoryService from '../../services/category.service';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ui/ImageUpload';
import { ShowcaseFormPageSkeleton } from '../../components/ui/SkeletonLoading';
import UploadProgressBar from '../../components/ui/UploadProgressBar';
import cacheManager from '../../utils/cacheManager';
import { ChevronLeft, Upload, Link as LinkIcon, Image as ImageIcon, Check, AlertCircle, Spinner } from 'lucide-react';

const ShowcaseFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL if editing
    const { user } = useAuth();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('uploading'); // uploading, processing, success, error

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url_website: '',
        image_url: '',
        logo_url: '',
        category_id: '',
        tags: []
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [useUrlMode, setUseUrlMode] = useState(true);
    const [useLogoUrlMode, setUseLogoUrlMode] = useState(true);
    const [errors, setErrors] = useState({});
    const [availableTags, setAvailableTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Load showcase data if editing
    useEffect(() => {
        document.title = isEditMode ? 'Edit Showcase | Orasis' : 'Create Showcase | Orasis';
        loadAvailableTags();
        loadCategories();
        if (isEditMode && id) {
            loadShowcaseData(id);
        }
    }, [id, isEditMode]);

    const loadAvailableTags = async () => {
        try {
            setLoadingTags(true);
            const tags = await tagService.getAll();
            setAvailableTags(tags);
        } catch (error) {
            console.error('Failed to load tags:', error);
        } finally {
            setLoadingTags(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const cats = await categoryService.getAll();
            setCategories(cats);
            // Set first category as default if creating new showcase
            if (!isEditMode && cats.length > 0) {
                setFormData(prev => ({ ...prev, category_id: cats[0].id }));
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

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
                logo_url: showcase.logo_url || '',
                category_id: showcase.category_id || showcase.category?.id || '',
                tags: showcase.tags ? showcase.tags.map(tag => tag.id) : []
            });
            setImagePreview(showcase.image_url);
            setLogoPreview(showcase.logo_url);
            // If it's a stored image (not external URL), switch to upload mode
            if (showcase.image_url && !showcase.image_url.startsWith('http')) {
                setUseUrlMode(false);
            }
            if (showcase.logo_url && !showcase.logo_url.startsWith('http')) {
                setUseLogoUrlMode(false);
            }
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

    const handleImageUpload = (file, preview) => {
        setImageFile(file);
        setImagePreview(preview);
        setFormData(prev => ({ ...prev, image_url: '' }));
        // Clear image error - remove the key entirely
        setErrors(prev => {
            if (!prev.image) return prev;
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
        });
    };

    const handleLogoUpload = (file, preview) => {
        setLogoFile(file);
        setLogoPreview(preview);
        setFormData(prev => ({ ...prev, logo_url: '' }));
        // Clear logo error if any
        setErrors(prev => {
            if (!prev.logo) return prev;
            const newErrors = { ...prev };
            delete newErrors.logo;
            return newErrors;
        });
    };

    const handleTagToggle = (tagId) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId]
        }));
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

        // Image validation
        if (useUrlMode) {
            if (!formData.image_url.trim()) {
                newErrors.image = 'Image URL is required';
            } else if (!isValidUrl(formData.image_url)) {
                newErrors.image = 'Please enter a valid image URL';
            }
        } else {
            if (!imageFile && !imagePreview) {
                newErrors.image = 'Please upload an image';
            }
        }

        if (!formData.category_id) {
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
        setUploadProgress(0);
        setUploadStatus('uploading');

        try {
            // Use FormData if image file or logo file is present
            if (imageFile || logoFile) {
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title.trim());
                formDataToSend.append('description', formData.description.trim());
                formDataToSend.append('url_website', formData.url_website.trim());
                formDataToSend.append('category_id', formData.category_id);

                // Add image (file or URL)
                if (imageFile) {
                    formDataToSend.append('image_file', imageFile);
                } else if (formData.image_url) {
                    formDataToSend.append('image_url', formData.image_url.trim());
                }

                // Add logo (file or URL) - optional
                if (logoFile) {
                    formDataToSend.append('logo_file', logoFile);
                } else if (formData.logo_url) {
                    formDataToSend.append('logo_url', formData.logo_url.trim());
                }

                // Add tags array
                formData.tags.forEach((tagId, index) => {
                    formDataToSend.append(`tags[${index}]`, tagId);
                });

                // Upload progress callback
                const onProgress = (progress) => {
                    setUploadProgress(progress);
                    if (progress === 100) {
                        setUploadStatus('processing');
                    }
                };

                if (isEditMode) {
                    await showcaseService.update(id, formDataToSend, onProgress);
                    setUploadStatus('success');
                    setMessage({
                        type: 'success',
                        text: 'Showcase updated successfully!'
                    });
                } else {
                    await showcaseService.create(formDataToSend, onProgress);
                    setUploadStatus('success');
                    setMessage({
                        type: 'success',
                        text: 'Showcase created successfully!'
                    });
                }
            } else {
                // Use JSON if only URL
                const submitData = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    url_website: formData.url_website.trim(),
                    image_url: formData.image_url.trim(),
                    logo_url: formData.logo_url ? formData.logo_url.trim() : '',
                    category_id: formData.category_id,
                    tags: formData.tags
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
            }

            // Clear showcase cache after create/update
            cacheManager.clearShowcases();

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            setUploadStatus('error');
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
        return <ShowcaseFormPageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-main-black py-12 transition-colors duration-300">
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
                            className="text-violet-600 hover:text-violet-700 dark:text-yellow-300 dark:hover:text-yellow-400 mb-4 flex items-center gap-2 transition-colors font-medium"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-main-black dark:text-white mb-2 uppercase tracking-tight">
                            {isEditMode ? 'Edit Showcase' : 'Create New Showcase'}
                        </h1>
                        <p className="text-dark-gray dark:text-white/50">
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
                            className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {message.type === 'success' ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5" />
                                )}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Upload Progress Bar */}
                    {loading && imageFile && uploadProgress > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-gray-50 dark:bg-dark-gray rounded-xl border border-gray-200 dark:border-white/10"
                        >
                            <UploadProgressBar progress={uploadProgress} status={uploadStatus} />
                        </motion.div>
                    )}

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-dark-gray rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Showcase Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Modern E-Commerce Dashboard"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.title
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300'
                                        } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your showcase... What makes it special? What technologies did you use?"
                                    rows="5"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.description
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300'
                                        } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-none`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                                    {formData.description.length} characters
                                </p>
                            </div>

                            {/* Website URL */}
                            <div>
                                <label htmlFor="url_website" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Website URL <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        id="url_website"
                                        name="url_website"
                                        value={formData.url_website}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com"
                                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.url_website
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300'
                                            } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all`}
                                    />
                                </div>
                                {errors.url_website && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url_website}</p>
                                )}
                            </div>

                            {/* Image Upload/URL */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    Showcase Image <span className="text-red-500">*</span>
                                </label>

                                {/* Toggle between URL and Upload */}
                                <div className="flex items-center gap-2 mb-4 p-1 bg-gray-100 dark:bg-black/20 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUseUrlMode(true);
                                            if (errors.image) {
                                                setErrors(prev => ({ ...prev, image: '' }));
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${useUrlMode
                                            ? 'bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Use URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUseUrlMode(false);
                                            if (errors.image) {
                                                setErrors(prev => ({ ...prev, image: '' }));
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!useUrlMode
                                            ? 'bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {useUrlMode ? (
                                    <>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="url"
                                                id="image_url"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/image.jpg"
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.image
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-violet-500 dark:focus:ring-yellow-300'
                                                    } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-all`}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Use a direct link to your showcase screenshot or preview image
                                        </p>

                                        {/* URL Image Preview */}
                                        {formData.image_url && isValidUrl(formData.image_url) && (
                                            <div className="mt-4">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Preview:</p>
                                                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
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
                                    </>
                                ) : (
                                    <ImageUpload
                                        value={imagePreview}
                                        onChange={handleImageUpload}
                                        error={errors.image}
                                        maxSize={5}
                                        acceptedFormats={['image/jpeg', 'image/png', 'image/jpg', 'image/webp']}
                                    />
                                )}
                            </div>

                            {/* Logo Upload/URL */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    Website Logo <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                                </label>

                                {/* Toggle between URL and Upload */}
                                <div className="flex items-center gap-2 mb-4 p-1 bg-gray-100 dark:bg-black/20 rounded-lg w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setUseLogoUrlMode(true)}
                                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${useLogoUrlMode
                                            ? 'bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Use URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseLogoUrlMode(false)}
                                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!useLogoUrlMode
                                            ? 'bg-violet-300 dark:bg-yellow-300 text-white dark:text-main-black shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {useLogoUrlMode ? (
                                    <>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="url"
                                                id="logo_url"
                                                name="logo_url"
                                                value={formData.logo_url}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/logo.png"
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 dark:focus:border-yellow-300 focus:ring-1 focus:ring-violet-500 dark:focus:ring-yellow-300 transition-all`}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Add a logo to personalize your showcase card
                                        </p>

                                        {/* URL Logo Preview */}
                                        {formData.logo_url && isValidUrl(formData.logo_url) && (
                                            <div className="mt-4">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Preview:</p>
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-2 flex items-center justify-center">
                                                    <img
                                                        src={formData.logo_url}
                                                        alt="Logo Preview"
                                                        className="max-w-full max-h-full object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <ImageUpload
                                        value={logoPreview}
                                        onChange={handleLogoUpload}
                                        maxSize={2}
                                        acceptedFormats={['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml']}
                                        aspectRatio={1}
                                        helperText="Recommended: Square image (e.g., 512x512px). Max 2MB. Supports JPG, PNG, WebP, SVG."
                                    />
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                    Tags (Optional)
                                </label>
                                {loadingTags ? (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Spinner size="sm" color="gray" />
                                        <span className="text-sm">Loading tags...</span>
                                    </div>
                                ) : availableTags.length > 0 ? (
                                    <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-gray-50 dark:bg-black/20">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {availableTags.map((tag) => (
                                                <label
                                                    key={tag.id}
                                                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${formData.tags.includes(tag.id)
                                                        ? 'bg-violet-50 dark:bg-yellow-300/10 border-violet-200 dark:border-yellow-300/30'
                                                        : 'bg-white dark:bg-dark-gray border-gray-200 dark:border-white/5 hover:border-violet-300 dark:hover:border-yellow-300/50'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.tags.includes(tag.id)}
                                                        onChange={() => handleTagToggle(tag.id)}
                                                        className="w-4 h-4 text-violet-300 dark:text-yellow-300 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-yellow-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <span className={`text-sm truncate ${formData.tags.includes(tag.id)
                                                        ? 'text-violet-300 dark:text-yellow-300 font-medium'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                        }`}>
                                                        {tag.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        No tags available yet.
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Select tags that best describe your showcase ({formData.tags.length} selected)
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => !loadingCategories && setIsCategoryOpen(!isCategoryOpen)}
                                        className={`w-full px-4 py-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${errors.category
                                            ? 'border-red-500 focus:ring-red-500'
                                            : `border-gray-200 dark:border-white/10 ${isCategoryOpen ? 'ring-2 ring-violet-500 dark:ring-yellow-300 border-transparent' : 'hover:border-violet-300 dark:hover:border-yellow-300/50'}`
                                            } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:outline-none`}
                                    >
                                        <span className={!formData.category_id ? "text-gray-400" : "font-medium"}>
                                            {loadingCategories
                                                ? "Loading categories..."
                                                : (categories.find(c => c.id == formData.category_id)?.name || "Select a category")
                                            }
                                        </span>
                                        <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCategoryOpen ? 'rotate-90' : '-rotate-90'}`} />
                                    </button>

                                    {isCategoryOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-dark-gray border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                                {categories.map(cat => (
                                                    <div
                                                        key={cat.id}
                                                        onClick={() => {
                                                            handleInputChange({ target: { name: 'category_id', value: cat.id } });
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between
                                                            ${formData.category_id == cat.id
                                                                ? 'bg-violet-50 dark:bg-yellow-300/10 text-violet-700 dark:text-yellow-300'
                                                                : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                                            }
                                                        `}
                                                    >
                                                        {cat.name}
                                                        {formData.category_id == cat.id && <Check className="w-4 h-4" />}
                                                    </div>
                                                ))}
                                                {categories.length === 0 && (
                                                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 italic">
                                                        No categories found
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-violet-300/90 hover:bg-violet-300 dark:bg-yellow-300/90 dark:hover:bg-yellow-300 text-white dark:text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" color={isEditMode ? "white" : "white"} />
                                        <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        <span>{isEditMode ? 'Update Showcase' : 'Create Showcase'}</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white font-bold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-violet-50 dark:bg-yellow-300/10 border border-violet-100 dark:border-yellow-300/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-violet-600 dark:text-yellow-300 shrink-0 mt-0.5" />
                        <p className="text-sm text-violet-800 dark:text-yellow-100">
                            <strong>Note:</strong> Your showcase will be submitted for review. Once approved by an admin, it will be visible to all users.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ShowcaseFormPage;
