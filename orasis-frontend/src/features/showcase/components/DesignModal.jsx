/**
 * DesignModal
 *
 * Modal besar untuk melihat detail showcase secara penuh.
 * Menampilkan gambar berukuran besar, tags, warna, dan aksi seperti
 * visit live site atau share.
 *
 * Props:
 * - `design` (object): data showcase yang akan ditampilkan
 * - `onClose` (function): callback untuk menutup modal
 */
import React from 'react';
import { X, ExternalLink, Share2 } from 'lucide-react';

const DesignModal = ({ design, onClose }) => {
    if (!design) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            className="bg-white rounded-full p-2 text-gray-400 hover:text-gray-500 focus:outline-none shadow-sm"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-3 h-[80vh]">
                            {/* Image Section */}
                            <div className="lg:col-span-2 bg-gray-100 overflow-y-auto p-8 flex items-center justify-center">
                                <img
                                    src={design.image_url || design.imageUrl}
                                    alt={design.title}
                                    className="w-full h-auto rounded-lg shadow-2xl"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="lg:col-span-1 p-8 overflow-y-auto border-l border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {design.category?.name || 'N/A'}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{design.title}</h2>
                                <p className="text-gray-500 mb-8">
                                    A beautiful example of modern web design focusing on user experience and visual hierarchy.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {design.tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-50 text-gray-700 border border-gray-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Colors</h3>
                                        <div className="flex space-x-2">
                                            {['#4F46E5', '#111827', '#F3F4F6', '#FFFFFF'].map((color) => (
                                                <div key={color} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color }} title={color}></div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <button className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">
                                            <ExternalLink className="w-5 h-5 mr-2" />
                                            Visit Live Site
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignModal;
