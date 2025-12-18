import React, { useRef, useState } from 'react'
/**
 * Landing Features
 *
 * Section yang menjelaskan fitur-fitur kunci Orasis. Berisi daftar fitur
 * dengan icon dan deskripsi singkat untuk membantu visitor memahami nilai.
 */
import { TiLocationArrow } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import GridMotion from '../../../components/ui/GridMotion';
import Globe from '../../../components/ui/Globe';
import Threads from '../../../components/ui/Threads';

const items = [
    'https://api.microlink.io/?url=https://mkxgamer295-web.github.io/try/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://bukanadine.github.io/Glams/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://fabiousama24.github.io/hw1_PPW/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://aandrassignments.github.io/Lowfee-Coffee-Project/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://rcapo-711.github.io/HW1-PPW/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://muhdaffaramdhani.github.io/SweetBox/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://nuggynih.github.io/PPW-Assignment1.github.io/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://krrrmrl.github.io/AquaRim/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://sabil28.github.io/WEB-SALSHOE-TASKPPW/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://laikaa86.github.io/ppwe/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://noireveil.github.io/noirestore/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://na-id.github.io/hw1-ppw-store/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://fathyakr.github.io/Nakata/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://rizkyraffandyhalim.github.io/HW1-PPW/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://muttia06.github.io/hw1_ppw&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://deodaniel.github.io/Passionfruit/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://opalescentmoon.github.io/imperatrix/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://hamim-l.github.io/REDO/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://makairon92.github.io/Venpuramo/&screenshot=true&meta=false&embed=screenshot.url',
    'https://api.microlink.io/?url=https://aerlangga333.github.io/Aerlangs333.github.io/&screenshot=true&meta=false&embed=screenshot.url',
];


const BentoTilt = ({ children, className = '' }) => {
    const [transformStyle, settransformStyle] = useState('');
    const itemRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!itemRef.current) return;

        const { left, top, width, height } = itemRef.current.getBoundingClientRect();

        const relativeX = (e.clientX - left) / width;
        const relativeY = (e.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;

        settransformStyle(newTransform);
    };

    const handleMouseLeave = () => {
        settransformStyle('');
    };

    return (
        <div ref={itemRef} className={`border-hsla ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transform: transformStyle }}>
            {children}
        </div>
    )
}

const BentoCard = ({ src, title, description, backgroundComponent: BackgroundComponent }) => {
    return (
        <div className='relative size-full'>
            {BackgroundComponent ? (
                <div className='absolute left-0 top-0 size-full'>
                    <BackgroundComponent />
                </div>
            ) : (
                <video
                    src={src}
                    loop
                    muted
                    autoPlay
                    className='absolute left-0 top-0 size-full object-cover'
                />
            )}
            <div className='relative z-10 flex size-full flex-col justify-between p-5 text-white'>
                <div>
                    <h1 className='bento-title special-font'>{title}</h1>
                    {description && (
                        <p className='mt-3 max-w-64 text-xs md:text-base font-family-general'>{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Features = () => {
    const navigate = useNavigate();

    return (
        <section id='features' className='bg-black pb-52'>
            <div className='container mx-auto px-3 md:px-10'>
                <div className='px-5 py-32'>
                    <p className='font-family-circular-web text-lg text-white'>Explore the Creative Universe</p>
                    <p className='max-w-md font-family-circular-web text-lg text-white opacity-50'>
                        Dive into a vast collection of design masterpieces. From mobile apps to landing pages,
                        find the spark for your next big project.
                    </p>
                </div>

                <BentoTilt className='border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]'>
                    {/* <BentoCard
                        src='videos/feature-1.mp4'
                        title={<>inspi<b>r</b>ation</>}
                        description='A curated gallery of top-tier web and mobile designs to fuel your creativity.'
                    /> */}
                    <GridMotion items={items} />
                </BentoTilt>

                <div className='grid w-full grid-cols-1 gap-7 md:grid-cols-4 md:grid-rows-4'>
                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-4 md:col-start-3 md:row-start-1 md:col-span-1'>
                        <div className='relative size-full'>
                            <BentoCard
                                src="videos/feature-4.mp4"
                                title={<>collec<b>t</b>ions</>}
                                description="Save and organize your favorite designs into personalized moodboards."
                            />
                        </div>
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-2 md:col-span-1'>
                        <BentoCard
                            backgroundComponent={Globe}
                            title={<>comm<b>u</b>nity</>}
                            description="Connect with other designers and share your own masterpieces."
                        />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-2 md:col-span-1'>
                        <BentoCard
                            backgroundComponent={Threads}
                            title={<>sea<b>r</b>ch</>}
                            description="Powerful filtering to find exactly what you need in seconds."
                        />
                    </BentoTilt>
                </div>

                <div className="grid max-h-100 grid-cols-2 grid-rows-1 gap-7 mt-3">
                    <BentoTilt className="bento-tilt_2">
                        <div
                            className='flex size-full flex-col justify-between bg-violet-300 p-5 cursor-pointer hover:bg-violet-400 transition-colors'
                            onClick={() => navigate('/register')}
                        >
                            <h1 className='bento-title special-font max-w-64 text-black'>J<b>o</b>in <br /> <b>O</b>rasis <br /> <b>N</b>ow!</h1>
                            <TiLocationArrow className='m-5 scale-[5] self-end' style={{ fill: 'black' }} />
                        </div>
                    </BentoTilt>

                    <BentoTilt className="bento-tilt_2">
                        <video
                            src='videos/feature-5.mp4'
                            loop
                            muted
                            autoPlay
                            className='size-full object-cover object-center'
                        />
                    </BentoTilt>
                </div>
            </div>
        </section>
    )
}

export default Features
