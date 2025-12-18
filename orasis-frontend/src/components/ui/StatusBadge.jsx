/**
 * StatusBadge
 *
 * Komponen kecil yang menampilkan status sebuah showcase (approved, pending,
 * rejected). Memiliki ikon, palet warna, dan tooltip singkat saat hover.
 * Digunakan di daftar showcase, detail, dan area moderation untuk menunjukkan
 * status review secara visual.
 *
 * Props:
 * - `status` (string): 'approved'|'pending'|'rejected'
 * - `size` (string): 'sm'|'md'|'lg'
 */
import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status, size = 'md' }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const statusConfig = {
        approved: {
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            label: 'Approved'
        },
        pending: {
            icon: Clock,
            color: 'text-yellow-600 dark:text-yellow-400',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
            label: 'Pending Review'
        },
        rejected: {
            icon: XCircle,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            label: 'Rejected'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'w-6 h-6 p-1',
        md: 'w-8 h-8 p-1.5',
        lg: 'w-10 h-10 p-2'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className={`
                ${sizeClasses[size]} 
                ${config.bgColor} 
                rounded-full 
                flex items-center justify-center
                transition-all duration-200
                hover:scale-110
                cursor-help
            `}>
                <Icon className={`${iconSizes[size]} ${config.color}`} />
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap z-50 shadow-lg"
                    >
                        {config.label}
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatusBadge;
