'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { supabase, getUserProfile } from '@/lib/supabase';

export default function AccountSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        memberSince: '',
        status: 'Active'
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }
            setUser(currentUser);
            
            // Fetch profile from users table
            const { data: profileData, error: profileError } = await getUserProfile(currentUser.id);
            
            if (profileData) {
                setFormData({
                    name: profileData.full_name || '',
                    email: profileData.email || currentUser.email || '',
                    phone: profileData.phone || '',
                    memberSince: currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '',
                    status: 'Active'
                });
            } else {
                // Fallback to auth metadata
                setFormData({
                    name: currentUser.user_metadata?.name || '',
                    email: currentUser.email || '',
                    phone: currentUser.user_metadata?.phone || '',
                    memberSince: currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : '',
                    status: 'Active'
                });
            }
        } catch (error) {
            console.error('Auth check error:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Update in users table
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    full_name: formData.name,
                    phone: formData.phone 
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Also update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { name: formData.name, phone: formData.phone }
            });

            if (authError) throw authError;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Refresh user data
            await checkAuth();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212]">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#1E1E1E] via-[#252525] to-[#1E1E1E] border-b border-[#333333] shadow-2xl">
                <div className="h-16 sm:h-20">
                    <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-full flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00BFFF]/50">
                                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-[#E0E0E0] to-[#B0B0B0] bg-clip-text text-transparent">
                                        Account Settings
                                    </h1>
                                    <p className="text-xs text-[#B0B0B0] hidden sm:block">Manage your profile</p>
                                </div>
                            </div>

                            <Link 
                                href="/profile"
                                className="px-4 py-2 text-[#B0B0B0] hover:text-white transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="hidden sm:inline">Back to Profile</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
                <div className="bg-gradient-to-br from-[#1E1E1E] via-[#252525] to-[#1A1A1A] border border-[#333333] rounded-3xl shadow-2xl p-6 sm:p-10">
                    {/* Current Information Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Current Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5">
                                <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Current Name
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {formData.name || 'Not set'}
                                </p>
                            </div>
                            <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5">
                                <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Email Address
                                </p>
                                <p className="text-lg font-semibold text-white break-all">{formData.email}</p>
                            </div>
                            <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5">
                                <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Phone Number
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {formData.phone || 'Not set'}
                                </p>
                            </div>
                            <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5">
                                <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Member Since
                                </p>
                                <p className="text-lg font-semibold text-white">
                                    {formData.memberSince}
                                </p>
                            </div>
                            <div className="bg-[#2C2C2C] border border-[#404040] rounded-2xl p-5">
                                <p className="text-sm text-[#B0B0B0] mb-1 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    Account Status
                                </p>
                                <p className="text-lg font-semibold text-[#00FF00]">{formData.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Information Section */}
                    <div className="border-t border-[#404040] pt-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Information
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-[#E0E0E0] mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-xl text-white placeholder-[#808080] focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-[#E0E0E0] mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-xl text-white placeholder-[#808080] focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/20 transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Message */}
                            {message.text && (
                                <div className={`p-4 rounded-xl ${
                                    message.type === 'success' 
                                        ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
