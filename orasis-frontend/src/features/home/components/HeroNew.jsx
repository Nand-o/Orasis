import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ designs }) => {
    // Referensi ke elemen container slider untuk fungsi scroll
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    // Handle click on showcase card
    const handleShowcaseClick = (design) => {
        if (design && design.id) {
            navigate(`/showcase/${design.id}`);
        }
    };

    // Jika tidak ada data designs, return null atau tampilkan placeholder
    if (!designs || designs.length === 0) return null;

    // Convert designs data ke format yang sesuai untuk slider
    // Tambahkan item kosong di index 0 untuk spacing
    const slides = [
        { id: 0, title: "", category: "", img: "", bg: "bg-transparent", design: null },
        ...designs.map((design, index) => ({
            id: index + 1,
            title: design.title,
            category: design.category?.name || 'Uncategorized',
            img: design.image_url || design.imageUrl,
            bg: "bg-gray-100",
            design: design // Keep reference to original design object
        }))
    ];

    // Fungsi untuk menggerakkan slider via tombol
    const slide = (direction) => {
        if (sliderRef.current) {
            const { current } = sliderRef;
            // Geser sebesar 400px (atau sesuaikan dengan lebar kartu)
            const scrollAmount = direction === 'left' ? -400 : 400;

            current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Floating Animation Variants
    const floatTransition = {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
    };

    return (
        <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[80vh] flex flex-col justify-center bg-white dark:bg-main-black overflow-hidden py-10">

            {/* Decorative Floating Elements */}
            <div className="absolute inset-0 pointer-events-none z-0 max-w-7xl mx-auto">
                {/* Yellow Area (Bottom Left) - Covered by Slider */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -15 }}
                    transition={floatTransition}
                    className="hidden md:block absolute left-4 md:left-10 bottom-1/4 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg scale-75 md:scale-100 opacity-60 md:opacity-100 origin-bottom-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                        <div className="h-2 w-16 bg-gray-200 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 20 }}
                    transition={{ ...floatTransition, delay: 1 }}
                    className="hidden md:block absolute left-20 md:left-32 bottom-1/3 p-3 bg-white border border-gray-200 rounded-xl shadow-lg scale-75 md:scale-100 opacity-60 md:opacity-100 origin-bottom-left"
                >
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-violet-500 dark:bg-yellow-300" />
                    </div>
                </motion.div>

                {/* Red Area (Top Right) */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -20 }}
                    transition={{ ...floatTransition, delay: 0.5 }}
                    className="absolute right-4 md:right-32 top-20 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg scale-75 md:scale-100 opacity-100 md:opacity-100 origin-top-right"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-violet-500 dark:bg-yellow-300 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <div className="h-2 w-20 bg-gray-200 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 15 }}
                    transition={{ ...floatTransition, delay: 1.5 }}
                    className="absolute right-20 md:right-42 top-27 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg scale-75 md:scale-100 opacity-100 md:opacity-100 origin-top-right"
                >
                    <div className="space-y-0">
                        <div className="h-2 w-24 bg-gray-200 rounded-full" />
                        <div className="h-2 w-16 bg-gray-200 rounded-full opacity-60" />
                    </div>
                </motion.div>
            </div>

            {/* 1. Header Text / Judul Section */}
            <div className="relative z-10 md:px-12 mb-8 flex justify-between items-end">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none px-8">
                    Trending <br /> Designs
                </h1>

                {/* Tombol Navigasi (SlideNav) - Desktop */}
                <div className="hidden md:flex gap-4 px-8">
                    <button
                        onClick={() => slide('left')}
                        className="w-12 h-12 rounded-full border border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                    >
                        {/* Icon Panah Kiri */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => slide('right')}
                        className="w-12 h-12 rounded-full border border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                    >
                        {/* Icon Panah Kanan */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 2. Container Slider Full Width */}
            <div className="relative z-10 w-full">
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-8 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {slides.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => index !== 0 && item.design && handleShowcaseClick(item.design)}
                            // w-[80vw] untuk mobile agar terlihat besar, w-[30vw] untuk desktop agar terlihat berjejer
                            className={`relative shrink-0 w-[80vw] md:w-[40vw] lg:w-[30vw] snap-center select-none group ${index === 0 ? 'hidden md:block' : 'cursor-pointer'}`}
                        >
                            {/* Image Container */}
                            <div className={`aspect-16/10 w-full overflow-hidden ${index === 0 ? 'bg-transparent' : item.bg} relative`}>
                                {index !== 0 && (
                                    <>
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            draggable="false" // PENTING: Mencegah gambar di-drag
                                            className="w-full h-full object-cover object-top transition-transform duration-700 select-none pointer-events-none"
                                        // pointer-events-none memastikan klik mouse tembus ke container, mencegah drag image browser native
                                        />

                                        {/* Overlay Effect (Opsional) */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    </>
                                )}
                            </div>

                            {/* Caption */}
                            {index !== 0 && (
                                <div className="mt-4 flex justify-between items-center gap-2 border-t border-gray-200 pt-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base md:text-xl font-bold uppercase group-hover:text-violet-300 dark:group-hover:text-yellow-300 transition-colors duration-300 truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-xs md:text-sm truncate">{item.category}</p>
                                    </div>
                                    <span className="text-xs font-mono border px-2 py-1 rounded-full border-light-gray shrink-0">
                                        0{item.id}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tombol Navigasi Mobile (Floating) - Opsional jika ingin muncul di HP */}
                <div className="flex md:hidden justify-center gap-4 mt-2">
                    <button onClick={() => slide('left')} className="w-12 h-12 rounded-full border border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button onClick={() => slide('right')} className="w-12 h-12 rounded-full border border-black dark:border-white flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
