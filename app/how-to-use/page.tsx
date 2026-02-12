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
                            <Link href="/" className="flex items-center gap-2 group">
                                <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-7 w-auto" />
                            </Link>
                            <Link href="/">
                                <Button size="sm">Back to Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How Snap2Fix Works</h1>
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
        </div>
    );
}
