import React, { useEffect, useRef } from 'react';
import {
    MapPin, Calendar, Palette, Monitor, Layout, Lightbulb,
    Mail, Linkedin, Instagram, Briefcase, Award, Clock,
    Users, Globe, Quote, GraduationCap, Building
} from 'lucide-react';

const AboutPageNew = () => {
    const containerRef = useRef(null);

    // Menggunakan useEffect untuk menangani animasi scroll (Intersection Observer)
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-x-8', '-translate-x-8');
                    entry.target.classList.add('opacity-100', 'translate-y-0', 'translate-x-0');
                }
            });
        }, observerOptions);

        const animatedElements = containerRef.current.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <main ref={containerRef} className="w-full px-6 lg:px-24 pb-24 pt-20 bg-white dark:bg-main-black text-main-black dark:text-white font-family-general antialiased overflow-x-hidden">

            {/* Header Section */}
            <section className="pt-10 md:pt-20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                    <h1 className="text-[60px] md:text-[96px] lg:text-[120px] leading-none font-semibold tracking-tight">
                        About
                    </h1>
                    <div className="max-w-sm">
                        <p className="text-sm md:text-base leading-relaxed opacity-80 mb-6">
                            Story, mission, community, curated inspiration, and the creative journey that defines Orasis.
                        </p>
                        <div className="flex items-center space-x-4">
                            <MapPin className="w-4 h-4 opacity-60" />
                            <span className="text-sm opacity-80">Jakarta, Indonesia</span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-dark-gray dark:border-white/50  mt-12 lg:mt-16"></div>
            </section>

            {/* Main Grid Section */}
            <section className="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16 mt-12 lg:mt-20">

                {/* Left Column - Info */}
                <div className="space-y-12 animate-on-scroll opacity-0 -translate-x-8 transition-all duration-1000 delay-100 ease-out">
                    <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-8">
                            Orasis<br />Platform
                        </h2>
                        <p className="text-base leading-relaxed opacity-80 mb-6">
                            The premier digital design gallery bridging art and technology for creators worldwide.
                        </p>
                        <div className="flex items-center space-x-2 text-sm opacity-60">
                            <Calendar className="w-4 h-4" />
                            <span>Open for submissions</span>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium opacity-90">Core Values</h3>
                        <div className="space-y-3">
                            {[
                                { icon: Palette, label: "Curated Quality" },
                                { icon: Monitor, label: "Digital Innovation" },
                                { icon: Layout, label: "User Experience" },
                                { icon: Lightbulb, label: "Creative Inspiration" }
                            ].map((skill, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                    <skill.icon className="w-4 h-4 opacity-60" />
                                    <span className="text-sm">{skill.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium opacity-90">Connect</h3>
                        <div className="space-y-3">
                            {[
                                { icon: Mail, label: "hello@orasis.id" },
                                { icon: Linkedin, label: "@orasis.id" },
                                { icon: Instagram, label: "@orasis.id" }
                            ].map((contact, idx) => (
                                <div key={idx} className="flex items-center space-x-3 group cursor-pointer">
                                    <contact.icon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-sm group-hover:opacity-100 opacity-80 transition-opacity">
                                        {contact.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Visual Grid */}
                <div className="animate-on-scroll opacity-0 translate-x-8 transition-all duration-1000 delay-200 ease-out">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-dark-gray dark:bg-white/50 mb-8">
                        {[
                            { icon: Briefcase, count: "100+", label: "Designs Curated" },
                            { icon: Award, count: "20+", label: "Featured Creators" },
                            { icon: Clock, count: "24/7", label: "Inspiration", colSpan: "col-span-2 lg:col-span-1" },
                            { icon: Users, count: "1000+", label: "Community" },
                            { icon: Globe, count: "10+", label: "Categories" }
                        ].map((stat, idx) => (
                            <div key={idx} className={`bg-white dark:bg-main-black p-6 lg:p-8 flex flex-col justify-end min-h-[120px] hover:bg-violet-300 hover:text-white dark:hover:bg-yellow-300 dark:hover:text-main-black transition-colors group ${stat.colSpan || ''}`}>
                                <div className="flex items-center space-x-2 mb-2">
                                    <stat.icon className="w-5 h-5 opacity-100 group-hover:opacity-100 transition-opacity text-main-black dark:text-white group-hover:text-white dark:group-hover:text-main-black" />
                                    <span className="text-3xl lg:text-4xl font-semibold">{stat.count}</span>
                                </div>
                                <span className="text-xs uppercase tracking-wider opacity-70">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="aspect-square overflow-hidden rounded-lg group">
                            <img
                                src="https://images.unsplash.com/photo-1657920758613-33c0f804f9a3?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Ryunosuke Kikuno"
                                className="w-full h-fit group-hover:scale-105 transition-transform duration-700 object-cover"
                            />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-lg group">
                            <img
                                src="https://images.unsplash.com/photo-1605999081451-4436bf1d0d88?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Juliette Contin"
                                className="w-full h-full group-hover:scale-105 transition-transform duration-700 object-cover"
                            />
                        </div>
                    </div>

                    {/* Quote Section */}
                    <div className="bg-linear-to-br from-dark-gray/5 to-dark-gray/10 dark:from-white/5 dark:to-white/10 rounded-lg p-8 border border-dark-gray dark:border-white/10">
                        <div className="flex items-start space-x-4">
                            <Quote className="w-6 h-6 opacity-40 mt-1 shrink-0" />
                            <div>
                                <p className="text-lg leading-relaxed mb-4 opacity-90">
                                    "Design is not just about making things beautiful—it's about creating meaningful connections between people and ideas through the digital medium."
                                </p>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-linear-to-br from-violet-300 to-violet-400 dark:from-yellow-300 dark:to-yellow-400 rounded-full"></div>
                                    <div>
                                        <div className="text-sm font-medium">Orasis Team</div>
                                        <div className="text-xs opacity-60">2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education & Experience */}
            <section className="mt-20 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-300 ease-out">
                <div className="border-t border-white/20 pt-16">
                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* Education */}
                        <div>
                            <h3 className="text-2xl font-medium tracking-tight mb-8 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-3 opacity-60" />
                                Our Journey
                            </h3>
                            <div className="space-y-6">
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">2025 December</div>
                                    <div className="font-medium mb-2">Platform Launch</div>
                                    <div className="text-sm opacity-80">Official release of Orasis v1.0</div>
                                </div>
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">2025 November</div>
                                    <div className="font-medium mb-2">Concept & Development</div>
                                    <div className="text-sm opacity-80">Initial prototyping and community research</div>
                                </div>
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">2025 October</div>
                                    <div className="font-medium mb-2">Idea Generation</div>
                                    <div className="text-sm opacity-80">Generating ideas for Orasis</div>
                                </div>
                            </div>
                        </div>

                        {/* Experience */}
                        <div>
                            <h3 className="text-2xl font-medium tracking-tight mb-8 flex items-center">
                                <Building className="w-5 h-5 mr-3 opacity-60" />
                                Milestones
                            </h3>
                            <div className="space-y-6">
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">Q3 2026</div>
                                    <div className="font-medium mb-2">Community Growth</div>
                                    <div className="text-sm opacity-80">Reached 50,000 active monthly users</div>
                                </div>
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">Q2 2026</div>
                                    <div className="font-medium mb-2">Partnership Program</div>
                                    <div className="text-sm opacity-80">Collaboration with top design agencies</div>
                                </div>
                                <div className="border-l-2 border-dark-gray dark:border-white/50 pl-6">
                                    <div className="text-sm opacity-60 mb-1">Q4 2025</div>
                                    <div className="font-medium mb-2">Mobile App Beta</div>
                                    <div className="text-sm opacity-80">Testing phase for iOS and Android</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPageNew;
