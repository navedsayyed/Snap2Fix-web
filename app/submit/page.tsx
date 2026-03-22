/**
 * Submit Complaint Page - with Email OTP Verification
 */

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GroupedSelect } from '@/components/ui/GroupedSelect';
import { FileUpload } from '@/components/ui/FileUpload';
import { COMPLAINT_TYPES, getComplaintTypesByCategory } from '@/lib/complaintTypes';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({
    message,
    type,
    onDismiss,
}: {
    message: string;
    type: 'success' | 'error' | 'info';
    onDismiss: () => void;
}) {
    const bg =
        type === 'success'
            ? 'bg-green-900/90 border-green-500/50'
            : type === 'error'
            ? 'bg-red-900/90 border-red-500/50'
            : 'bg-blue-900/90 border-blue-500/50';

    const icon =
        type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

    return (
        <div
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-sm shadow-2xl max-w-sm ${bg} text-white text-sm animate-in slide-in-from-top-2 duration-300`}
        >
            <span className="text-base flex-shrink-0">{icon}</span>
            <span className="flex-1">{message}</span>
            <button
                onClick={onDismiss}
                className="ml-2 text-white/60 hover:text-white transition-colors flex-shrink-0"
            >
                ✕
            </button>
        </div>
    );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
    return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block" />
    );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function SubmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const otpInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // OTP state
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);

    // Toast
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        type: '',
        customType: '',
        location: '',
        place: '',
        description: '',
        photo: null as File | null,
        class: '',
        floor: '',
        department: '',
    });

    // Pre-fill location from QR code
    useEffect(() => {
        const qrClass = searchParams.get('class');
        const qrFloor = searchParams.get('floor');
        const qrDepartment = searchParams.get('department');
        const qrBuilding = searchParams.get('building');

        if (qrClass || qrFloor || qrDepartment || qrBuilding) {
            setFormData(prev => ({
                ...prev,
                floor: qrFloor || '',
                class: qrClass || '',
                department: qrDepartment || '',
                location: `Building ${qrBuilding || 'A'} - Floor ${qrFloor || '1'}`,
                place: `${qrDepartment || 'General'} - Room ${qrClass || '101'}`,
            }));
        }
    }, [searchParams]);

    // Auto-fill logged-in user data and skip OTP for verified users
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await getCurrentUser();

                if (user && user.email) {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.access_token) {
                        const response = await fetch('/api/profile', {
                            headers: { 'Authorization': `Bearer ${session.access_token}` },
                        });

                        if (response.ok) {
                            const profileData = await response.json();
                            setUserRole(profileData.role || 'user');

                            if (profileData.role === 'user') {
                                setFormData(prev => ({
                                    ...prev,
                                    email: profileData.email || user.email || '',
                                    name: profileData.full_name || '',
                                    phone: profileData.phone || '',
                                }));
                                setEmailVerified(true);
                            }
                        } else {
                            setFormData(prev => ({ ...prev, email: user.email || '' }));
                        }
                    }
                }
            } catch {
                // Silently fail
            }
        };
        loadUserData();
    }, []);

    // Resend OTP countdown
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-focus OTP input
    useEffect(() => {
        if (otpSent && !emailVerified) {
            setTimeout(() => otpInputRef.current?.focus(), 100);
        }
    }, [otpSent, emailVerified]);

    // ─── Send OTP ────────────────────────────────────────────────────────────

    const handleSendOtp = async () => {
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setOtpError('Please enter a valid email address first.');
            return;
        }

        setSendingOtp(true);
        setOtpError('');

        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setOtpError(data.error || 'Failed to send OTP. Try again.');
            } else {
                setOtpSent(true);
                setOtpValue('');
                setResendCooldown(30);
                showToast(`OTP sent to ${formData.email}`, 'success');
            }
        } catch {
            setOtpError('Network error. Please try again.');
        } finally {
            setSendingOtp(false);
        }
    };

    // ─── Verify OTP ──────────────────────────────────────────────────────────

    const handleVerifyOtp = async () => {
        if (otpValue.trim().length !== 6) {
            setOtpError('Please enter the 6-digit OTP.');
            return;
        }

        setVerifyingOtp(true);
        setOtpError('');

        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otpValue.trim() }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setOtpError(data.error || 'Invalid OTP.');
            } else {
                setEmailVerified(true);
                setOtpSent(false);
                setOtpValue('');
                setOtpError('');
                showToast('Email verified successfully! ✅', 'success');
            }
        } catch {
            setOtpError('Network error. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    // ─── Submit Complaint ─────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!emailVerified) {
            showToast('Please verify your email before submitting.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const newErrors: Record<string, string> = {};

            if (!formData.name || formData.name.length < 2) newErrors.name = 'Name is required';
            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Valid email is required';
            }
            if (!formData.title) newErrors.title = 'Title is required';
            if (!formData.type) newErrors.type = 'Please select complaint type';

            const selectedType = COMPLAINT_TYPES.find(t => t.value === formData.type);
            if (selectedType?.requiresCustomType && !formData.customType) {
                newErrors.customType = 'Please specify the issue type';
            }

            if (!formData.location) newErrors.location = 'Location is required';
            if (!formData.place) newErrors.place = 'Place is required';
            if (!formData.description) newErrors.description = 'Description is required';
            if (!formData.photo) newErrors.photo = 'Photo is required';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setIsSubmitting(false);
                return;
            }

            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            if (formData.phone) submitData.append('phone', formData.phone);
            submitData.append('title', formData.title);
            submitData.append('type', formData.type);
            if (formData.customType) submitData.append('specified_problem', formData.customType);
            submitData.append('location', formData.location);
            submitData.append('place', formData.place);
            submitData.append('description', formData.description);
            if (formData.photo) submitData.append('photo', formData.photo);
            if (formData.floor) submitData.append('floor', formData.floor);
            if (formData.class) submitData.append('class', formData.class);
            if (formData.department) submitData.append('department', formData.department);

            const response = await fetch('/api/submit', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit complaint');
            }

            router.push(`/success?id=${result.complaintId}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit complaint';
            showToast(`Error: ${errorMessage}`, 'error');
            setIsSubmitting(false);
        }
    };

    // ─── Shared input style with autofill override ────────────────────────────
    const inputCls =
        'w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 ' +
        'bg-[#2C2C2C] border border-[#404040] ' +
        'focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 ' +
        '[&:-webkit-autofill]:!bg-[#2C2C2C] ' +
        '[&:-webkit-autofill]:[box-shadow:0_0_0px_1000px_#2C2C2C_inset] ' +
        '[&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]';

    return (
        <div className="min-h-screen bg-[#121212] dotted-background">
            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}

            {/* Header */}
            <header className="sticky top-0 z-50 pt-4 pb-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
                        <div className="flex items-center justify-between h-10">
                            <div className="flex items-center gap-3">
                                <Link href="/" className="p-2 hover:bg-[#2C2C2C] rounded-full transition-colors">
                                    <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <h1 className="text-xl font-bold text-white">Submit Complaint</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Admin Warning */}
                {userRole && userRole !== 'user' && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#FF9800]/10 to-[#F57C00]/10 border border-[#FF9800]/40 rounded-xl">
                        <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-[#FF9800] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-[#FF9800] font-bold text-sm mb-1">Administrative Account Detected</h3>
                                <p className="text-[#FFB74D] text-sm leading-relaxed">
                                    You're logged in with a privileged account ({userRole}). This web form is designed for end-users.
                                    Please use the mobile application for administrative tasks.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-gray-400 mb-6">Fill out the form below to report an issue</p>

                {/* Location Display Box (Read-Only from QR) */}
                {(formData.location || formData.place) && (
                    <div className="mb-6 p-4 bg-[#1E1E1E] border border-[#00BFFF]/30 rounded-lg space-y-2">
                        {formData.location && (
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Location <span className="text-[#00BFFF]">*</span></p>
                                <p className="text-white font-medium">{formData.location}</p>
                            </div>
                        )}
                        {formData.place && (
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Place <span className="text-[#00BFFF]">*</span></p>
                                <p className="text-white font-medium">{formData.place}</p>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-xl border border-[#333333] p-6 space-y-6">

                    {/* ── Personal Information ── */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Your Information</h2>

                        {/* 2×2 grid — Row 1: Name | Email   Row 2: Phone | OTP */}
                        <div className="grid md:grid-cols-2 gap-4">

                            {/* ── Full Name ── */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full Name <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className={inputCls}
                                />
                                {errors.name && <p className="mt-2 text-sm text-[#F44336]">{errors.name}</p>}
                            </div>

                            {/* ── Email + Verify Action ── */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email <span className="text-[#00BFFF]">*</span>
                                    {emailVerified && (
                                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold">
                                            ✅ Verified
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={e => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (emailVerified) {
                                            setEmailVerified(false);
                                            setOtpSent(false);
                                            setOtpValue('');
                                            setOtpError('');
                                        }
                                    }}
                                    disabled={emailVerified}
                                    placeholder="john@example.com"
                                    className={`${inputCls} w-full`}
                                />
                                {!emailVerified && (
                                    <div className="mt-2 flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={sendingOtp || !formData.email || resendCooldown > 0}
                                            className="text-sm font-semibold text-[#00BFFF] hover:text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {sendingOtp ? (
                                                <span>Sending...</span>
                                            ) : resendCooldown > 0 ? (
                                                <span>Resend in {resendCooldown}s</span>
                                            ) : (
                                                <span>{otpSent ? 'Resend' : 'Verify Email'}</span>
                                            )}
                                        </button>
                                    </div>
                                )}
                                {otpError && !otpSent && (
                                    <p className="mt-2 text-sm text-[#F44336] flex items-center gap-1">
                                        <span>⚠️</span> {otpError}
                                    </p>
                                )}
                                {errors.email && <p className="mt-2 text-sm text-[#F44336]">{errors.email}</p>}
                            </div>

                            {/* ── OTP Input — dynamically inserted into grid, remains visible after Send OTP ── */}
                            {otpSent && (
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Enter OTP <span className="text-[#00BFFF]">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            ref={otpInputRef}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otpValue}
                                            disabled={emailVerified}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setOtpValue(val);
                                                setOtpError('');
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !emailVerified) {
                                                    e.preventDefault();
                                                    handleVerifyOtp();
                                                }
                                            }}
                                            placeholder="6-digit code"
                                            className="w-full flex-1 min-w-0 px-3 sm:px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white text-center font-mono tracking-widest sm:tracking-[0.4em] text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={verifyingOtp || otpValue.length !== 6 || emailVerified}
                                            className="flex-shrink-0 px-3 sm:px-4 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                        >
                                            {emailVerified ? (
                                                <span>Verified ✅</span>
                                            ) : verifyingOtp ? (
                                                <><Spinner /><span className="hidden sm:inline">Verifying…</span></>
                                            ) : (
                                                <span>Verify OTP</span>
                                            )}
                                        </button>
                                    </div>
                                    {otpError && !emailVerified && (
                                        <p className="mt-2 text-sm text-[#F44336] flex items-center gap-1">
                                            <span>⚠️</span> {otpError}
                                        </p>
                                    )}
                                    {!emailVerified && (
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>Code expires in 5 minutes</span>
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={sendingOtp || resendCooldown > 0}
                                                className="text-[#00BFFF] hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
                                            >
                                                {resendCooldown > 0
                                                    ? `Resend in ${resendCooldown}s`
                                                    : sendingOtp
                                                    ? 'Sending…'
                                                    : 'Resend OTP'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Phone Number ── */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                    className={inputCls}
                                />
                            </div>


                        </div>
                    </div>

                    {/* ── Complaint Details ── */}
                    <div className="pt-4 border-t border-[#333333] space-y-4">
                        <h2 className="text-xl font-bold text-white">Complaint Details</h2>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Title <span className="text-[#00BFFF]">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Short title"
                                className={inputCls}
                            />
                            {errors.title && <p className="mt-2 text-sm text-[#F44336]">{errors.title}</p>}
                        </div>
                    </div>

                    {/* ── Complaint Type ── */}
                    {(() => {
                        const grouped = getComplaintTypesByCategory();
                        const groups = Object.keys(grouped).map(category => ({
                            label: category,
                            options: grouped[category].map(type => ({
                                value: type.value,
                                label: type.label,
                            })),
                        }));

                        const selectedType = COMPLAINT_TYPES.find(t => t.value === formData.type);

                        return (
                            <>
                                <GroupedSelect
                                    label="Complaint Type"
                                    required
                                    value={formData.type}
                                    onChange={e =>
                                        setFormData({ ...formData, type: e.target.value, customType: '' })
                                    }
                                    error={errors.type}
                                    groups={groups}
                                />

                                {selectedType?.requiresCustomType && (
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Specify Problem Type <span className="text-[#00BFFF]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customType}
                                            onChange={e =>
                                                setFormData({ ...formData, customType: e.target.value })
                                            }
                                            placeholder="e.g., Staircase handrail broken"
                                            className={inputCls}
                                        />
                                        {errors.customType && (
                                            <p className="mt-2 text-sm text-[#F44336]">{errors.customType}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        );
                    })()}

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Location <span className="text-[#00BFFF]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Building & Floor"
                            disabled={!!(formData.department || formData.floor || formData.class)}
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#00BFFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.location && <p className="mt-2 text-sm text-[#F44336]">{errors.location}</p>}
                    </div>

                    {/* Place */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Place <span className="text-[#00BFFF]">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.place}
                            onChange={e => setFormData({ ...formData, place: e.target.value })}
                            placeholder="Dept / Room"
                            disabled={!!(formData.department || formData.floor || formData.class)}
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#00BFFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.place && <p className="mt-2 text-sm text-[#F44336]">{errors.place}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Description <span className="text-[#00BFFF]">*</span>
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            placeholder="Describe the issue"
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                        />
                        {errors.description && <p className="mt-2 text-sm text-[#F44336]">{errors.description}</p>}
                    </div>

                    {/* Photo */}
                    <FileUpload
                        label="Photo"
                        required={true}
                        onChange={file => setFormData({ ...formData, photo: file })}
                        error={errors.photo}
                        accept="image/jpeg,image/jpg,image/png"
                        maxSize={5}
                    />

                    {/* Image Preview Modal */}
                    {showImagePreview && formData.photo && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center p-6"
                            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                            onClick={() => setShowImagePreview(false)}
                        >
                            <div
                                className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                                style={{ maxWidth: '90vw', maxHeight: '85vh' }}
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowImagePreview(false)}
                                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <img
                                    src={URL.createObjectURL(formData.photo)}
                                    alt="Full preview"
                                    className="block max-w-full max-h-[85vh] object-contain"
                                />
                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white/70 text-xs truncate">{formData.photo.name}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email verification nudge */}
                    {!emailVerified && (
                        <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm flex items-center gap-2">
                            <span>🔒</span>
                            <span>You must <strong>verify your email</strong> before submitting.</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !emailVerified}
                        className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white font-semibold py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner />
                                <span>Submitting…</span>
                            </>
                        ) : (
                            <span>Submit Complaint</span>
                        )}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default function SubmitPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]" />
                </div>
            }
        >
            <SubmitForm />
        </Suspense>
    );
}