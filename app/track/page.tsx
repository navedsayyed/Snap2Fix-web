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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!complaintId.trim()) {
            setError('Please enter a complaint ID');
            return;
        }

        // Clean the ID (remove # and spaces)
        const cleanId = complaintId.trim().replace(/^#/, '').replace(/\s/g, '');

        // Basic validation - check if it looks like a UUID or short ID
        if (cleanId.length < 8) {
            setError('Please enter a valid complaint ID');
            return;
        }

        // If it's a short ID (8 chars), we'll need to handle it differently
        // For now, assume full UUID or redirect to search
        router.push(`/track/${cleanId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" className="text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Track Your Complaint</h1>
                    <p className="text-lg text-gray-600">
                        Enter your complaint ID to check the current status and progress
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Complaint ID"
                            required
                            value={complaintId}
                            onChange={(e) => setComplaintId(e.target.value)}
                            error={error}
                            placeholder="e.g., #ABC12345 or full ID"
                            helperText="You can find this in your confirmation email"
                        />

                        <Button type="submit" size="lg" className="w-full">
                            Track Complaint →
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Where to find your ID?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <svg width="20" height="20" className="text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Check the confirmation email sent after submission</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="20" height="20" className="text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Click the tracking link in your email</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg width="20" height="20" className="text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>It was shown on the success page after submission</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Don't have a complaint ID yet?</p>
                    <Link href="/submit">
                        <Button variant="outline">Submit a New Complaint</Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
