/**
 * Track Landing Page
 * Input page for entering complaint ID
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function TrackPage() {
    const router = useRouter();
    const [complaintId, setComplaintId] = useState('');
    const [error, setError] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!complaintId.trim()) {
            setError('Please enter a complaint ID');
            return;
        }

        // Clean the ID (remove # and spaces)
        const cleanId = complaintId.trim().replace(/^#/, '').replace(/\s/g, '');

        // Basic validation - check if it's not empty after cleaning
        if (!cleanId) {
            setError('Please enter a valid complaint ID');
            return;
        }

        // Accept any valid ID (numeric or UUID)
        router.push(`/track/${cleanId}`);
    };

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
                                <h1 className="text-xl font-bold text-white">Track Complaint</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="max-w-2xl mx-auto">
                    <div className={`text-center mb-6 sm:mb-8 transition-all duration-500 ${isInputFocused ? 'scale-95 sm:scale-100' : 'scale-100'}`}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 border border-[#00BFFF]/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg width="24" height="24" className="text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Track Your Complaint</h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Enter your complaint ID to check the current status and progress
                    </p>
                </div>

                <div className="bg-[#1E1E1E] rounded-2xl border border-[#333333] p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Complaint ID <span className="text-[#00BFFF]">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={complaintId}
                                onChange={(e) => setComplaintId(e.target.value)}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="e.g., #ABC12345"
                                className="w-full px-4 py-3 sm:py-4 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300 text-base"
                            />
                            {error && (
                                <p className="mt-2 text-sm text-[#F44336]">{error}</p>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                                Find this in your confirmation email
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>Track Complaint</span>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[#333333]">
                        <h3 className="text-sm font-semibold text-white mb-3">Where to find your ID?</h3>
                        <ul className="space-y-2.5 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <svg width="20" height="20" className="text-[#00BFFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Check the confirmation email sent after submission</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg width="20" height="20" className="text-[#00BFFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Click the tracking link in your email</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg width="20" height="20" className="text-[#00BFFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>It was shown on the success page after submission</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/scan-qr">
                        <button className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20">
                            Submit New Complaint
                        </button>
                    </Link>
                </div>
                </div>
            </main>
        </div>
    );
}
