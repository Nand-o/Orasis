import React, { useState } from 'react';

/**
 * UserAvatar
 *
 * Menampilkan avatar pengguna dengan fallback inisial jika tidak ada foto.
 * Komponen ini menangani error loading gambar dan menyediakan beberapa
 * ukuran yang dapat dipilih.
 *
 * Props:
 * - `user` (object): objek user dengan `name` dan `profile_picture_url`
 * - `size` (string): 'xs'|'sm'|'md'|'lg'|'xl'
 * - `className` (string): kelas CSS tambahan
 */
const UserAvatar = ({ user, size = 'md', className = '' }) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-2xl'
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    // Check if user has profile picture
    const hasProfilePicture = user?.profile_picture_url && user.profile_picture_url !== '' && !imageError;

    if (hasProfilePicture) {
        return (
            <img
                src={user.profile_picture_url}
                alt={user.name || 'User'}
                className={`${sizeClass} rounded-full object-cover shadow-sm shrink-0 ${className}`}
                onError={() => setImageError(true)}
            />
        );
    }

    // Fallback to initial
    return (
        <div className={`${sizeClass} rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 dark:from-yellow-300 dark:to-yellow-600 flex items-center justify-center text-white dark:text-main-black font-bold shadow-sm shrink-0 ${className}`}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
    );
};

export default UserAvatar;
