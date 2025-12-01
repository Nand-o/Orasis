import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Crop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropModal from './ImageCropModal';

const ImageUpload = ({ 
    value, 
    onChange, 
    error,
    maxSize = 5, // MB
    acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    className = '',
    enableCrop = true,
    aspectRatio = 16 / 9
}) => {
    const [preview, setPreview] = useState(value || null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [showCropModal, setShowCropModal] = useState(false);
    const [tempImageForCrop, setTempImageForCrop] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const fileInputRef = useRef(null);

    // Sync preview with external value changes
    useEffect(() => {
        if (value !== preview) {
            setPreview(value);
        }
    }, [value]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const validateFile = (file) => {
        // Check file type
        if (!acceptedFormats.includes(file.type)) {
            return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ').toUpperCase()}`;
        }

        // Check file size
        const maxSizeBytes = maxSize * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `File size must be less than ${maxSize}MB. Your file: ${formatFileSize(file.size)}`;
        }

        return null;
    };

    const handleFileChange = (file) => {
        setUploadError('');

        if (!file) return;

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
            setUploadError(validationError);
            return;
        }

        setCurrentFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            if (enableCrop) {
                // Show crop modal
                setTempImageForCrop(reader.result);
                setShowCropModal(true);
            } else {
                // Direct upload without cropping
                setPreview(reader.result);
                onChange(file, reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        // Generate filename - use current file name if available, otherwise generate new one
        const fileName = currentFile ? currentFile.name : `cropped-${Date.now()}.jpg`;
        const fileType = croppedBlob.type || 'image/jpeg';
        
        // Convert blob to file
        const croppedFile = new File([croppedBlob], fileName, {
            type: fileType,
            lastModified: Date.now(),
        });

        // Update currentFile reference for re-cropping
        setCurrentFile(croppedFile);

        // Create preview from blob
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onChange(croppedFile, reader.result);
        };
        reader.readAsDataURL(croppedBlob);

        setShowCropModal(false);
        setTempImageForCrop(null);
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setTempImageForCrop(null);
        setCurrentFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        handleFileChange(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        handleFileChange(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onChange(null, null);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleInputChange}
                className="hidden"
            />

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClick}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative border-2 border-dashed rounded-lg p-8
                            transition-all duration-200 cursor-pointer
                            ${isDragging 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' 
                                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                            }
                            ${error || uploadError ? 'border-red-500' : ''}
                        `}
                    >
                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className={`
                                p-4 rounded-full
                                ${isDragging 
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }
                            `}>
                                <Upload className={`
                                    w-8 h-8
                                    ${isDragging 
                                        ? 'text-indigo-600 dark:text-indigo-400' 
                                        : 'text-gray-400 dark:text-gray-600'
                                    }
                                `} />
                            </div>

                            <div>
                                <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    PNG, JPG, WEBP up to {maxSize}MB
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group"
                    >
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-64 object-cover"
                            />
                            
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                {enableCrop && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            // If currentFile is null, create one from preview blob
                                            if (!currentFile && preview) {
                                                try {
                                                    const response = await fetch(preview);
                                                    const blob = await response.blob();
                                                    const file = new File([blob], `image-${Date.now()}.jpg`, {
                                                        type: blob.type || 'image/jpeg',
                                                        lastModified: Date.now(),
                                                    });
                                                    setCurrentFile(file);
                                                } catch (error) {
                                                    console.error('Error creating file from preview:', error);
                                                }
                                            }
                                            setTempImageForCrop(preview);
                                            setShowCropModal(true);
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Crop className="w-4 h-4" />
                                        Crop
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Change
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Crop Modal */}
            {showCropModal && tempImageForCrop && (
                <ImageCropModal
                    image={tempImageForCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={aspectRatio}
                />
            )}

            {/* Error Messages */}
            {(error || uploadError) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-start gap-2 text-red-600 dark:text-red-400 text-sm"
                >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error || uploadError}</span>
                </motion.div>
            )}

            {/* Upload Info */}
            {!error && !uploadError && preview && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                >
                    <ImageIcon className="w-3 h-3" />
                    Image uploaded successfully. Click to change or remove.
                </motion.p>
            )}
        </div>
    );
};

export default ImageUpload;
