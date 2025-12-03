import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (confirmText.toLowerCase() !== 'delete') {
            setError('Please type "DELETE" to confirm');
            return;
        }
        setError('');
        onConfirm();
    };

    const handleClose = () => {
        if (!isLoading) {
            setConfirmText('');
            setError('');
            onClose();
        }
    };

    const handleInputChange = (e) => {
        setConfirmText(e.target.value);
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-white dark:bg-dark-gray rounded-2xl shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-black/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="flex justify-center pt-8 pb-4">
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8">
                    <h2 className="text-2xl font-black text-center mb-2 text-gray-900 dark:text-white">
                        Delete Account?
                    </h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </p>

                    {/* Warning Box */}
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                            What will be deleted:
                        </h3>
                        <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                            <li>Your profile and personal information</li>
                            <li>All your showcases and collections</li>
                            <li>Your comments and interactions</li>
                            <li>All associated data</li>
                        </ul>
                    </div>

                    {/* Confirmation Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                            Type <span className="text-red-500 dark:text-red-400">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Type DELETE"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {error && (
                            <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-black/20 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-black/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading || confirmText.toLowerCase() !== 'delete'}
                            className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
