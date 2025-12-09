import React from 'react';
/**
 * Layout Komponen Utama (Public Layout)
 *
 * Komponen ini membungkus konten publik aplikasi dengan header/navigation dan
 * footer. Digunakan untuk halaman yang bukan bagian dari dashboard.
 *
 * Props:
 * - `searchValue` (string): nilai input search yang diteruskan ke `Navbar`.
 * - `onSearchChange` (function): handler perubahan input search.
 *
 * Dokumentasi ini ditulis dalam Bahasa Indonesia untuk keperluan akademik.
 */
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, searchValue, onSearchChange }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-main-black transition-colors duration-200">
            <Navbar searchValue={searchValue} onSearchChange={onSearchChange} />
            <main className="grow">
                <div className="w-full px-4 sm:px-6 lg:px-16 py-9">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
