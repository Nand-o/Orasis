import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-main-black border-t border-gray-100 dark:border-dark-gray mt-auto transition-colors duration-200 px-8">
            <div className="w-full py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <span className="sr-only">Twitter</span>
                        {/* Icon placeholder */}
                        Twitter
                    </a>
                    <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <span className="sr-only">GitHub</span>
                        GitHub
                    </a>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                    <p className="text-center text-base text-gray-400 dark:text-gray-500">
                        &copy; 2025 Orasis Design Showcase. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
