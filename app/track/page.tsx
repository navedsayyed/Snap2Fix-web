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
        <div className="min-h-screen bg-[#121212] overflow-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="px-2 py-2 text-[#B0B0B0] hover:text-white transition-colors flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Track Complaint</h1>
                                <p className="text-[#00BFFF] text-xs sm:text-sm font-semibold hidden sm:block">Check status & progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="max-w-2xl mx-auto">
                    <div className={`text-center mb-8 sm:mb-12 transition-all duration-500 ${isInputFocused ? 'scale-90 sm:scale-100' : 'scale-100'}`}>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 border border-[#00BFFF]/20 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6">
                        <svg width="28" height="28" className="text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Track Your Complaint</h1>
                    <p className="text-base sm:text-lg text-gray-400">
                        Enter your complaint ID to check the current status and progress
                    </p>
                </div>

                <div className="bg-[#1E1E1E] rounded-2xl sm:rounded-3xl border border-[#333333] p-6 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                                placeholder="e.g., #ABC12345 or full ID"
                                className="w-full px-4 py-3 sm:py-4 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300 text-base"
                            />
                            {error && (
                                <p className="mt-2 text-sm text-[#F44336]">{error}</p>
                            )}
                            <p className="mt-2 text-xs sm:text-sm text-gray-500">
                                You can find this in your confirmation email
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold py-3 sm:py-4 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <span>Track Complaint</span>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#333333]">
                        <h3 className="text-sm font-semibold text-white mb-4">Where to find your ID?</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
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

                <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-4">Don't have a complaint ID yet?</p>
                    <Link href="/submit">
                        <button className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20">
                            Submit a New Complaint
                        </button>
                    </Link>
                </div>
                </div>
            </main>
        </div>
    );
}
