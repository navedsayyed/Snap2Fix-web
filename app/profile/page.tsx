'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getUserComplaints, getUserProfile } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ComplaintStatus, UserRole } from '@/lib/types';

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

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    role: UserRole;
    department: string | null;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(''); // Clear any previous errors

            const currentUser = await getCurrentUser();

            if (!currentUser) {
                router.push('/login');
                return;
            }

            setUser(currentUser);

            // Get user profile with role from database
            const { data: profileData, error: profileError } = await getUserProfile(currentUser.id);

            if (profileError) {
                console.error('Error loading profile:', profileError);
                // If user doesn't exist in users table, treat as regular user
                setUserProfile({
                    id: currentUser.id,
                    email: currentUser.email || '',
                    full_name: currentUser.user_metadata?.name || currentUser.email || 'User',
                    phone: null,
                    role: 'user',
                    department: null
                });
            } else {
                setUserProfile(profileData);
            }

            // Load user's complaints
            const { data, error } = await getUserComplaints(currentUser.id);

            if (error) {
                console.error('Error loading complaints:', error);
                // Don't throw, just set empty complaints
                setComplaints([]);
            } else {
                console.log('Loaded complaints:', data);
                if (data && data.length > 0) {
                    console.log('First complaint ID:', data[0].id, 'Type:', typeof data[0].id);
                }
                setComplaints(data || []);
            }
        } catch (err: any) {
            console.error('Error loading user data:', err);

            // Handle auth session missing error
            if (err.message?.includes('Auth session missing') || err.message?.includes('session')) {
                router.push('/login');
            } else {
                setError(err.message || 'Failed to load profile');
            }
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

    const openSignOutModal = () => {
        setShowSignOutModal(true);
    };

    const closeSignOutModal = () => {
        setShowSignOutModal(false);
    };

    const confirmSignOut = () => {
        setShowSignOutModal(false);
        handleSignOut();
    };

    const handleSubmitClick = () => {
        router.push('/scan-qr');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] dotted-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto"></div>
                    <p className="mt-4 text-[#B0B0B0]">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-[#121212] dotted-background flex items-center justify-center p-4">
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

    // Check if user is admin, technician, or superadmin - they should use mobile app
    if (userProfile && userProfile.role !== 'user') {
        const roleDisplayNames = {
            'admin': 'Administrator',
            'super_admin': 'Super Administrator',
            'technician': 'Technician'
        };

        return (
            <div className="min-h-screen bg-[#121212] dotted-background flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-[#404040]/50 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="mb-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#00BFFF]/20">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Mobile App Required
                        </h2>

                        {/* Role Badge */}
                        <div className="inline-block px-3 py-1.5 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-full">
                            <p className="text-[#00BFFF] text-xs font-semibold">
                                {roleDisplayNames[userProfile.role as keyof typeof roleDisplayNames]} Account
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6 space-y-2">
                        <p className="text-[#E0E0E0] text-sm leading-relaxed">
                            Your account type requires the use of our dedicated mobile application to access advanced features and manage complaints efficiently.
                        </p>
                        <p className="text-[#B0B0B0] text-xs">
                            This web interface is designed for end-user complaint submissions only.
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-[#2C2C2C]/50 border border-[#404040]/30 rounded-lg p-3 mb-6">
                        <p className="text-[#9CA3AF] text-xs flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-[#00BFFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Contact IT support if you need assistance</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <button
                            onClick={openSignOutModal}
                            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 text-sm"
                        >
                            Sign Out
                        </button>
                        <Link href="/" className="block">
                            <button className="w-full bg-transparent border-2 border-[#404040] hover:border-[#00BFFF]/50 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:bg-[#2C2C2C] text-sm">
                                Back to Home
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Sign Out Modal */}
                {showSignOutModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={closeSignOutModal}
                        ></div>

                        {/* Modal */}
                        <div className="relative bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border-2 border-[#333333] rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl animate-scaleIn">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/30">
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white text-center mb-2">
                                Sign Out?
                            </h3>

                            {/* Message */}
                            <p className="text-[#B0B0B0] text-center mb-5 text-sm leading-relaxed">
                                Are you sure you want to sign out? You'll need to log in again to access your account.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-2.5">
                                {/* Cancel Button */}
                                <button
                                    onClick={closeSignOutModal}
                                    className="flex-1 px-4 py-2.5 bg-[#2C2C2C] hover:bg-[#353535] border-2 border-[#404040] hover:border-[#505050] text-white rounded-xl transition-all duration-300 font-semibold text-sm"
                                >
                                    Cancel
                                </button>

                                {/* Confirm Button */}
                                <button
                                    onClick={confirmSignOut}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-semibold text-sm"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] dotted-background">
            {/* Header */}
            <header className="sticky top-0 z-50 pt-4 pb-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
                        <div className="flex items-center justify-between h-10">
                            {/* Back Button and Profile Text */}
                            <div className="flex items-center gap-3">
                                <Link href="/" className="p-2 hover:bg-[#2C2C2C] rounded-full transition-colors">
                                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h2 className="text-xl font-bold text-white">Profile</h2>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden lg:flex items-center gap-3">
                                <button
                                    onClick={handleSubmitClick}
                                    className="px-7 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30"
                                >
                                    SUBMIT COMPLAINT
                                </button>

                                {/* Profile Menu Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 text-gray-300 hover:text-white transition-colors"
                                        aria-label="Profile menu"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-[#1E1E1E] border border-[#404040] rounded-xl overflow-hidden z-50">
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
                                                        openSignOutModal();
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#2C2C2C] transition-colors flex items-center gap-3 text-[#F44336]"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 mx-6">
                        <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl px-6 py-8 space-y-6 animate-slide-in-down">
                            {/* Mobile Profile Menu Items */}
                            <div className="space-y-4">
                                <Link
                                    href="/account-settings"
                                    className="block text-base font-medium text-gray-300 hover:text-white transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Account Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        document.getElementById('my-complaints')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="block w-full text-left text-base font-medium text-gray-300 hover:text-white transition-colors"
                                >
                                    My Complaints
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openSignOutModal();
                                    }}
                                    className="block w-full text-left text-base font-medium text-[#F44336] hover:text-[#FF5252] transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    handleSubmitClick();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full px-8 py-3 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30"
                            >
                                SUBMIT COMPLAINT
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Complaints List with Enhanced Design */}
                <div id="my-complaints" className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-3xl p-4 sm:p-6 lg:p-10 hover:border-[#00BFFF]/40 transition-all duration-500">

                    {/* Tab System - In Progress / Completed */}
                    <div className="flex gap-2 mb-6 bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A] max-w-md mx-auto">
                        <button
                            onClick={() => setActiveTab('in-progress')}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${activeTab === 'in-progress'
                                ? 'bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white'
                                : 'text-[#777777] hover:text-[#CCCCCC] hover:bg-[#252525]'
                                }`}
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>In Progress</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${activeTab === 'completed'
                                ? 'bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white'
                                : 'text-[#777777] hover:text-[#CCCCCC] hover:bg-[#252525]'
                                }`}
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Completed</span>
                        </button>
                    </div>

                    {complaints.filter(c => activeTab === 'in-progress' ? c.status.toLowerCase() !== 'completed' : c.status.toLowerCase() === 'completed').length === 0 ? (
                        <div className="text-center py-16 bg-[#2C2C2C] border border-[#404040] rounded-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF]/20 to-[#0099CC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-[#B0B0B0] text-lg mb-6">No {activeTab === 'in-progress' ? 'in-progress' : 'completed'} complaints yet</p>
                            {/* {activeTab === 'in-progress' && (
                                <Link href="/scan-qr">
                                    <button className="px-8 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl hover:scale-105 transition-all duration-300 font-semibold inline-flex items-center gap-2">
                                        Submit Your First Complaint
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </Link>
                            )} */}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {complaints
                                .filter(c => activeTab === 'in-progress' ? c.status.toLowerCase() !== 'completed' : c.status.toLowerCase() === 'completed')
                                .map((complaint) => (
                                    <Link
                                        key={complaint.id}
                                        href={`/track/${complaint.id}`}
                                        className="block border border-[#404040] bg-[#2C2C2C] rounded-2xl p-5 hover:border-[#00BFFF] transition-all duration-300"
                                    >
                                        {/* Header with Location Title and Status Badge */}
                                        <div className="flex justify-between items-start gap-3 mb-3">
                                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                                <div className="w-2 h-2 rounded-full bg-[#00BFFF] mt-1.5 flex-shrink-0"></div>
                                                <h3 className="font-bold text-white text-[17px] leading-6">
                                                    {complaint.floor} - Room {complaint.room_number}
                                                </h3>
                                            </div>
                                            {complaint.status.toLowerCase() === 'completed' ? (
                                                <span className="flex-shrink-0 px-3 py-1.5 bg-green-500 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.3px]">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="flex-shrink-0 px-3 py-1.5 bg-orange-400 text-white rounded-full text-[11px] font-bold uppercase tracking-[0.3px]">
                                                    In Progress
                                                </span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-white text-sm leading-[22px] mb-4">
                                            {complaint.description}
                                        </p>

                                        {/* Date with Calendar Icon */}
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <svg className="w-4 h-4 flex-shrink-0 text-[#B0B0B0]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[#B0B0B0] text-[13px] leading-[18px]">
                                                {new Date(complaint.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Priority Badge */}
                                        <div className="flex justify-end">
                                            <span className={`text-[13px] font-semibold px-3 py-1 rounded-lg ${complaint.priority === 'High' ? 'text-red-400 bg-red-500/10' :
                                                complaint.priority === 'Medium' ? 'text-green-400 bg-green-500/10' :
                                                    'text-blue-400 bg-blue-500/10'
                                                }`}>
                                                {complaint.priority} Priority
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Sign Out Confirmation Modal */}
            {showSignOutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeSignOutModal}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border-2 border-[#333333] rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl animate-scaleIn">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500/30">
                            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white text-center mb-2">
                            Sign Out?
                        </h3>

                        {/* Message */}
                        <p className="text-[#B0B0B0] text-center mb-5 text-sm leading-relaxed">
                            Are you sure you want to sign out? You'll need to log in again to access your account.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-2.5">
                            {/* Cancel Button */}
                            <button
                                onClick={closeSignOutModal}
                                className="flex-1 px-4 py-2.5 bg-[#2C2C2C] hover:bg-[#353535] border-2 border-[#404040] hover:border-[#505050] text-white rounded-xl transition-all duration-300 font-semibold text-sm"
                            >
                                Cancel
                            </button>

                            {/* Confirm Button */}
                            <button
                                onClick={confirmSignOut}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 font-semibold text-sm"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
