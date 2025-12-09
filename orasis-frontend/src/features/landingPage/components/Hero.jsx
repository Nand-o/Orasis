import React, { useEffect, useRef, useState } from 'react'
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentIndex, setcurrentIndex] = useState(1);
    const [hasClicked, sethasClicked] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [loadedVideos, setloadedVideos] = useState(0);

    const totalVideos = 1;
    const nextVideoRef = useRef(null);
    const mainVideoRef = useRef(null);
    const VIDEO_PLAYBACK_RATE = 1; // Adjust this value to control video speed (0.5 = 50% speed)

    const handleVideoLoad = () => {
        setloadedVideos((prev) => prev + 1);
    }

    const handleVideoError = () => {
        console.warn("Video failed to load, proceeding anyway.");
        setloadedVideos((prev) => prev + 1);
    }

    // Modulo Operation to loop back to first video after the last one
    const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

    const handleMiniVdClick = () => {
        sethasClicked(true);

        setcurrentIndex(upcomingVideoIndex);
    }

    useEffect(() => {
        if (loadedVideos === totalVideos - 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setisLoading(false);
        }
    }, [loadedVideos]);

    // Safety timeout to prevent infinite loading
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn("Loading timed out, forcing display.");
                setisLoading(false);
            }
        }, 5000); // 5 seconds timeout

        return () => clearTimeout(timer);
    }, [isLoading]);

    // Set video playback rate
    useEffect(() => {
        if (mainVideoRef.current) {
            mainVideoRef.current.playbackRate = VIDEO_PLAYBACK_RATE;
        }
    }, [currentIndex]);

    useGSAP(() => {
        if (hasClicked) {
            gsap.set('#next-video', { visibility: 'visible' })

            gsap.to('#next-video', {
                transformOrigin: 'center center',
                scale: 1,
                width: '100%',
                height: '100%',
                duration: 1,
                ease: 'power1.inOut',
                onStart: () => nextVideoRef.current.play(),
            })

            gsap.from('#current-video', {
                transformOrigin: 'center center',
                scale: 0,
                duration: 1.5,
                ease: 'power1.inOut',
            })
        }
    }, { dependencies: [currentIndex], revertOnUpdate: true });

    useGSAP(() => {
        gsap.set('#video-frame', {
            clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
            borderRadius: '0 0 40% 7%',
        })

        gsap.from('#video-frame', {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            borderRadius: '0 0 0 0',
            ease: 'power1.inOut',
            scrollTrigger: {
                trigger: '#video-frame',
                start: 'center center',
                end: 'bottom center',
                scrub: true,
            },
        })
    })

    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;


    return (
        <div id='hero' className='relative h-dvh w-screen overflow-x-hidden'>

            {isLoading && (
                <div className='flex-center absolute z-100 h-dvh w-screen overflow-hidden bg-white'>
                    <div className='three-body'>
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                        <div className='three-body__dot' />
                    </div>
                </div>
            )}
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'>
                <div>
                    <div className='mask-clip-path absolute-center absolute z-50 overflow-hidden rounded-lg'>
                        {/* <div onClick={handleMiniVdClick} className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'>
                            <video
                                ref={nextVideoRef}
                                src={getVideoSrc(upcomingVideoIndex)}
                                loop
                                muted
                                id='current-video'
                                className='size-64 origin-center scale-150 object-cover object-center'
                                onLoadedData={handleVideoLoad}
                                onError={handleVideoError}
                            />
                        </div> */}
                    </div>
                    <video
                        ref={nextVideoRef}
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        id='next-video'
                        className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
                        onLoadedData={handleVideoLoad}
                        onError={handleVideoError}
                    />

                    <video
                        ref={mainVideoRef}
                        src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)}
                        autoPlay
                        loop
                        muted
                        className='absolute left-0 top-0 size-full object-cover object-center'
                        onLoadedData={handleVideoLoad}
                        onError={handleVideoError}
                    />
                    <div className="absolute left-0 top-0 size-full bg-black/60 z-10" />
                </div>
                <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-white'>
                    <b>O</b>rasis
                </h1>

                <div className='absolute left-0 top-0 z-40 size-full'>
                    <div className='mt-24 px-5 sm:px-10'>
                        <h1 className='special-font hero-heading text-white'>i<b>n</b>spire</h1>
                        <p className='mb-5 max-w-64 font-family-robert-regular text-blue-100'>Discover the world's best design inspiration. Curated for designers, by designers.</p>
                        <Button id='register-button' title='Register Now!' leftIcon={<TiLocationArrow />} containerClass='!bg-yellow-300 flex-center gap-1' to='/register' />
                    </div>
                </div>
            </div>
            <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>
                <b>O</b>rasis
            </h1>
        </div>
    )
}

export default Hero
