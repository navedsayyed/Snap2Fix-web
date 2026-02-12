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
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const openImageViewer = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setShowImageViewer(true);
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
            <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <svg width="20" height="20" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:inline">Back</span>
                        </button>
                        <h1 className="text-xl font-bold text-white flex-1">Complaint Details</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Title Card */}
                <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex-1">{complaint.title}</h2>
                        {complaint.status.toLowerCase() === 'completed' ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] rounded-full flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-white text-sm font-bold">Completed</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#00BFFF] rounded-full flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-white text-sm font-bold">In Progress</span>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="space-y-4 mt-6">
                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-xs text-[#B0B0B0] mb-1">Location</p>
                                <p className="text-base text-white font-medium">Floor {complaint.floor} - Room {complaint.room_number}</p>
                                <p className="text-sm text-[#B0B0B0]">{complaint.department}</p>
                            </div>
                        </div>

                        {/* Submitted Date */}
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-xs text-[#B0B0B0] mb-1">Submitted Date</p>
                                <p className="text-base text-white font-medium">{formatDateTime(complaint.created_at)}</p>
                            </div>
                        </div>

                        {/* Completed Date */}
                        {complaint.completed_at && (
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-[#4CAF50] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-xs text-[#B0B0B0] mb-1">Completed Date</p>
                                    <p className="text-base text-white font-medium">{formatDateTime(complaint.completed_at)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                    <p className="text-[#E0E0E0] leading-relaxed text-base">{complaint.description}</p>
                </div>

                {/* Photos Section */}
                {complaint && (complaint.status as string) === 'completed' && (complaint.image_url || complaint.proof_image) ? (
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Before & After Photos</h3>
                                <p className="text-sm text-[#4CAF50] font-medium">Your complaint has been resolved!</p>
                            </div>
                        </div>

                        <div className="space-y-8 mt-6">
                            {/* User's Original Photo */}
                            {complaint.image_url && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#404040]">
                                        <span className="text-xl">📷</span>
                                        <h4 className="text-base font-bold text-white">Before (Your Photo)</h4>
                                    </div>
                                    <button
                                        onClick={() => openImageViewer(complaint.image_url!)}
                                        className="w-full group relative overflow-hidden rounded-xl"
                                    >
                                        <img
                                            src={complaint.image_url || ''}
                                            alt="Original complaint"
                                            className="w-full h-80 object-cover rounded-xl border border-[#404040] transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </button>
                                    <p className="text-sm text-[#B0B0B0] text-center italic mt-2">Original complaint photo you submitted</p>
                                </div>
                            )}

                            {/* Technician's Completion Photo */}
                            {complaint.proof_image && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#4CAF50]">
                                        <span className="text-xl">✅</span>
                                        <h4 className="text-base font-bold text-white">After (Completed Work)</h4>
                                    </div>
                                    <button
                                        onClick={() => openImageViewer(complaint.proof_image!)}
                                        className="w-full group relative overflow-hidden rounded-xl"
                                    >
                                        <img
                                            src={complaint.proof_image || ''}
                                            alt="Completed work"
                                            className="w-full h-80 object-cover rounded-xl border border-[#404040] transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </button>
                                    <p className="text-sm text-[#B0B0B0] text-center italic mt-2">Work completion photo from technician</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : complaint && complaint.image_url && (
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <h3 className="text-xl font-bold text-white mb-4">Complaint Photo</h3>
                        <button
                            onClick={() => openImageViewer(complaint.image_url!)}
                            className="w-full group relative overflow-hidden rounded-xl"
                        >
                            <img
                                src={complaint.image_url || ''}
                                alt="Complaint"
                                className="w-full h-96 object-cover rounded-xl border border-[#404040] transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </button>
                    </div>
                )}

                {/* Technician's Notes */}
                {complaint && (complaint.status as string) === 'completed' && complaint.completed_notes && (
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <h3 className="text-xl font-bold text-white mb-4">Technician's Notes</h3>
                        <div className="bg-[#121212] border-l-4 border-[#4CAF50] rounded-lg p-5">
                            <p className="text-[#E0E0E0] text-base leading-relaxed italic">{complaint?.completed_notes}</p>
                        </div>
                    </div>
                )}

                {/* Work In Progress Notice */}
                {complaint && (complaint.status as string) === 'in-progress' && (
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <div className="bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-xl p-8 text-center">
                            <div className="w-16 h-16 bg-[#00BFFF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Work In Progress</h4>
                            <p className="text-[#B0B0B0] leading-relaxed">
                                Your complaint is being worked on by our technician team.
                                You'll be able to see the completion photos once the work is done.
                            </p>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                {complaint && complaint.timeline && complaint.timeline.length > 0 && (
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <h3 className="text-xl font-bold text-white mb-6">Progress Timeline</h3>
                        <Timeline events={complaint.timeline} />
                    </div>
                )}

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Priority */}
                    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                        <h4 className="text-base font-bold text-white mb-3">Priority</h4>
                        <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold ${complaint.priority === 'High'
                                ? 'bg-[#F44336]/20 text-[#F44336] border border-[#F44336]/30'
                                : complaint.priority === 'Medium'
                                    ? 'bg-[#FF9800]/20 text-[#FF9800] border border-[#FF9800]/30'
                                    : 'bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30'
                            }`}>
                            {complaint.priority}
                        </span>
                    </div>

                    {/* Technician Info */}
                    {complaint.technician && (
                        <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-2xl shadow-2xl p-6 hover:border-[#00BFFF]/30 transition-all duration-500">
                            <h4 className="text-base font-bold text-white mb-3">Assigned To</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#00BFFF]/20 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{complaint.technician.name}</p>
                                    <p className="text-xs text-[#B0B0B0]">{complaint.technician.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Full Screen Image Viewer Modal */}
                {showImageViewer && selectedImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setShowImageViewer(false)}
                    >
                        <button
                            onClick={() => setShowImageViewer(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <p className="absolute bottom-4 text-white text-sm opacity-70">Click outside or press X to close</p>
                    </div>
                )}
            </main>
        </div>
    );
}
