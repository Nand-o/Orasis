import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useCollection } from '../../../context/CollectionContext';

const CollectionCard = ({ collection, onClick, onDelete, isNew = false, previewImages }) => {
    const { updateCollection } = useCollection();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const inputRef = useRef(null);

    // Ensure previewImages is always an array
    const images = Array.isArray(previewImages) ? previewImages : [];

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(collection);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setEditedName(collection.name);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editedName.trim() && editedName !== collection.name) {
            try {
                await updateCollection(collection.id, { name: editedName });
            } catch (error) {
                console.error('Failed to update collection:', error);
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedName(collection.name);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isNew) {
        return (
            <motion.div
                onClick={onClick}
                className="aspect-square rounded-3xl border-2 border-dashed border-gray-300 dark:border-dark-gray flex flex-col items-center justify-center cursor-pointer hover:border-violet-300 dark:hover:border-yellow-300 transition-colors group"
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-dark-gray flex items-center justify-center mb-3 group-hover:bg-white dark:group-hover:bg-dark-gray group-hover:shadow-sm transition-all">
                    <Plus className="w-6 h-6 text-gray-500 dark:text-white group-hover:text-violet-300 dark:group-hover:text-yellow-300" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-white group-hover:text-violet-300 dark:group-hover:text-yellow-300">New Collection</span>
            </motion.div>
        );
    }

    const hasImages = images.length > 0;

    return (
        <motion.div
            onClick={!isEditing ? onClick : undefined}
            className="group cursor-pointer"
            whileTap={!isEditing ? { scale: 0.98 } : {}}
        >
            <div className="aspect-square rounded-3xl bg-gray-100 dark:bg-dark-gray overflow-hidden mb-3 relative border border-gray-100 dark:border-dark-gray">
                {hasImages ? (
                    <div className={`grid h-full w-full gap-0.5 ${images.length === 1 ? 'grid-cols-1 grid-rows-1' : 'grid-cols-2 grid-rows-2'}`}>
                        {images.slice(0, 4).map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ))}
                        {/* Fill remaining spots with gray if needed */}
                        {images.length < 4 && images.length !== 1 && Array.from({ length: 4 - images.length }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-gray-200 dark:bg-dark-gray w-full h-full" />
                        ))}

                        {/* Overlay with count */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-dark-gray">
                        <span className="text-violet-300 dark:text-yellow-300 text-4xl font-bold opacity-100">{collection?.name?.charAt(0) || '?'}</span>
                    </div>
                )}
            </div>
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full font-bold text-gray-900 dark:text-white bg-white dark:bg-dark-gray border border-indigo-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ) : (
                        <>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-yellow-300 transition-colors truncate">{collection.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{collection.showcases_count || collection.showcases?.length || 0} items</p>
                        </>
                    )}
                </div>
                {!isEditing && (
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={handleEdit}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-main-black transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Rename collection"
                        >
                            <Pencil className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-yellow-300 transition-colors" />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-main-black transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete collection"
                        >
                            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CollectionCard;
