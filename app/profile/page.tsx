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
    const [showMenu, setShowMenu] = useState(false);

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
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-xl flex items-center justify-center shadow-lg shadow-[#00BFFF]/40 border border-[#00BFFF]/20">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">My Dashboard</h1>
                                <p className="text-[#00BFFF] text-xs sm:text-sm font-semibold hidden sm:block">Manage complaints & account</p>
                            </div>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <Link href="/">
                                <button className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#2C2C2C] hover:bg-[#333333] text-white rounded-xl border border-[#404040] hover:border-[#00BFFF]/50 transition-all duration-300 text-sm sm:text-base font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="hidden sm:inline">Home</span>
                                </button>
                            </Link>
                            
                            {/* Menu Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 transition-all duration-300 text-sm sm:text-base font-semibold hover:scale-105 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <span className="hidden sm:inline">Menu</span>
                                </button>

                                {/* Dropdown Menu */}
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#1E1E1E] border border-[#404040] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                                        <div className="py-2">
                                            {/* Profile Info */}
                                            <div className="px-4 py-3 border-b border-[#404040]">
                                                <p className="text-xs text-[#B0B0B0] mb-1">Signed in as</p>
                                                <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                                            </div>
                                            
                                            {/* Account Settings */}
                                            <Link 
                                                href="/account-settings"
                                                onClick={() => setShowMenu(false)}
                                                className="w-full px-4 py-3 text-left hover:bg-[#2C2C2C] transition-colors flex items-center gap-3 text-white"
                                            >
                                                <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm font-medium">Account Settings</span>
                                            </Link>

                                            {/* My Complaints */}
                                            <button 
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    document.getElementById('my-complaints')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-[#2C2C2C] transition-colors flex items-center gap-3 text-white"
                                            >
                                                <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <span className="text-sm font-medium">My Complaints</span>
                                            </button>

                                            {/* Stats */}
                                            <div className="px-4 py-3 border-t border-[#404040] bg-[#252525]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-[#B0B0B0]">Total Complaints</span>
                                                    <span className="text-sm font-bold text-[#00BFFF]">{complaints.length}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[#B0B0B0]">Member Since</span>
                                                    <span className="text-xs font-semibold text-white">{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            {/* Sign Out */}
                                            <button 
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    handleSignOut();
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-[#F44336]/10 transition-colors flex items-center gap-3 text-[#F44336] border-t border-[#404040]"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span className="text-sm font-semibold">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Top Padding for Fixed Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Complaints List with Enhanced Design */}
                <div id="my-complaints" className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-10 hover:border-[#00BFFF]/40 transition-all duration-500 hover:shadow-[#00BFFF]/20">
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-8">
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
