import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = ({ designs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % designs.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [designs.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % designs.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + designs.length) % designs.length);
    };

    if (!designs || designs.length === 0) return null;

    const currentDesign = designs[currentIndex];

    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-10">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-4xl text-gray-900 dark:text-white tracking-tight leading-tight">
                            A showcase of the web's<br /> finest design + talent
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 max-w-lg">
                            Discover the latest trends in web and mobile design.<br />  Curated daily for your inspiration.
                        </p>
                    </motion.div>

                    {/* Right Carousel */}
                    <motion.div
                        className="flex flex-col space-y-5"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* Image Container */}
                        <div className="relative aspect-16/10 bg-gray-100 dark:bg-gray-800 px-8 py-8 overflow-hidden shadow-sm">
                            <div
                                className="flex h-full transition-transform duration-1000 ease-in-out gap-21"
                                style={{ transform: `translateX(-${currentIndex * 108}%)` }}
                            >
                                {designs.map((design) => (
                                    <div
                                        key={design.id}
                                        className="w-full h-full shrink-0 relative"
                                    >
                                        <img
                                            src={design.image_url || design.imageUrl}
                                            alt={design.title}
                                            className="w-full h-full object-cover shadow-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Navigation Bar */}
                        <div className="flex items-center justify-between px-2">
                            {/* Indicators (Left) */}
                            <div className="flex space-x-2">
                                {designs.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gray-900 dark:bg-white w-6' : 'bg-gray-200 dark:bg-gray-700 w-2 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Controls (Right) */}
                            <div className="flex items-center space-x-6">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                                    {currentDesign?.title}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={prevSlide}
                                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
