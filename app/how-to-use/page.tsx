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
                            backgroundColor: '#DC2626',
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center gap-2">
                                <Image src="/snap2fix-logo.svg" alt="Snap2Fix" width={120} height={32} className="h-8 w-auto" />
                            </Link>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">Professional complaint management system for efficient facility maintenance and support.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
                            <ul className="space-y-3">
                                {[{ href: '/', label: 'Home' }, { href: '/how-to-use', label: 'How to Use' }, { href: '/track', label: 'Track Complaint' }, { href: '/pricing', label: 'Pricing' }].map(link => (
                                    <li key={link.href}><Link href={link.href} className="text-[#B0B0B0] hover:text-white text-sm transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Company</h3>
                            <ul className="space-y-3">
                                {[{ href: '/our-team', label: 'Our Team' }, { href: '#', label: 'About Us' }, { href: '#', label: 'Careers' }, { href: '#', label: 'Contact' }].map((link, i) => (
                                    <li key={i}><Link href={link.href} className="text-[#B0B0B0] hover:text-white text-sm transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Get in Touch</h3>
                            <ul className="space-y-3">
                                <li><a href="mailto:support@snap2fix.com" className="text-[#B0B0B0] hover:text-white text-sm transition-colors">support@snap2fix.com</a></li>
                                <li><a href="tel:+1234567890" className="text-[#B0B0B0] hover:text-white text-sm transition-colors">+1 (234) 567-890</a></li>
                                <li><span className="text-[#B0B0B0] text-sm">123 Business Ave, Suite 100, New York, NY 10001</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#808080] text-sm">© {new Date().getFullYear()} Snap2Fix. All rights reserved.</p>
                        <div className="flex gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
                                <a key={label} href="#" className="text-[#808080] hover:text-white text-sm transition-colors">{label}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}