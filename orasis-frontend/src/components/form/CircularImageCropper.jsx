import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Upload } from 'lucide-react';

const CircularImageCropper = ({ isOpen, onClose, onCropComplete, initialImage }) => {
    const [image, setImage] = useState(initialImage || null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Update image when initialImage changes
    useEffect(() => {
        if (initialImage) {
            setImage(initialImage);
            // Reset crop settings when new image is loaded
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
        }
    }, [initialImage]);

    const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate rotated image dimensions
        const rotRad = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rotRad));
        const cos = Math.abs(Math.cos(rotRad));

        const rotatedWidth = image.width * cos + image.height * sin;
        const rotatedHeight = image.width * sin + image.height * cos;

        // Create a canvas with enough space for rotated image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = rotatedWidth;
        tempCanvas.height = rotatedHeight;

        // Rotate the image
        tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
        tempCtx.rotate(rotRad);
        tempCtx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2
        );

        // Now crop from the rotated image
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            tempCanvas,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleApplyCrop = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
            const croppedFile = new File([croppedBlob], 'profile-picture.jpg', {
                type: 'image/jpeg',
            });
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(croppedBlob);
            
            onCropComplete(croppedFile, previewUrl);
            onClose();
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    const handleReset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white dark:bg-main-black rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/50">
                        <h2 className="text-xl font-bold text-main-black dark:text-white">
                            Crop Profile Picture
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-violet-300 dark:hover:text-yellow-300 cursor-pointer" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!image ? (
                            /* Upload Area */
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                                    isDragging
                                        ? 'border-violet-300 dark:border-yellow-300 bg-violet-50 dark:bg-yellow-300/10'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                            >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-main-black dark:text-white mb-2">
                                    Upload Profile Picture
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-white/50 mb-4">
                                    Drag and drop or click to select an image
                                </p>
                                <p className="text-xs text-gray-500 dark:text-white/50">
                                    Supported formats: JPG, PNG, WebP (Max 5MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <>
                                {/* Cropper Area */}
                                <div className="relative h-96 bg-main-black rounded-xl overflow-hidden mb-6">
                                    <Cropper
                                        image={image}
                                        crop={crop}
                                        zoom={zoom}
                                        rotation={rotation}
                                        aspect={1}
                                        cropShape="round"
                                        showGrid={false}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropAreaComplete}
                                        onZoomChange={setZoom}
                                        onRotationChange={setRotation}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="space-y-4">
                                    {/* Zoom Control */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-main-black dark:text-white">
                                                Zoom
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-white/50">
                                                {Math.round(zoom * 100)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <ZoomOut className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="range"
                                                min="1"
                                                max="3"
                                                step="0.1"
                                                value={zoom}
                                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-dark-gray rounded-lg appearance-none cursor-pointer accent-violet-300 dark:accent-yellow-300"
                                            />
                                            <ZoomIn className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Rotation Control */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-main-black dark:text-white">
                                                Rotation
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-white/50">
                                                {rotation}°
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RotateCw className="w-4 h-4 text-gray-400" />
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                step="1"
                                                value={rotation}
                                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-dark-gray rounded-lg appearance-none cursor-pointer accent-violet-300 dark:accent-yellow-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {image && (
                        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-100 dark:border-white/50 bg-gray-50 dark:bg-main-black">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-violet-300 dark:text-yellow-300 rounded-lg transition-colors cursor-pointer"
                            >
                                Change Image
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-200 dark:bg-white text-gray-700 dark:text-main-black rounded-xl font-medium hover:bg-red-500 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApplyCrop}
                                    className="flex items-center gap-2 px-6 py-3 bg-violet-300/90 dark:bg-yellow-300/90 text-white dark:text-main-black rounded-xl font-medium hover:bg-violet-300 dark:hover:bg-yellow-300 transition-colors cursor-pointer"
                                >
                                    <Check className="w-5 h-5" />
                                    Apply Crop
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CircularImageCropper;
