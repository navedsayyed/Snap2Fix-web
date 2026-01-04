/**
 * Submit Complaint Page
 * Form for submitting new complaints with QR code support
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { GroupedSelect } from '@/components/ui/GroupedSelect';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { getLocationById } from '@/lib/locations';
import { FLOORS } from '@/lib/types';
import { COMPLAINT_TYPES, getComplaintTypesByCategory } from '@/lib/complaintTypes';
import { getCurrentUser } from '@/lib/auth';

function SubmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const locationId = searchParams.get('loc');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        floor: '',
        room_number: '',
        issue_type: '',
        custom_type: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High',
        description: '',
        photo: null as File | null,
        location_department: '',
    });

    // Formatted location strings (matching React Native app format)
    const [locationDisplay, setLocationDisplay] = useState({
        location: '',  // "Building A - Floor 1"
        place: ''      // "Civil - Room 101"
    });

    // Load current user
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                setCurrentUser(user);
                setFormData(prev => ({
                    ...prev,
                    name: user.user_metadata?.name || '',
                    email: user.email || '',
                }));
            }
        } catch (err) {
            console.log('User not logged in');
        }
    };

    // Pre-fill location from QR code URL parameters
    useEffect(() => {
        // Check for QR code parameters (class, floor, department, building)
        const qrClass = searchParams.get('class');
        const qrFloor = searchParams.get('floor');
        const qrDepartment = searchParams.get('department');
        const qrBuilding = searchParams.get('building');

        console.log('QR Parameters:', { qrClass, qrFloor, qrDepartment, qrBuilding });

        if (qrClass || qrFloor || qrDepartment || qrBuilding) {
            console.log('Auto-filling form with QR data');
            
            // Auto-fill from QR code scan (matching React Native app format)
            setFormData(prev => ({
                ...prev,
                floor: qrFloor || prev.floor,
                room_number: qrClass || prev.room_number,
                location_department: qrDepartment || prev.location_department,
            }));

            // Set formatted location strings (same as React Native app)
            setLocationDisplay({
                location: `Building ${qrBuilding || 'A'} - Floor ${qrFloor || '1'}`,
                place: `${qrDepartment || 'General'} - Room ${qrClass || '101'}`
            });
        } else if (locationId) {
            // Fallback to old location ID method
            const location = getLocationById(locationId);
            if (location) {
                setFormData(prev => ({
                    ...prev,
                    floor: location.floor,
                    room_number: location.name,
                    location_department: location.department,
                }));
            }
        }
    }, [locationId, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            // Client-side validation
            const newErrors: Record<string, string> = {};

            if (!formData.name || formData.name.length < 2) {
                newErrors.name = 'Name must be at least 2 characters';
            }

            if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }

            if (!formData.floor) {
                newErrors.floor = 'Please select a floor';
            }

            if (!formData.room_number) {
                newErrors.room_number = 'Room number is required';
            }

            if (!formData.issue_type) {
                newErrors.issue_type = 'Please select an issue type';
            }

            // Check if custom type is required
            const selectedType = COMPLAINT_TYPES.find(t => t.value === formData.issue_type);
            if (selectedType?.requiresCustomType && !formData.custom_type) {
                newErrors.custom_type = 'Please specify the issue type';
            }

            if (!formData.description || formData.description.length < 10) {
                newErrors.description = 'Description must be at least 10 characters';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setIsSubmitting(false);
                return;
            }

            // Prepare form data for submission
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            if (formData.phone) submitData.append('phone', formData.phone);
            submitData.append('floor', formData.floor);
            submitData.append('room_number', formData.room_number);
            submitData.append('issue_type', formData.issue_type);
            if (formData.custom_type) submitData.append('custom_type', formData.custom_type);
            submitData.append('priority', formData.priority);
            submitData.append('description', formData.description);
            if (formData.photo) submitData.append('photo', formData.photo);
            if (formData.location_department) submitData.append('location_department', formData.location_department);

            // Submit to API
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit complaint');
            }

            // Redirect to success page with complaint ID
            router.push(`/success?id=${result.complaintId}`);

        } catch (error) {
            console.error('Submit error:', error);
            alert(error instanceof Error ? error.message : 'Failed to submit complaint. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] overflow-hidden">
            {/* Header */}
            <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 sm:h-20">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-white transition-colors group">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all group-hover:scale-105">
                                <svg width="20" height="20" className="text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base font-medium">Back to Home</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isInputFocused ? 'py-6 sm:py-12' : 'py-8 sm:py-12'}`}>
                <div className={`mb-6 sm:mb-8 transition-all duration-500 ${isInputFocused ? 'scale-95 sm:scale-100' : 'scale-100'}`}>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Submit a Complaint</h1>
                    <p className="text-base sm:text-lg text-gray-400">
                        Fill out the form below to report an issue. We'll get back to you within 24-48 hours.
                    </p>
                    {(locationId || searchParams.get('class') || searchParams.get('floor')) && (
                        <div className="mt-4 p-4 bg-[#1E1E1E] border border-[#00BFFF]/30 rounded-lg flex items-start gap-3">
                            <svg width="20" height="20" className="text-[#00BFFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">QR Code Scanned</p>
                                <p className="text-sm text-gray-400 mb-2">Location details have been pre-filled for you</p>
                                {locationDisplay.location && (
                                    <div className="space-y-1 text-xs">
                                        {formData.location_department && (
                                            <p className="text-gray-400">
                                                <span className="text-gray-500">Dept:</span> <span className="text-white">{formData.location_department}</span>
                                            </p>
                                        )}
                                        {formData.floor && (
                                            <p className="text-gray-400">
                                                <span className="text-gray-500">Floor:</span> <span className="text-white">{formData.floor}</span>
                                            </p>
                                        )}
                                        {formData.room_number && (
                                            <p className="text-gray-400">
                                                <span className="text-gray-500">Room:</span> <span className="text-white">{formData.room_number}</span>
                                            </p>
                                        )}
                                        <p className="text-[#00BFFF] mt-2 font-medium">
                                            {locationDisplay.location}<br/>
                                            {locationDisplay.place}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#333333] p-6 sm:p-8 space-y-6 sm:space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-5">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full Name <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                                />
                                {errors.name && <p className="mt-2 text-sm text-[#F44336]">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email Address <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                                />
                                {errors.email && <p className="mt-2 text-sm text-[#F44336]">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <label className="block text-sm font-medium text-white mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                            />
                            <p className="mt-2 text-xs text-gray-500">Optional - for urgent follow-ups</p>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div className="pt-6 border-t border-[#333333]">
                        <h2 className="text-xl font-bold text-white mb-5">Location</h2>
                        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
                            <Select
                                label="Floor"
                                required
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                error={errors.floor}
                                options={[
                                    { value: '', label: 'Select floor' },
                                    ...FLOORS.map(floor => ({ value: floor, label: floor }))
                                ]}
                            />
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Room Number <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.room_number}
                                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                                    onFocus={() => setIsInputFocused(true)}
                                    onBlur={() => setIsInputFocused(false)}
                                    placeholder="e.g., Lab 101, Classroom 201"
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                                />
                                {errors.room_number && <p className="mt-2 text-sm text-[#F44336]">{errors.room_number}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Issue Details */}
                    <div className="pt-6 border-t border-[#333333]">
                        <h2 className="text-xl font-bold text-white mb-5">Issue Details</h2>
                        <div className="space-y-5 sm:space-y-6">
                            {/* Prepare grouped options */}
                            {(() => {
                                const grouped = getComplaintTypesByCategory();
                                const groups = Object.keys(grouped).map(category => ({
                                    label: category,
                                    options: grouped[category].map(type => ({
                                        value: type.value,
                                        label: type.label
                                    }))
                                }));

                                const selectedType = COMPLAINT_TYPES.find(t => t.value === formData.issue_type);
                                const requiresCustomType = selectedType?.requiresCustomType;

                                return (
                                    <>
                                        <GroupedSelect
                                            label="Issue Type"
                                            required
                                            value={formData.issue_type}
                                            onChange={(e) => {
                                                setFormData({ ...formData, issue_type: e.target.value, custom_type: '' });
                                            }}
                                            error={errors.issue_type}
                                            groups={groups}
                                        />

                                        {requiresCustomType && (
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Specify Issue Type <span className="text-[#00BFFF]">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.custom_type}
                                                    onChange={(e) => setFormData({ ...formData, custom_type: e.target.value })}
                                                    onFocus={() => setIsInputFocused(true)}
                                                    onBlur={() => setIsInputFocused(false)}
                                                    placeholder="Please specify the issue type"
                                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50 transition-all duration-300"
                                                />
                                                {errors.custom_type && <p className="mt-2 text-sm text-[#F44336]">{errors.custom_type}</p>}
                                                <p className="mt-2 text-xs text-gray-500">Provide more details about the issue</p>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}


                            <Textarea
                                label="Description"
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                error={errors.description}
                                placeholder="Please describe the issue in detail..."
                                rows={5}
                                maxLength={1000}
                                showCharCount
                                helperText="Minimum 10 characters"
                            />

                            <FileUpload
                                label="Photo (Optional)"
                                onChange={(file) => setFormData({ ...formData, photo: file })}
                                helperText="Upload a photo of the issue (max 5MB, JPEG/PNG only)"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-[#333333]">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] text-white font-semibold py-3 sm:py-4 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-[#00BFFF]/40 hover:shadow-[#00BFFF]/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <span>Submit Complaint</span>
                            )}
                        </button>
                        <p className="mt-3 text-sm text-gray-400 text-center">
                            You'll receive a confirmation email with a tracking link
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default function SubmitPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF]"></div>
            </div>
        }>
            <SubmitForm />
        </Suspense>
    );
}
