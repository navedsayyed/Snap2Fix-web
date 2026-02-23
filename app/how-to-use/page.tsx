'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HowToUsePage() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current || !progressLineRef.current) return;

            const CENTER = window.innerHeight / 2;
            const rect = timelineRef.current.getBoundingClientRect();

            // How many px from timeline top to the viewport center
            const filledPx = CENTER - rect.top;
            const clamped = Math.max(0, Math.min(rect.height, filledPx));

            // Red line grows from top of timeline downward — bottom edge always at viewport center
            progressLineRef.current.style.height = `${clamped}px`;


            // Step dots: turn red when they cross above center
            circleRefs.current.forEach((circle) => {
                if (!circle) return;
                const cr = circle.getBoundingClientRect();
                const passed = (cr.top + cr.height / 2) <= CENTER;
                circle.style.backgroundColor = passed ? '#DC2626' : '#3A3A3A';
                circle.style.border = passed ? '2px solid #DC2626' : '2px solid #555';
                circle.style.boxShadow = passed ? '0 0 10px rgba(220,38,38,0.8), 0 0 20px rgba(220,38,38,0.4)' : 'none';
                circle.style.transform = `translate(-50%, -50%) scale(${passed ? 1.2 : 1})`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        { number: 1, title: 'Identify the Issue', description: "Notice a problem in your facility? Whether it's a broken AC, faulty electrical outlet, or damaged furniture - we've got you covered.", image: '/animation/1.webp' },
        { number: 2, title: 'Scan QR Code', description: 'Find the QR code placed in your location and scan it with your phone. This automatically fills in the location details, making the process lightning fast and error-free.', image: '/animation/2.webp' },
        { number: 3, title: 'Fill Details', description: 'Enter your name, email, and phone number. Describe the issue in detail and select the type of problem (Electrical, Plumbing, IT, etc.) and its priority level.', image: '/animation/3.webp' },
        { number: 4, title: 'Upload Photo', description: 'Snap a clear photo of the issue to help our technicians understand the problem better. A picture is worth a thousand words and speeds up the resolution process.', image: '/animation/4.webp' },
        { number: 5, title: 'Submit Complaint', description: "Review all the information and hit submit. You'll receive an instant confirmation email with your unique tracking ID to monitor the progress.", image: '/animation/5.webp' },
        { number: 6, title: 'Complaint Received', description: 'Your complaint is now in our system. Our team reviews it immediately and categorizes it based on priority and department for efficient handling.', image: '/animation/6.webp' },
        { number: 7, title: 'Assignment to Technician', description: "A qualified technician from the relevant department is assigned to your complaint. You'll get notified via email about who's handling your case.", image: '/animation/7.webp' },
        { number: 8, title: 'Work in Progress', description: 'The technician begins working on resolving your issue. Track real-time updates as the status changes from "Assigned" to "In Progress" on your tracking page.', image: '/animation/8.webp' },
        { number: 9, title: 'Issue Resolved', description: "The problem is fixed! Our technician completes the work and may upload a photo as proof of completion. You'll receive a completion notification immediately.", image: '/animation/9.webp' },
        { number: 10, title: 'Completed ✅', description: 'Your complaint is now marked as "Completed". Check the timeline to see the full journey from submission to resolution. Thank you for using Snap2Fix!', image: '/animation/10.webp', isLast: true },
    ];

    return (
        <div className="min-h-screen bg-[#121212] dotted-background">

            {/* Header */}
            <header className="sticky top-0 z-50 pt-4 pb-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
                        <div className="flex items-center h-10">
                            <div className="flex items-center gap-3">
                                <Link href="/" className="p-2 hover:bg-[#2C2C2C] rounded-full transition-colors">
                                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h2 className="text-xl font-bold text-white">How to Use</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 flex items-baseline justify-center gap-3">
                        <span>How</span>
                        <Image src="/snap2fix-logo.svg" alt="Snap2Fix" width={120} height={48} className="h-10 sm:h-12 w-auto relative" style={{ top: '0.3em' }} priority />
                        <span>Works</span>
                    </h1>
                    <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                        A simple step-by-step process to manage your complaints efficiently
                    </p>
                </div>

                {/* Timeline container — the vertical line lives here, NOT full-width */}
                <div className="relative" ref={timelineRef}>

                    {/* GRAY TRACK — thin vertical line, centered on desktop, left on mobile */}
                    <div
                        className="absolute left-5 lg:left-1/2 top-0 h-full"
                        style={{
                            width: '3px',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(to bottom, transparent 0%, #3A3A3A 3%, #3A3A3A 97%, transparent 100%)',
                            zIndex: 1,
                        }}
                    />

                    {/* RED PROGRESS LINE — grows downward from top as you scroll.
                        It is ONLY 3px wide, sitting on the vertical track.
                        NO position:fixed, NO full-width. Just the narrow vertical track. */}
                    <div
                        ref={progressLineRef}
                        className="absolute left-5 lg:left-1/2 top-0"
                        style={{
                            width: '3px',
                            height: '0px',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(220,38,38,0.3) 8%, rgba(220,38,38,0.7) 20%, #DC2626 40%)',
                            zIndex: 2,
                            pointerEvents: 'none',
                        }}
                    />

                    {/* STEP DOTS — one per step, turn red when passed by center */}
                    {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((position, i) => (
                        <div
                            key={position}
                            ref={(el) => { circleRefs.current[i] = el; }}
                            className="absolute left-5 lg:left-1/2 w-4 h-4 rounded-full z-20"
                            style={{
                                top: `${position}%`,
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#3A3A3A',
                                border: '2px solid #555',
                            }}
                        />
                    ))}

                    {/* STEP CARDS */}
                    {steps.map((step, index) => {
                        const isOdd = index % 2 === 0;
                        return (
                            <div key={step.number} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                                {/* Mobile */}
                                <div className={`lg:hidden border border-white/10 rounded-2xl overflow-hidden ml-10 ${step.isLast ? 'bg-gradient-to-br from-[#1A3A1A] to-[#1A1A1A] border-[#00FF00]/30' : 'bg-[#1A1A1A]'}`}>
                                    <Image src={step.image} alt={`Step ${step.number}`} width={800} height={600} className="w-full" />
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white">Step {step.number}: {step.title}</h3>
                                    </div>
                                </div>
                                {/* Desktop image */}
                                <div className={`hidden lg:block ${isOdd ? 'order-1' : 'order-2'}`}>
                                    <Image src={step.image} alt={`Step ${step.number}`} width={500} height={375} className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" priority={step.number === 1} />
                                </div>
                                {/* Desktop text */}
                                <div className={`hidden lg:block ${isOdd ? 'order-2' : 'order-1'}`}>
                                    <div className={`rounded-2xl p-8 ${step.isLast ? 'bg-gradient-to-br from-[#1A3A1A] to-[#1A1A1A] border border-[#00FF00]/30' : 'bg-[#1A1A1A] border border-white/10'}`}>
                                        <h3 className="text-2xl font-bold text-white mb-4">Step {step.number}: {step.title}</h3>
                                        <p className="text-[#B0B0B0] leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-8 w-auto" />
                            </div>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">
                                Professional complaint management system for efficient facility maintenance and support.
                            </p>
                            {/* Social Media Icons */}
                            <div className="flex gap-4 pt-2">
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/how-to-use" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        How to Use
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/track" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Track Complaint
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/our-team" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Our Team
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help-support" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Help & Support
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-[#DC2626] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Get in Touch</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:support@snap2fix.com" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200">
                                        snap2fix.official@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href="tel:+1234567890" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200">
                                        +19 9356559922
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[#B0B0B0] text-sm">
                                        Nashik ,MH
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-[#2A2A2A]">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-[#808080] text-sm text-center md:text-left">
                                © {new Date().getFullYear()} Snap2Fix. All rights reserved.
                            </p>
                            <div className="flex gap-6">
                                <Link href="/privacy-policy" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms-of-service" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Terms of Service
                                </Link>
                                <Link href="/cookie-policy" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}