import React, { useState, useCallback, useRef } from 'react';
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

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
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
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Crop Profile Picture
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Upload Profile Picture
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Drag and drop or click to select an image
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
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
                                <div className="relative h-96 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-6">
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
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Zoom
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
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
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <ZoomIn className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Rotation Control */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Rotation
                                            </label>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
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
                                                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {image && (
                        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                                    onClick={handleReset}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleApplyCrop}
                                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                                >
                                    <Check className="w-4 h-4" />
                                    Apply
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
