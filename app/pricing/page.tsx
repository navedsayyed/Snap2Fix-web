/**
 * Pricing Page
 * Pricing information for Snap2Fix services
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PricingPage() {
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
                                <h2 className="text-xl font-bold text-white">Pricing</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                        Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">Transparent</span> Pricing
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-[#B0B0B0] max-w-2xl mx-auto">
                        Choose the plan that works best for your organization
                    </p>
                </div>

                {/* Pricing Content - Placeholder */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-[#333333] text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <svg width="32" height="32" className="text-white sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Free to Use</h2>
                    <p className="text-[#B0B0B0] text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                        Snap2Fix is currently free for all users! Submit unlimited complaints and track them in real-time at no cost.
                    </p>
                    <div className="inline-block bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
                        <p className="text-[#00BFFF] font-semibold text-sm sm:text-base">
                            💡 Enterprise plans with advanced features coming soon
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
