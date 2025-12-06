/**
 * Individual Complaint Tracking Page
 * Shows complaint details with real-time status updates
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Timeline } from '@/components/ui/Timeline';
import { subscribeToComplaint } from '@/lib/supabase';
import { ComplaintWithDetails, ComplaintStatus } from '@/lib/types';
import { shortId, formatDateTime } from '@/lib/utils';

export default function TrackComplaintPage() {
    const params = useParams();
    const router = useRouter();
    const complaintId = params.id as string;

    const [complaint, setComplaint] = useState<ComplaintWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchComplaint();

        // Subscribe to real-time updates
        const channel = subscribeToComplaint(complaintId, (payload) => {
            console.log('Real-time update:', payload);
            // Refetch complaint data when updated
            fetchComplaint();
        });

        return () => {
            channel.unsubscribe();
        };
    }, [complaintId]);

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/complaint/${complaintId}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to fetch complaint');
            }

            setComplaint(data.complaint);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load complaint');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading complaint details...</p>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" className="text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The complaint ID you entered could not be found.'}</p>
                    <Link href="/track">
                        <button className="px-6 py-2.5 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">
                            Try Again
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Complaint ID</p>
                            <h1 className="text-3xl font-bold text-gray-900 font-mono">
                                #{shortId(complaint.id)}
                            </h1>
                        </div>
                        <StatusBadge status={complaint.status as ComplaintStatus} size="lg" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{complaint.title}</h2>
                    <p className="text-gray-600">Submitted on {formatDateTime(complaint.created_at)}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                        </div>

                        {/* Images */}
                        {(complaint.image_url || complaint.proof_image) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {complaint.image_url && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Original Issue</p>
                                            <img
                                                src={complaint.image_url}
                                                alt="Complaint"
                                                className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}
                                    {complaint.proof_image && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Completed Work</p>
                                            <img
                                                src={complaint.proof_image}
                                                alt="Proof"
                                                className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Timeline</h3>
                            <Timeline events={complaint.timeline} />
                        </div>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* Location Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Floor</p>
                                    <p className="text-base font-medium text-gray-900">{complaint.floor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Room</p>
                                    <p className="text-base font-medium text-gray-900">{complaint.room_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="text-base font-medium text-gray-900">{complaint.department}</p>
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${complaint.priority === 'High'
                                ? 'bg-red-100 text-red-800'
                                : complaint.priority === 'Medium'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {complaint.priority}
                            </span>
                        </div>

                        {/* Technician Info */}
                        {complaint.technician && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned To</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg width="24" height="24" className="text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{complaint.technician.name}</p>
                                        <p className="text-sm text-gray-500">{complaint.technician.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Real-time Updates Notice */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-green-900">Live Updates</p>
                                    <p className="text-xs text-green-700">This page updates automatically when status changes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
