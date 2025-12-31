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
            console.log('Fetching complaint with ID:', complaintId, 'Type:', typeof complaintId);
            const response = await fetch(`/api/complaint/${complaintId}`);
            const data = await response.json();

            console.log('API Response:', data);
            console.log('Image URL:', data.complaint?.image_url);
            console.log('Proof Image:', data.complaint?.proof_image);
            
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
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto mb-4"></div>
                    <p className="text-[#B0B0B0]">Loading complaint details...</p>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#1E1E1E] border border-[#404040] rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-[#2C2C2C] border border-[#F44336] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" className="text-[#F44336]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Complaint Not Found</h2>
                    <p className="text-[#B0B0B0] mb-6">{error || 'The complaint ID you entered could not be found.'}</p>
                    <Link href="/track">
                        <button className="px-6 py-2.5 bg-[#00BFFF] text-white rounded-lg hover:bg-[#1E90FF] transition-colors">
                            Try Again
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Header */}
            <header className="bg-[#1E1E1E] shadow-sm border-b border-[#404040]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#1E90FF] rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold text-white">Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <p className="text-sm text-[#B0B0B0] mb-1">Complaint ID</p>
                            <h1 className="text-3xl font-bold text-white font-mono">
                                #{shortId(complaint.id)}
                            </h1>
                        </div>
                        <StatusBadge status={complaint.status as ComplaintStatus} size="lg" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{complaint.title}</h2>
                    <p className="text-[#B0B0B0]">Submitted on {formatDateTime(complaint.created_at)}</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-[#1E1E1E] border border-[#404040] rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                            <p className="text-[#B0B0B0] leading-relaxed">{complaint.description}</p>
                        </div>

                        {/* Photos Section - Enhanced */}
                        {(complaint.status as string) === 'completed' && (complaint.image_url || complaint.proof_image) ? (
                            <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Before & After Photos</h3>
                                        <p className="text-sm text-[#4CAF50] font-medium">Your complaint has been resolved!</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-8 mt-6">
                                    {/* User's Original Photo */}
                                    {complaint.image_url && (
                                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5 hover:border-[#00BFFF]/50 transition-all duration-300">
                                            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#404040]">
                                                <span className="text-2xl">📷</span>
                                                <h4 className="text-lg font-bold text-white">Before (Your Photo)</h4>
                                            </div>
                                            <img
                                                src={complaint.image_url}
                                                alt="Original complaint"
                                                className="w-full h-80 object-cover rounded-xl border border-[#404040] mb-3"
                                            />
                                            <p className="text-sm text-[#B0B0B0] text-center italic">Original complaint photo you submitted</p>
                                        </div>
                                    )}

                                    {/* Technician's Completion Photo */}
                                    {complaint.proof_image && (
                                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5 hover:border-[#4CAF50]/50 transition-all duration-300">
                                            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#4CAF50]">
                                                <span className="text-2xl">✅</span>
                                                <h4 className="text-lg font-bold text-white">After (Completed Work)</h4>
                                            </div>
                                            <img
                                                src={complaint.proof_image}
                                                alt="Completed work"
                                                className="w-full h-80 object-cover rounded-xl border border-[#404040] mb-3"
                                            />
                                            <p className="text-sm text-[#B0B0B0] text-center italic">Work completion photo from technician</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : complaint.image_url && (
                            <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Complaint Photo</h3>
                                </div>
                                <img
                                    src={complaint.image_url}
                                    alt="Complaint"
                                    className="w-full h-96 object-cover rounded-2xl border border-[#404040]"
                                />
                            </div>
                        )}

                        {/* Technician's Notes */}
                        {(complaint.status as string) === 'completed' && complaint.completed_notes && (
                            <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Technician's Notes</h3>
                                </div>
                                <div className="bg-[#2C2C2C] border-l-4 border-[#4CAF50] rounded-xl p-5">
                                    <p className="text-white text-base leading-relaxed italic">{complaint.completed_notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Work In Progress Notice */}
                        {(complaint.status as string) === 'in-progress' && (
                            <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                                <div className="bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-2xl p-8 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF]/20 to-[#0099CC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-3">Work In Progress</h4>
                                    <p className="text-[#B0B0B0] leading-relaxed">
                                        Your complaint is being worked on by our technician team. 
                                        You'll be able to see the completion photos once the work is done.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Progress Timeline</h3>
                            </div>
                            <Timeline events={complaint.timeline} />
                        </div>
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* Location Info */}
                        <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Location</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-[#B0B0B0]">Floor</p>
                                    <p className="text-base font-medium text-white">{complaint.floor}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#B0B0B0]">Room</p>
                                    <p className="text-base font-medium text-white">{complaint.room_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-[#B0B0B0]">Department</p>
                                    <p className="text-base font-medium text-white">{complaint.department}</p>
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Priority</h3>
                            </div>
                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-bold ${complaint.priority === 'High'
                                ? 'bg-[#F44336]/20 text-[#F44336]'
                                : complaint.priority === 'Medium'
                                    ? 'bg-[#FF9800]/20 text-[#FF9800]'
                                    : 'bg-[#4CAF50]/20 text-[#4CAF50]'
                                }`}>
                                {complaint.priority}
                            </span>
                        </div>

                        {/* Technician Info */}
                        {complaint.technician && (
                            <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Assigned To</h3>
                                </div>
                                <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF]/30 to-[#0099CC]/30 rounded-xl flex items-center justify-center">
                                        <svg width="24" height="24" className="text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{complaint.technician.name}</p>
                                        <p className="text-sm text-[#B0B0B0]">{complaint.technician.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Real-time Updates Notice */}
                        <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/50 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-[#4CAF50] rounded-full mt-1.5 animate-pulse"></div>
                                <div>
                                    <p className="text-sm font-medium text-[#4CAF50]">Live Updates</p>
                                    <p className="text-xs text-[#B0B0B0]">This page updates automatically when status changes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
