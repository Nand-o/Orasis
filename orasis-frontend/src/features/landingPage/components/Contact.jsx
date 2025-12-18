/**
 * Landing Contact
 *
 * Section kontak sederhana pada landing page (form atau link). Digunakan
 * untuk meminta feedback atau menampilkan metode kontak utama.
 */
import React from 'react'
import Button from './Button'
import PixelBlast from '../../../components/ui/PixelBlast';

const ImageClipBox = ({ src, clipClass }) => (
    <div className={clipClass}>
        <img
            src={src}
        />
    </div>
)

const Contact = () => {

    return (
        <div id='contact' className='my-20 min-h-96 w-screen px-10'>
            <div className='relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden'>
                <div style={{ width: '100%', height: '500px', position: 'absolute' }}>
                    <PixelBlast
                        variant="circle"
                        pixelSize={6}
                        color="#5724FF"
                        patternScale={3}
                        patternDensity={1.2}
                        pixelSizeJitter={0.5}
                        enableRipples
                        rippleSpeed={0.4}
                        rippleThickness={0.12}
                        rippleIntensityScale={1.5}
                        liquid
                        liquidStrength={0.12}
                        liquidRadius={1.2}
                        liquidWobbleSpeed={5}
                        speed={0.6}
                        edgeFade={0.25}
                        transparent
                    />
                </div>

                <div className='flex flex-col items-center text-center z-10 relative mx-auto max-w-4xl px-4'>
                    <p className='font-family-general text-[10px] uppercase text-white'>Get in Touch</p>
                    <p className='special-font mt-10 w-full font-family-zentry text-5xl leading-[0.9] md:text-[6rem] text-white'>
                        Re<b>a</b>dy <br /> to sho<b>w</b>case <br /> y<b>o</b>ur Desi<b>g</b>n?</p>
                    <Button
                        title='contact us'
                        containerClass='mt-10 cursor-pointer !bg-yellow-300 !text-black'
                        to='#'
                    />
                </div>
            </div>
        </div>
    )
}

export default Contact
