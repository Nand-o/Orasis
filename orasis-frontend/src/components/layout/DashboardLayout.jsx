import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
    const location = useLocation();

    // Initialize collapsed state based on screen size
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return window.innerWidth < 1024; // Collapsed on screens smaller than 1024px (tablet and mobile)
    });

    const getPageTitle = () => {
        const path = location.pathname;

        // Admin Routes
        if (path === '/dashboard/pending') return { main: 'Pending Review', sub: 'Moderation Queue' };
        if (path === '/dashboard/users') return { main: 'Users', sub: 'User Management' };
        if (path === '/dashboard/categories') return { main: 'Categories', sub: 'Taxonomy' };
        if (path === '/dashboard/tags') return { main: 'Tags', sub: 'Taxonomy' };
        if (path === '/dashboard/analytics') return { main: 'Analytics', sub: 'Insights & Stats' };

        // User Routes
        if (path === '/dashboard/collections') return { main: 'Collections', sub: 'My Saved Items' };

        // Shared Routes (Context dependent)
        if (path === '/dashboard/showcases') return { main: 'Showcases', sub: 'Manage Content' };
        if (path === '/dashboard') return { main: 'Dashboard', sub: 'Overview' };

        return { main: 'Dashboard', sub: 'Overview' };
    };

    // Calculate margin based on sidebar state + spacing
    // Sidebar is fixed at left-4 (16px)
    // Width is 280px or 88px
    // We want some gap after the sidebar, say 24px
    const contentMargin = sidebarCollapsed ? '120px' : '320px';

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-main-black transition-colors duration-300">
            <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            {/* Main Content Area */}
            <div
                style={{
                    marginLeft: window.innerWidth >= 768 ? contentMargin : '0px',
                    width: window.innerWidth >= 768 ? `calc(100% - ${contentMargin})` : '100%',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="flex-1 min-h-screen flex flex-col relative"
            >
                {/* Top Navbar - Glassmorphism */}
                <header className="h-20 flex items-center px-8 sticky top-0 z-40 bg-gray-50 dark:bg-main-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-all">
                    <div className="flex items-center justify-between w-full">
                        {/* Mobile: Logo & Toggle Placeholder (handled by sidebar) */}
                        <div className="md:hidden flex items-center gap-3">
                            {/* Spacer for mobile menu button which is in sidebar */}
                            <div className="w-10"></div>
                            <span className="font-bold text-lg text-gray-900 dark:text-white font-family-zentry">ORASIS</span>
                        </div>

                        {/* Desktop: Breadcrumbs or Page Title */}
                        <div className="hidden md:flex flex-col">
                            <h1 className="text-xl font-bold uppercase tracking-tight text-violet-300 dark:text-yellow-300">
                                {getPageTitle().main}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {getPageTitle().sub}
                            </p>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-6">
                            <nav className="hidden md:flex items-center gap-6">
                                <a href="/home" className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-yellow-300 transition-colors group">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Home Page
                                </a>
                            </nav>

                            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

                            {/* Date/Time or other widget could go here */}
                            <div className="text-xs font-medium text-gray-400 dark:text-gray-500 hidden md:block">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-6 px-8 border-t border-gray-200 dark:border-white/5 mt-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-500 font-medium">
                        <div>
                            <span>© 2025 Orasis. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
