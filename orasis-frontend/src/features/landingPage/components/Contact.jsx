import React from 'react'
import Button from './Button'

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
                <div className='absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96'>
                    <ImageClipBox
                        src='img/contact-1.webp'
                        clipClass='contact-clip-path-1'
                    />
                    <ImageClipBox
                        src='img/contact-2.webp'
                        clipClass='contact-clip-path-2 lg:translate-y-40 translate-y-60'
                    />
                </div>

                <div className='absolute -top-40 left-30 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80'>
                    <ImageClipBox
                        src='img/swordman-partial.webp'
                        clipClass='absolute md:scale-125'
                    />
                    <ImageClipBox
                        src='img/swordman.webp'
                        clipClass='sword-man-clip-path md:scale-125'
                    />
                </div>

                <div className='flex flex-col items-center text-center'>
                    <p className='font-family-general text-[10px] uppercase text-white'>Get in Touch</p>
                    <p className='special-font mt-10 w-full font-family-zentry text-5xl leading-[0.9] md:text-[6rem] text-white'>
                        Re<b>a</b>dy <br /> to sho<b>w</b>case <br /> y<b>o</b>ur tale<b>n</b>t?</p>
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
