'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getUserComplaints } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ComplaintStatus } from '@/lib/types';

interface Complaint {
    id: string;
    issue_type: string;
    priority: string;
    status: ComplaintStatus;
    floor: string;
    room_number: string;
    description: string;
    created_at: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            
            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);

            // Load user's complaints
            const { data, error } = await getUserComplaints(currentUser.id);
            
            if (error) throw error;
            console.log('Loaded complaints:', data);
            if (data && data.length > 0) {
                console.log('First complaint ID:', data[0].id, 'Type:', typeof data[0].id);
            }
            setComplaints(data || []);
        } catch (err: any) {
            console.error('Error loading user data:', err);
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign out');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto"></div>
                    <p className="mt-4 text-[#B0B0B0]">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
                <div className="bg-[#1E1E1E] border border-[#404040] rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                        <p className="text-[#F44336] mb-6">{error}</p>
                        <Link href="/login">
                            <Button>Go to Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Header with Glassmorphism */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">My Profile</h1>
                                <p className="text-[#B0B0B0] text-sm hidden sm:block">Manage your complaints and account</p>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <Link href="/">
                                <button className="px-4 py-2 bg-[#2C2C2C] hover:bg-[#333333] text-white rounded-xl border border-[#404040] hover:border-[#00BFFF]/50 transition-all duration-300 text-sm sm:text-base font-medium">
                                    Home
                                </button>
                            </Link>
                            <button 
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 transition-all duration-300 text-sm sm:text-base font-semibold"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Top Padding for Fixed Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* User Info Card with Enhanced Design */}
                <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Account Information</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-4 hover:border-[#00BFFF]/50 transition-all duration-300">
                            <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Name
                            </p>
                            <p className="text-lg font-semibold text-white">
                                {user?.user_metadata?.name || 'N/A'}
                            </p>
                        </div>
                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-4 hover:border-[#00BFFF]/50 transition-all duration-300">
                            <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Email
                            </p>
                            <p className="text-lg font-semibold text-white break-all">{user?.email}</p>
                        </div>
                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-4 hover:border-[#00BFFF]/50 transition-all duration-300">
                            <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Member Since
                            </p>
                            <p className="text-lg font-semibold text-white">
                                {new Date(user?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-4 hover:border-[#00BFFF]/50 transition-all duration-300">
                            <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                Total Complaints
                            </p>
                            <p className="text-lg font-semibold text-white">{complaints.length}</p>
                        </div>
                    </div>
                </div>

                {/* Complaints List with Enhanced Design */}
                <div className="bg-[#1E1E1E] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-8 hover:border-[#00BFFF]/30 transition-all duration-500">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">My Complaints</h2>
                        </div>
                        <Link href="/submit">
                            <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Submit New Complaint
                            </button>
                        </Link>
                    </div>

                    {complaints.length === 0 ? (
                        <div className="text-center py-16 bg-[#2C2C2C] border border-[#404040] rounded-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF]/20 to-[#0099CC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-[#B0B0B0] text-lg mb-6">No complaints submitted yet</p>
                            <Link href="/submit">
                                <button className="px-8 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 hover:scale-105 transition-all duration-300 font-semibold inline-flex items-center gap-2">
                                    Submit Your First Complaint
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {complaints.map((complaint) => (
                                <Link
                                    key={complaint.id}
                                    href={`/track/${complaint.id}`}
                                    className="block border border-[#404040] bg-[#2C2C2C] rounded-2xl p-5 hover:border-[#00BFFF] hover:shadow-lg hover:shadow-[#00BFFF]/20 hover:scale-[1.02] transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC]"></div>
                                                <h3 className="font-bold text-white text-lg group-hover:text-[#00BFFF] transition-colors">
                                                    {complaint.issue_type}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-[#B0B0B0] flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {complaint.floor} - Room {complaint.room_number}
                                            </p>
                                        </div>
                                        <StatusBadge status={complaint.status} />
                                    </div>
                                    <p className="text-[#B0B0B0] text-sm mb-3 line-clamp-2 pl-4">
                                        {complaint.description}
                                    </p>
                                    <div className="flex justify-between items-center text-sm pt-3 border-t border-[#404040]">
                                        <span className="text-[#B0B0B0] flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {new Date(complaint.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`font-semibold px-3 py-1 rounded-lg ${
                                            complaint.priority === 'High' ? 'text-red-400 bg-red-500/10' :
                                            complaint.priority === 'Medium' ? 'text-orange-400 bg-orange-500/10' :
                                            'text-green-400 bg-green-500/10'
                                        }`}>
                                            {complaint.priority} Priority
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
