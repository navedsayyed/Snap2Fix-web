/**
 * Success Page
 * Shown after successful complaint submission
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { shortId, copyToClipboard } from '@/lib/utils';

export default function SuccessPage() {
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

    const trackingUrl = `${window.location.origin}/track/${complaintId}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-slide-in-up">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="48" height="48" className="text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Complaint Submitted!
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Your complaint has been successfully submitted and is now pending review.
                    </p>

                    {/* Complaint ID */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <p className="text-sm text-gray-600 mb-2">Your Complaint ID</p>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-3xl font-bold text-gray-900 font-mono">
                                #{shortId(complaintId)}
                            </p>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Copy ID"
                            >
                                {copied ? (
                                    <svg width="20" height="20" className="text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" className="text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Save this ID to track your complaint</p>
                    </div>

                    {/* Email Confirmation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <div className="flex items-start gap-3">
                            <svg width="20" height="20" className="text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <div className="text-left">
                                <p className="text-sm font-medium text-blue-900">Confirmation Email Sent</p>
                                <p className="text-sm text-blue-700">Check your inbox for the tracking link and complaint details</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link href={`/track/${complaintId}`}>
                            <Button size="lg" className="w-full">
                                Track Your Complaint →
                            </Button>
                        </Link>
                        <Link href="/submit">
                            <Button variant="outline" size="lg" className="w-full">
                                Submit Another Complaint
                            </Button>
                        </Link>
                    </div>

                    {/* Expected Response Time */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            <strong>Expected Response Time:</strong> 24-48 hours
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            You'll receive email updates when the status changes
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
