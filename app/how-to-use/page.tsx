/**
 * How to Use Page
 * Complete guide showing the step-by-step process for using Snap2Fix
 */

'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HowToUsePage() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const progressLineRef = useRef<HTMLDivElement>(null);
    const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Scrollytelling: fixed center line + growing red line from top
        const handleScroll = () => {
            if (!timelineRef.current || !progressLineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const center = window.innerHeight / 2;

            // Calculate how much red line to show from top of timeline to center line
            const scrollProgress = (center - rect.top) / rect.height;
            const progress = Math.max(0, Math.min(100, scrollProgress * 100));
            progressLineRef.current.style.height = `${progress}%`;

            // Activate dots when they pass through the fixed center line
            circleRefs.current.forEach((circle) => {
                if (!circle) return;

                const circleRect = circle.getBoundingClientRect();
                const circleCenterY = circleRect.top + circleRect.height / 2;

                // Dot is active if it has passed through (or is at) the viewport center
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
                            {/* Back Button and Title */}
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
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 flex items-baseline justify-center gap-4">
                        <span>How</span>
                        <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-10 sm:h-12 w-auto relative" style={{top: '0.3em'}} />
                        <span>Works</span>
                    </h1>
                    <p className="text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                        A simple step-by-step process to manage your complaints efficiently
                    </p>
                </div>

                {/* Timeline Content */}
                <div className="relative" ref={timelineRef}>
                    {/* Gray background line with blur at top and bottom */}
                    <div
                        className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 h-full"
                        style={{
                            width: '3px',
                            background: 'linear-gradient(to bottom, transparent 0%, #4A4A4A 3%, #4A4A4A 97%, transparent 100%)'
                        }}
                    />

                    {/* Red progress line with blur effect at both ends */}
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

                    {/* Animated Dots - One for each step positioned in the middle */}
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

                    {/* Step 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        {/* Mobile: combined card */}
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/1.png" alt="Step 1" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 1: Identify the Issue</h3>
                            </div>
                        </div>
                        {/* Desktop: separate blocks */}
                        <div className="hidden lg:block order-1">
                            <img src="/animation/1.png" alt="Step 1" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                        <div className="hidden lg:block order-2 relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 1: Identify the Issue</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Notice a problem in your facility? Whether it's a broken AC, faulty electrical outlet, or damaged furniture - we've got you covered. Simply identify the issue that needs attention.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/2.png" alt="Step 2" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 2: Scan QR Code</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 2: Scan QR Code</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Find the QR code placed in your location and scan it with your phone. This automatically fills in the location details, making the process lightning fast and error-free.
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/animation/2.png" alt="Step 2" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/3.png" alt="Step 3" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 3: Fill Details</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block order-1">
                            <img src="/animation/3.png" alt="Step 3" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                        <div className="hidden lg:block order-2 relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 3: Fill Details</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Enter your name, email, and phone number. Describe the issue in detail and select the type of problem (Electrical, Plumbing, IT, etc.) and its priority level.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/4.png" alt="Step 4" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 4: Upload Photo</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 4: Upload Photo</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Snap a clear photo of the issue to help our technicians understand the problem better. A picture is worth a thousand words and speeds up the resolution process.
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/animation/4.png" alt="Step 4" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/5.png" alt="Step 5" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 5: Submit Complaint</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block order-1">
                            <img src="/animation/5.png" alt="Step 5" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                        <div className="hidden lg:block order-2 relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 5: Submit Complaint</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Review all the information and hit submit. You'll receive an instant confirmation email with your unique tracking ID to monitor the progress.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 6 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/6.png" alt="Step 6" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 6: Complaint Received</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 6: Complaint Received</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Your complaint is now in our system. Our team reviews it immediately and categorizes it based on priority and department for efficient handling.
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/animation/6.png" alt="Step 6" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                    </div>

                    {/* Step 7 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/7.png" alt="Step 7" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 7: Assignment to Technician</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block order-1">
                            <img src="/animation/7.png" alt="Step 7" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                        <div className="hidden lg:block order-2 relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 7: Assignment to Technician</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    A qualified technician from the relevant department is assigned to your complaint. You'll get notified via email about who's handling your case.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 8 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/8.png" alt="Step 8" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 8: Work in Progress</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 8: Work in Progress</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    The technician begins working on resolving your issue. Track real-time updates as the status changes from "Assigned" to "In Progress" on your tracking page.
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/animation/8.png" alt="Step 8" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                    </div>

                    {/* Step 9 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/9.png" alt="Step 9" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 9: Issue Resolved</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block order-1">
                            <img src="/animation/9.png" alt="Step 9" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                        <div className="hidden lg:block order-2 relative">
                            <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 9: Issue Resolved</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    The problem is fixed! Our technician completes the work and may upload a photo as proof of completion. You'll receive a completion notification immediately.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 10 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-20 items-center">
                        <div className="lg:hidden bg-gradient-to-br from-[#1A3A1A] to-[#1A1A1A] border border-[#00FF00]/30 rounded-2xl overflow-hidden ml-10">
                            <img src="/animation/10.png" alt="Step 10" className="w-full" />
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white">Step 10: Completed ✅</h3>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="bg-gradient-to-br from-[#1A3A1A] to-[#1A1A1A] border border-[#00FF00]/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Step 10: Completed ✅</h3>
                                <p className="text-[#B0B0B0] leading-relaxed">
                                    Your complaint is now marked as "Completed". Check the timeline to see the full journey from submission to resolution. Thank you for using Snap2Fix!
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img src="/animation/10.png" alt="Step 10" className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/10" />
                        </div>
                    </div>
                </div>
            </main>

            {/* Professional Footer */}
            <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center gap-2 group">
                                <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-8 w-auto" />
                            </Link>
                            <p className="text-[#B0B0B0] text-sm leading-relaxed">
                                Professional complaint management system for efficient facility maintenance and support.
                            </p>
                            {/* Social Media Icons */}
                            <div className="flex gap-4 pt-2">
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#2A2A2A] hover:bg-[#DC2626] border border-white/10 flex items-center justify-center transition-all duration-300 group">
                                    <svg className="w-5 h-5 text-[#B0B0B0] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
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
                                        support@snap2fix.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <a href="tel:+1234567890" className="text-[#B0B0B0] hover:text-white text-sm transition-colors duration-200">
                                        +1 (234) 567-890
                                    </a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[#B0B0B0] text-sm">
                                        123 Business Ave, Suite 100<br />
                                        New York, NY 10001
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
                                <a href="#" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-[#808080] hover:text-white text-sm transition-colors duration-200">
                                    Cookie Policy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
