/**
 * How to Use Page
 * Complete guide showing the step-by-step process for using Snap2Fix
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function HowToUsePage() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current || !progressLineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const center = window.innerHeight / 2;

            const scrollProgress = (center - rect.top) / rect.height;
            const progress = Math.max(0, Math.min(100, scrollProgress * 100));
            progressLineRef.current.style.height = `${progress}%`;

            circleRefs.current.forEach((circle) => {
                if (!circle) return;

                const circleRect = circle.getBoundingClientRect();
                const circleCenterY = circleRect.top + circleRect.height / 2;
                const isActive = circleCenterY <= center;

                circle.style.backgroundColor = isActive ? '#FF0000' : '#FFFFFF';
                circle.style.boxShadow = isActive
                    ? '0 0 10px rgba(255,0,0,0.5), 0 0 20px rgba(255,0,0,0.3)'
                    : '0 0 10px rgba(255,255,255,0.3)';
                circle.style.transform = `translate(-50%, -50%) scale(${isActive ? 1.2 : 1})`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#121212] dotted-background">
            {/* Header */}
            <header className="sticky top-0 z-50 pt-4 pb-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
                        <div className="flex items-center justify-between h-10">
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
                        <Image
                            src="/snap2fix-logo.svg"
                            alt="Snap2Fix"
                            width={120}
                            height={48}
                            className="h-10 sm:h-12 w-auto relative"
                            style={{ top: '0.3em' }}
                            priority
                        />
                        <span>Works</span>
                    </h1>
                    <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                        A simple step-by-step process to manage your complaints efficiently
                    </p>
                </div>

                {/* Timeline Content */}
                <div className="relative" ref={timelineRef}>

                    <div
                        className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 h-full"
                        style={{
                            width: '3px',
                            background: 'linear-gradient(to bottom, transparent 0%, #4A4A4A 3%, #4A4A4A 97%, transparent 100%)'
                        }}
                    />

                    <div
                        ref={progressLineRef}
                        className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 top-0"
                        style={{
                            width: '3px',
                            height: '0%',
                            background: 'linear-gradient(to bottom, transparent 0%, #DC2626 3%, #DC2626 97%, transparent 100%)',
                            transition: 'height 0.05s linear'
                        }}
                    />

                    {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((position, i) => (
                        <div
                            key={position}
                            ref={(el) => { circleRefs.current[i] = el; }}
                            className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#121212] z-10"
                            style={{
                                top: `${position}%`,
                                backgroundColor: '#FFFFFF',
                                boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                                transform: 'translate(-50%, -50%) scale(1)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                    ))}

                    {/* ALL STEPS */}
                    {[...Array(10)].map((_, i) => {
                        const step = i + 1;
                        return (
                            <div key={step} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">

                                {/* Mobile */}
                                <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                                    <Image
                                        src={`/animation/${step}.webp`}
                                        alt={`Step ${step}`}
                                        width={800}
                                        height={600}
                                        className="w-full"
                                    />
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white">
                                            Step {step}
                                        </h3>
                                    </div>
                                </div>

                                {/* Desktop Image */}
                                <div className="hidden lg:block">
                                    <Image
                                        src={`/animation/${step}.webp`}
                                        alt={`Step ${step}`}
                                        width={500}
                                        height={350}
                                        className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10"
                                        priority={step === 1}
                                        quality={90}
                                    />
                                </div>

                                {/* Desktop Text */}
                                <div className="hidden lg:block">
                                    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                        <h3 className="text-2xl font-bold text-white mb-4">
                                            Step {step}
                                        </h3>
                                        <p className="text-[#B0B0B0] leading-relaxed">
                                            This stage ensures smooth complaint processing within Snap2Fix.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}

                </div>
            </main>

            {/* Footer remains EXACTLY same except logo optimized */}

            <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/snap2fix-logo.svg"
                                alt="Snap2Fix"
                                width={120}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-[#2A2A2A] mt-8">
                        <div className="flex justify-between items-center">
                            <p className="text-[#808080] text-sm">
                                © {new Date().getFullYear()} Snap2Fix. All rights reserved.
                            </p>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}