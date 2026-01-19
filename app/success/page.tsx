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
        <div className="min-h-screen bg-[#121212]">
            {/* Header */}
            <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <svg width="20" height="20" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:inline">Back to Home</span>
                        </Link>
                        <h1 className="text-xl font-bold text-white flex-1">Success</h1>
                    </div>
                </div>
            </header>
            
            <div className="flex items-center justify-center p-4 pt-20">
                <div className="max-w-2xl w-full">
                    <div className="bg-[#1E1E1E] border border-[#404040] rounded-2xl shadow-xl p-8 md:p-12 text-center animate-slide-in-up">
                        {/* Success Icon */}
                    <div className="w-20 h-20 bg-[#4CAF50]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="48" height="48" className="text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Complaint Submitted!
                    </h1>
                    <p className="text-lg text-[#B0B0B0] mb-8">
                        Your complaint has been successfully submitted and is now pending review.
                    </p>

                    {/* Complaint ID */}
                    <div className="bg-[#2C2C2C] border border-[#404040] rounded-xl p-6 mb-8">
                        <p className="text-sm text-[#B0B0B0] mb-2">Your Complaint ID</p>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-3xl font-bold text-white font-mono">
                                #{shortId(complaintId)}
                            </p>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-[#404040] rounded-lg transition-colors"
                                title="Copy ID"
                            >
                                {copied ? (
                                    <svg width="20" height="20" className="text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" className="text-[#B0B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-[#B0B0B0] mt-2">Save this ID to track your complaint</p>
                    </div>

                    {/* Tracking Link - Always show */}
                    <div className="bg-[#00BFFF]/10 border border-[#00BFFF]/50 rounded-lg p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <svg width="20" height="20" className="text-[#00BFFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-left flex-1">
                                <p className="text-sm font-medium text-white">Save Your Tracking Link</p>
                                <p className="text-sm text-[#B0B0B0] mb-3">Use this link to check your complaint status anytime:</p>
                                <div className="bg-[#2C2C2C] border border-[#404040] rounded-lg p-3 flex items-center justify-between gap-2">
                                    <code className="text-xs text-[#00BFFF] break-all flex-1">{trackingUrl}</code>
                                    <button
                                        onClick={async () => {
                                            await copyToClipboard(trackingUrl);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="p-1.5 hover:bg-[#404040] rounded transition-colors flex-shrink-0"
                                        title="Copy tracking link"
                                    >
                                        {copied ? (
                                            <svg width="16" height="16" className="text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" className="text-[#B0B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-[#B0B0B0] mt-2">💡 Note: Email confirmation may take a few minutes to arrive. Check spam folder if not received.</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <Link href={`/track/${complaintId}`} className="block">
                            <button className="w-full px-6 py-3.5 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2.5">
                                <span className="text-base">Track Your Complaint</span>
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </Link>
                        <Link href="/scan-qr" className="block">
                            <button className="w-full px-6 py-3.5 bg-transparent hover:bg-[#00BFFF]/10 text-[#00BFFF] font-semibold rounded-xl border-2 border-[#00BFFF] hover:border-[#00A8E6] transition-all duration-300 flex items-center justify-center gap-2.5">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-base">Submit Another Complaint</span>
                            </button>
                        </Link>
                    </div>

                    {/* Expected Response Time */}
                    <div className="mt-8 pt-8 border-t border-[#404040]">
                        <p className="text-sm text-[#B0B0B0]">
                            <strong className="text-white">Expected Response Time:</strong> 24-48 hours
                        </p>
                        <p className="text-sm text-[#B0B0B0] mt-1">
                            You'll receive email updates when the status changes
                        </p>
                    </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link href="/" className="text-[#B0B0B0] hover:text-white text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div></div>}>
            <SuccessPageContent />
        </Suspense>
    );
}