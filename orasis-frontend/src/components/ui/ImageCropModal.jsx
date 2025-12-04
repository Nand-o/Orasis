import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const ImageCropModal = ({ image, onCropComplete, onCancel, aspectRatio = 16 / 9 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const createCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            );
            onCropComplete(croppedImage);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={onCancel}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-main-black rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/50">
                        <h3 className="text-xl font-bold text-main-black dark:text-white">
                            Crop Image
                        </h3>
                        <button
                            onClick={onCancel}
                            className="p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-violet-300 dark:hover:text-yellow-300 cursor-pointer" />
                        </button>
                    </div>

                    {/* Cropper Area */}
                    <div className="relative h-[500px] bg-main-black">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropCompleteCallback}
                            style={{
                                containerStyle: {
                                    backgroundColor: '#000',
                                },
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="p-6 space-y-4 bg-gray-50 dark:bg-main-black">
                        {/* Zoom Control */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
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
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 dark:bg-dark-gray rounded-lg appearance-none cursor-pointer accent-violet-300 dark:accent-yellow-300"
                                />
                                <ZoomIn className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Rotation Control */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-main-black dark:text-white">
                                    Rotation
                                </label>
                                <button
                                    onClick={handleRotate}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-violet-300 dark:text-yellow-300 rounded-lg transition-colors cursor-pointer"
                                >
                                    <RotateCw className="w-4 h-4" />
                                    Rotate 90°
                                </button>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={360}
                                step={1}
                                value={rotation}
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-dark-gray rounded-lg appearance-none cursor-pointer accent-violet-300 dark:accent-yellow-300"
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>0°</span>
                                <span>{rotation}°</span>
                                <span>360°</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white text-gray-700 dark:text-main-black rounded-xl font-medium hover:bg-red-500 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createCroppedImage}
                                className="flex-1 px-6 py-3 bg-violet-300/90 dark:bg-yellow-300/90 text-white dark:text-main-black rounded-xl font-medium hover:bg-violet-300 dark:hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Check className="w-5 h-5" />
                                Apply Crop
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Helper function to create cropped image
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

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export default ImageCropModal;
