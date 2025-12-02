import React from 'react';
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
