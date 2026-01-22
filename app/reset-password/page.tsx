'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // Automatically use the correct redirect URL
            const redirectUrl = typeof window !== 'undefined' 
                ? `${window.location.origin}/update-password`
                : 'https://snap2fix.vercel.app/update-password';
                
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) throw error;

            setMessage('Password reset link has been sent to your email!');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-6">
                    <img src="/main-logo.svg" alt="Snap2Fix Logo" className="w-16 h-16 object-contain mx-auto mb-3" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">Snap2Fix</h1>
                    <p className="text-sm text-[#00BFFF] font-semibold">Professional Issue Management</p>
                </div>

                {/* Reset Password Card */}
                <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#404040]">
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Reset Password</h2>
                        <p className="text-sm text-gray-400">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-[#F44336]/10 border border-[#F44336]/50 text-[#F44336] px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="w-full py-3 px-4 bg-[#2C2C2C] hover:bg-[#363636] text-white font-semibold rounded-lg transition-all duration-300 border border-[#404040]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
