import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import GetStarted from './components/GetStarted'
import Contact from './components/Contact'
import Footer from './components/Footer'

const LandingPage = () => {
    return (
        <main className='relative min-h-screen w-screen overflow-x-hidden'>
            <Navbar />
            <Hero />
            <About />
            <Features />
            <GetStarted />
            <Contact />
            <Footer />
        </main>
    )
}

export default LandingPage
