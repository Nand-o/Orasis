import React, { useRef, useState } from 'react'
import { TiLocationArrow } from 'react-icons/ti';

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
        <div ref={itemRef} className={`border-hsla ${className}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{transform: transformStyle}}>
            {children}
        </div>
    )
}

const BentoCard = ({ src, title, description }) => {
    return (
        <div className='relative size-full'>
            <video
                src={src}
                loop
                muted
                autoPlay
                className='absolute left-0 top-0 size-full object-cover'
            />
            <div className='relative z-10 flex size-full flex-col justify-between p-5 text-blue-50'>
                <div>
                    <h1 className='bento-title special-font'>{title}</h1>
                    {description && (
                        <p className='mt-3 max-w-64 text-xs md:text-base'>{description}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Features = () => {
    return (
        <section className='bg-black pb-52'>
            <div className='container mx-auto px-3 md:px-10'>
                <div className='px-5 py-32'>
                    <p className='font-family-circular-web text-lg text-blue-50'>Into the Metagame Layer</p>
                    <p className='max-w-md font-family-circular-web text-lg text-blue-50 opacity-50'>
                        Immerse yourself in a rich and ever-expanding universe
                        there a vibrant array of products converge into an interconnected
                        overlay experience that transforms the way you interact on your world.
                    </p>
                </div>

                <BentoTilt className='border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]'>
                    <BentoCard
                        src='videos/feature-1.mp4'
                        title={<>radia<b>n</b>t</>}
                        description='A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure.'
                    />
                </BentoTilt>

                <div className='grid w-full grid-cols-1 gap-7 md:grid-cols-4 md:grid-rows-4'>
                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-4 md:col-start-3 md:row-start-1 md:col-span-1'>
                        <BentoCard
                            src='videos/feature-2.mp4'
                            title={<>zig<b>m</b>a</>}
                            description='An anime and gaming-inspired NFT collection - the IP primed for expansion'
                        />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-2 md:col-span-1'>
                        <BentoCard
                            src='videos/feature-3.mp4'
                            title={<>n<b>e</b>xus</>}
                            description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
                        />
                    </BentoTilt>

                    <BentoTilt className='bento-tilt_1 h-96 md:h-auto md:row-span-2 md:col-span-1'>
                        <BentoCard
                            src="videos/feature-4.mp4"
                            title={<>az<b>u</b>l</>}
                            description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
                        />
                    </BentoTilt>
                </div>

                <div className="grid max-h-100 grid-cols-2 grid-rows-1 gap-7 mt-3">
                    <BentoTilt className="bento-tilt_2">
                        <div className='flex size-full flex-col justify-between bg-violet-300 p-5'>
                            <h1 className='bento-title special-font max-w-64 text-black'>M<b>o</b>re co<b>m</b>ing soo<b>n</b>!</h1>
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
