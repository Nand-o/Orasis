/**
 * ConfirmationModal
 *
 * Modal konfirmasi generik untuk tindakan berisiko (delete, sign-out, dll.).
 * Menyediakan judul, pesan, dan tombol konfirmasi/cancel. Animasi menggunakan
 * `framer-motion` dan ikon dari `lucide-react`.
 *
 * Props:
 * - `isOpen` (boolean): kontrol visibilitas modal
 * - `onClose` (function): callback saat modal ditutup
 * - `onConfirm` (function): callback saat pengguna mengonfirmasi
 * - `title` (string)
 * - `message` (string)
 * - `confirmText` (string)
 * - `cancelText` (string)
 * - `isDanger` (boolean)
 */
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden relative z-10"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {isDanger && <AlertTriangle className="w-5 h-5 text-red-500" />}
                            {title}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-6">
                        <p className="text-gray-600 dark:text-gray-300">{message}</p>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ${isDanger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
