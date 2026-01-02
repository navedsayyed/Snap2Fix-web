'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(formData.email, formData.password);
            router.push('/profile');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 overflow-hidden">
            <div className={`w-full max-w-md transition-all duration-500 ease-out ${isInputFocused ? '-translate-y-8 sm:translate-y-0' : 'translate-y-0'}`}>
                {/* Logo and Title */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl shadow-[#00BFFF]/60 border border-[#00BFFF]/20">
                        <svg width="32" height="32" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">Smart Maintenance</h1>
                    <p className="text-sm sm:text-base text-[#00BFFF] font-semibold">Professional Issue Management</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#1E1E1E] rounded-2xl shadow-xl p-6 sm:p-8 border border-[#404040]">
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Welcome Back</h2>
                        <p className="text-sm text-gray-400">Sign in to continue</p>
                    </div>

                {error && (
                    <div className="bg-[#F44336]/10 border border-[#F44336]/50 text-[#F44336] px-4 py-3 rounded-lg mb-5 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 pr-12 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-[#00BFFF]/40 hover:shadow-[#00BFFF]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-5 sm:mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#00BFFF] hover:text-[#0099CC] font-semibold transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>

                <div className="mt-3 sm:mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to home
                    </Link>
                </div>
            </div>
            </div>
        </div>
    );
}
