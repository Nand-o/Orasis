/**
 * GridMotion
 *
 * Komponen grid animasi menggunakan `gsap` untuk membuat baris yang
 * bergerak saling melintang (parallax-like). Digunakan sebagai latar atau
 * elemen dekoratif pada halaman hero. Menerima daftar `items` sebagai
 * konten yang akan ditampilkan di sel grid.
 *
 * Props:
 * - `items` (array): list konten (string atau URL gambar) untuk sel.
 * - `gradientColor` (string): warna dasar gradient background.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({ items = [], gradientColor = 'black' }) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);

    const totalItems = 28;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    useEffect(() => {
        // Auto animation
        const maxMoveAmount = 200;
        const animationSpeed = 0.001; // Very slow speed

        rowRefs.current.forEach((row, rowIndex) => {
            if (row) {
                const direction = rowIndex % 2 === 0 ? 1 : -1;
                const delay = rowIndex * 0.2;
                const duration = 8 + rowIndex * 2; // Different duration for each row

                gsap.to(row, {
                    x: maxMoveAmount * direction,
                    duration: duration,
                    delay: delay,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        });

        return () => {
            rowRefs.current.forEach((row) => {
                if (row) {
                    gsap.killTweensOf(row);
                }
            });
        };
    }, []);

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden">
            <section
                className="w-full h-screen overflow-hidden relative flex items-center justify-center"
                style={{
                    background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
                }}
            >
                <div className="absolute inset-0 pointer-events-none z-4 bg-size-[250px]"></div>
                
                <div className="gap-3 md:gap-4 flex-none relative w-[180vw] md:w-[150vw] h-[180vh] md:h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-2">
                    {[...Array(4)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid gap-3 md:gap-4 grid-cols-7"
                            style={{ willChange: 'transform, filter' }}
                            ref={el => (rowRefs.current[rowIndex] = el)}
                        >
                            {[...Array(7)].map((_, itemIndex) => {
                                const content = combinedItems[rowIndex * 7 + itemIndex];
                                return (
                                    <div key={itemIndex} className="relative">
                                        <div className="relative w-full aspect-square overflow-hidden rounded-[10px] bg-[#111] flex items-center justify-center text-white text-[1.5rem]">
                                            {typeof content === 'string' && content.startsWith('http') ? (
                                                <div
                                                    className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                                                    style={{ backgroundImage: `url(${content})` }}
                                                ></div>
                                            ) : (
                                                <div className="p-4 text-center z-1">{content}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className='absolute top-0 left-0 z-10 flex size-full flex-col justify-between p-5 text-white pointer-events-none'>
                    <div>
                        <h1 className='bento-title special-font'><>inspi<b>r</b>ation</></h1>
                        <p className='mt-3 max-w-64 text-xs md:text-base font-family-general'>
                            A curated gallery of top-tier web and mobile designs to fuel your creativity.
                        </p>
                    </div>
                </div>

                <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
            </section>
        </div>
    );
};

export default GridMotion;
