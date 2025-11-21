import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap } from 'lucide-react';

const AboutPage = () => {
    useEffect(() => {
        document.title = 'About Us | Orasis';
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div className="text-center mb-20" variants={itemVariants}>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
                    We curate the web's <br className="hidden sm:block" />
                    <span className="text-gray-500 dark:text-gray-400">finest digital experiences.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Orasis is a platform dedicated to showcasing the most innovative and inspiring web and mobile designs. We believe in the power of design to shape the future of the internet.
                </p>
            </motion.div>

            {/* Stats/Features Section */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24"
                variants={itemVariants}
            >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Curated Quality</h3>
                    <p className="text-gray-500 dark:text-gray-400">Every design is hand-picked by our team to ensure only the best make it to your feed.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Driven</h3>
                    <p className="text-gray-500 dark:text-gray-400">Join a growing community of designers and developers sharing their best work.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Daily Inspiration</h3>
                    <p className="text-gray-500 dark:text-gray-400">Fresh content added daily to keep your creative juices flowing and ideas sparking.</p>
                </div>
            </motion.div>

            {/* Story Section */}
            <motion.div className="prose prose-lg mx-auto text-gray-600 dark:text-gray-300" variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Story</h2>
                <p className="mb-6">
                    Founded in 2024, Orasis began as a small side project to catalog beautiful websites. What started as a personal bookmark collection has grown into a destination for thousands of creatives looking for their next big idea.
                </p>
                <p>
                    Our mission is simple: to democratize design inspiration. We want to make it easy for anyone, regardless of their background, to find and appreciate high-quality digital design. Whether you're a seasoned pro or just starting out, Orasis is here to fuel your creativity.
                </p>
            </motion.div>
        </motion.div>
    );
};

export default AboutPage;
