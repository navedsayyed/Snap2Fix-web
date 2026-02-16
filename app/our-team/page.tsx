/**
 * Our Team Page
 * Displays information about the Snap2Fix team
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OurTeamPage() {
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
                                <h2 className="text-xl font-bold text-white">Our Team</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">Team</span>
                    </h1>
                    <p className="text-base sm:text-xl text-[#B0B0B0] max-w-3xl mx-auto">
                        Dedicated professionals working to make facility management effortless
                    </p>
                </div>

                {/* Team Content - Placeholder */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12 border border-[#333333] text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                        <svg width="28" height="28" className="sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Coming Soon</h2>
                    <p className="text-[#B0B0B0] text-base sm:text-lg">
                        Our team page is under construction. Check back soon to meet the people behind Snap2Fix!
                    </p>
                </div>
            </main>
        </div>
    );
}
