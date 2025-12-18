/**
 * UploadProgressBar
 *
 * Komponen visual untuk menampilkan progres upload file.
 * Menyediakan status text, persen, dan bar animasi.
 *
 * Props:
 * - `progress` (number): persen progress 0-100
 * - `status` (string): 'uploading'|'processing'|'success'|'error'
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const UploadProgressBar = ({ progress, status = 'uploading' }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'uploading':
                return 'bg-indigo-600';
            case 'processing':
                return 'bg-yellow-500';
            case 'success':
                return 'bg-green-600';
            case 'error':
                return 'bg-red-600';
            default:
                return 'bg-indigo-600';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'uploading':
                return `Uploading... ${progress}%`;
            case 'processing':
                return 'Processing image...';
            case 'success':
                return 'Upload complete!';
            case 'error':
                return 'Upload failed';
            default:
                return `Uploading... ${progress}%`;
        }
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {status === 'uploading' || status === 'processing' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {getStatusText()}
                </span>
                {status === 'uploading' && (
                    <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                )}
            </div>
            
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`h-full ${getStatusColor()} rounded-full relative`}
                >
                    {/* Animated shine effect */}
                    {(status === 'uploading' || status === 'processing') && progress < 100 && (
                        <motion.div
                            animate={{
                                x: ['-100%', '200%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UploadProgressBar;
