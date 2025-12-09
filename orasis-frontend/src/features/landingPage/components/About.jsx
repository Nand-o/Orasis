/**
 * Landing About
 *
 * Seksi 'About' pada landing page yang menampilkan headline
 * animatif dan latar gambar. Menggunakan GSAP + ScrollTrigger
 * untuk animasi clip/mask saat pengunjung menggulir halaman.
 */
import { useGSAP } from '@gsap/react'
import React from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import AnimationTitle from './AnimationTitle'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
    useGSAP(() => {
        const clipAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: '#clip',
                start: 'center center',
                end: '+=800 center',
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
            }
        })

        clipAnimation.to('.mask-clip-path', {
            width: '100vw',
            height: '100vh',
            borderRadius: 0,
        })
    })

    return (
        <div id='about' className='min-h-screen w-screen'>
            <div className='relative mb-8 mt-36 flex flex-col items-center gap-5'>
                <h2 className='font-family-general text-main-black text-sm uppercase md:text-[10px]'>
                    Welcome to Orasis</h2>

                <AnimationTitle
                    title="Disc<b>o</b>ver the world's <br /> f<b>i</b>nest design inspiration"
                    containerClass='mt-5 !text-black text-center'
                />

                <div className='about-subtext text-main-black'>
                    <p>Your daily source of inspiration curated for creativity.</p>
                    <p>Orasis unites designers and developers to build better digital experiences.</p>
                </div>
            </div>

            <div className='h-dvh w-screen' id='clip'>
                <div className='mask-clip-path about-image'>
                    <img
                        src='img/about.webp'
                        alt='Background'
                        className='absolute left-0 top-0 size-full object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default About
