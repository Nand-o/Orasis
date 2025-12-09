import React, { useRef } from 'react'
/**
 * GetStarted (Landing)
 *
 * Section CTA untuk mengajak pengunjung melakukan pendaftaran atau melihat
 * demo. Biasanya menampilkan tombol besar dan ringkasan manfaat singkat.
 */
import AnimationTitle from './AnimationTitle'
import RoundedCorners from './RoundedCorners'
import Button from './Button'
import { gsap } from 'gsap'

const Story = () => {
    const frameRef = useRef(null);

    const handleMouseLeave = () => {
        const element = frameRef.current;

        gsap.to(element, {
            duration: 0.3,
            rotateX: 0,
            rotateY: 0,
            ease: 'power1.inOut',
        })
    }

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const element = frameRef.current;

        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
            duration: 0.3,
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 500,
            ease: 'power1.inOut',
        })
    }

    return (
        <section id='get-started' className='min-h-dvh w-screen bg-black text-white'>
            <div className='flex size-full flex-col items-center py-10 pb-24'>
                <p className='font-family-general text-sm uppercase md:text-[10px]'>Start Your Creative Journey</p>
                <div className='relative size-full'>
                    <AnimationTitle
                        title="Le<b>t</b>'s <b>b</b>egin <br /> your crea<b>t</b>ive p<b>a</b>th"
                        section='#story'
                        containerClass='mt-5 pointer-events-none mix-blend-difference relative z-10'
                    />

                    <div className='story-img-container'>
                        <div className='story-img-mask'>
                            <div className='story-img-content'>
                                <img
                                    ref={frameRef}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseUp={handleMouseLeave}
                                    onMouseEnter={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                    src='/img/entrance.webp'
                                    alt='entrance'
                                    className='object-contain'
                                />
                            </div>
                        </div>
                        <RoundedCorners />
                    </div>
                </div>

                <div className='-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end'>
                    <div className='flex h-full w-fit flex-col items-center md:items-start'>
                        <p className='mt-3 max-w-sm text-center font-family-circular-web text-white md:text-start'>
                            Join a thriving community of designers. Share your work, get inspired,
                            and elevate your portfolio to new heights.
                        </p>
                        <Button
                            id='get-started-button'
                            title='Get Started Now'
                            containerClass='mt-5 !bg-yellow-300 !text-black'
                            to='/register'
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Story
