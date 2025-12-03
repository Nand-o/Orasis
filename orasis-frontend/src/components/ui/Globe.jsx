import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

const Globe = ({ className = "", brightness = 1 }) => {
    const canvasRef = useRef();

    useEffect(() => {
        let phi = 0;
        let width = 0;

        // Fungsi untuk mengupdate ukuran canvas saat window di-resize
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener('resize', onResize);
        onResize();

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2, // Resolusi tinggi (Retina ready)
            height: width * 2,
            phi: 0,
            theta: 0.3, // Sedikit miring ke bawah agar terlihat 3D
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6 * brightness,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            opacity: 1,
            markers: [],
            onRender: (state) => {
                // Animasi rotasi otomatis
                state.phi = phi;
                phi += 0.0025; // Kecepatan putar (makin besar makin cepat)
                state.width = width * 2;
                state.height = width * 2;
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [brightness]);

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <canvas
                ref={canvasRef}
                className="w-full h-full max-w-full aspect-square"
                style={{ width: '100%', height: '100%', opacity: 0.7 }}
            />
        </div>
    );
};

export default Globe;
