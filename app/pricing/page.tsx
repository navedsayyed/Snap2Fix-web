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
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">Transparent</span> Pricing
                    </h1>
                    <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto">
                        Choose the plan that works best for your organization
                    </p>
                </div>

                {/* Pricing Content - Placeholder */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl p-12 border border-[#333333] text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg width="36" height="36" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Free to Use</h2>
                    <p className="text-[#B0B0B0] text-lg mb-8">
                        Snap2Fix is currently free for all users! Submit unlimited complaints and track them in real-time at no cost.
                    </p>
                    <div className="inline-block bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-2xl px-8 py-4">
                        <p className="text-[#00BFFF] font-semibold text-lg">
                            💡 Enterprise plans with advanced features coming soon
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
