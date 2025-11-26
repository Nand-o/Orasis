import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
    // Initialize collapsed state based on screen size
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        return window.innerWidth < 1024; // Collapsed on screens smaller than 1024px (tablet and mobile)
    });
    const sidebarWidth = sidebarCollapsed ? 80 : 280;

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            
            {/* Main Content Area */}
            <div
                style={{ 
                    marginLeft: `${sidebarWidth}px`,
                    transition: 'margin-left 0.3s ease'
                }}
                className="flex-1 min-h-screen flex flex-col"
            >
                {/* Top Navbar */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-6 sticky top-0 z-40">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1">
                            <img 
                                src="/logo-black.svg" 
                                alt="Orasis Logo" 
                                className="w-12 h-12 dark:hidden"
                            />
                            <img 
                                src="/logo-white.svg" 
                                alt="Orasis Logo" 
                                className="w-12 h-12 hidden dark:block"
                            />
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</span>
                        </div>
                        <nav className="flex items-center gap-6">
                            <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Home
                            </a>
                            <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                About
                            </a>
                            <a href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Inspiration
                            </a>
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6 mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            <span>© 2025 Orasis. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
