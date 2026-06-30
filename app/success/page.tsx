/**
 * Success Page
 * Shown after successful complaint submission
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { shortId, copyToClipboard } from '@/lib/utils';

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const complaintId = searchParams.get('id');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!complaintId) {
            router.push('/');
        }
    }, [complaintId, router]);

    const handleCopy = async () => {
        if (complaintId) {
            const success = await copyToClipboard(shortId(complaintId));
            if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    if (!complaintId) {
        return null;
    }

    const trackingUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/track/${complaintId}`
        : `/track/${complaintId}`;

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
                                <h1 className="text-xl font-bold text-white">Success</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-center p-4 pt-8">
                <div className="max-w-xl w-full">
                    <div className="bg-[#1E1E1E] border border-[#404040] rounded-2xl shadow-xl p-6 sm:p-8 text-center animate-slide-in-up">
                        {/* Success Icon */}
                        <div className="w-16 h-16 bg-[#4CAF50]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="40" height="40" className="text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Complaint Submitted!
                        </h1>
                        <p className="text-sm sm:text-base text-[#B0B0B0] mb-6">
                            Your complaint is now pending review.
                        </p>

                        {/* Complaint ID */}
                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-xl p-4 mb-6">
                            <p className="text-xs text-[#B0B0B0] mb-1">Your Complaint ID</p>
                            <div className="flex items-center justify-center gap-2">
                                <p className="text-2xl sm:text-3xl font-bold text-white font-mono">
                                    #{shortId(complaintId)}
                                </p>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-[#404040] rounded-lg transition-colors"
                                    title="Copy ID"
                                >
                                    {copied ? (
                                        <svg width="18" height="18" className="text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" className="text-[#B0B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-[#B0B0B0] mt-1">Save this ID to track your complaint</p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Link href={`/track/${complaintId}`} className="block">
                                <button className="w-full px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                                    <span>Track Your Complaint</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </Link>
                            <Link href="/scan-qr" className="block">
                                <button className="w-full px-6 py-3 bg-transparent hover:bg-[#00BFFF]/10 text-[#00BFFF] font-semibold rounded-xl border-2 border-[#00BFFF] hover:border-[#00A8E6] transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Submit Another Complaint</span>
                                </button>
                            </Link>
                        </div>

                        {/* Expected Response Time */}
                        <div className="mt-6 pt-6 border-t border-[#404040]">
                            <p className="text-xs sm:text-sm text-[#B0B0B0]">
                                <strong className="text-white">Expected Response:</strong> 24-48 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#121212] dotted-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div></div>}>
            <SuccessPageContent />
        </Suspense>
    );
}