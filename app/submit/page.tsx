/**
 * Submit Complaint Page - MATCHING React Native App
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GroupedSelect } from '@/components/ui/GroupedSelect';
import { FileUpload } from '@/components/ui/FileUpload';
import { COMPLAINT_TYPES, getComplaintTypesByCategory } from '@/lib/complaintTypes';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

function SubmitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showImagePreview, setShowImagePreview] = useState(false);

    // Form state - MATCHING React Native app exactly
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

    // Pre-fill location from QR code FIRST (before user data)
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
                place: `${qrDepartment || 'General'} - Room ${qrClass || '101'}`
            }));
        }
    }, [searchParams]);

    // Check if user is logged in and auto-fill ONLY their personal info
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const user = await getCurrentUser();
                
                if (user && user.email) {
                    // Get session token
                    const { data: { session } } = await supabase.auth.getSession();
                    
                    if (session?.access_token) {
                        // Fetch profile via API route
                        const response = await fetch('/api/profile', {
                            headers: {
                                'Authorization': `Bearer ${session.access_token}`
                            }
                        });
                        
                        if (response.ok) {
                            const profileData = await response.json();
                            
                            // Only update personal info, preserve location data from QR
                            setFormData(prev => ({
                                ...prev,
                                email: profileData.email || user.email || '',
                                name: profileData.full_name || '',
                                phone: profileData.phone || ''
                            }));
                        } else {
                            // Fallback to just email
                            setFormData(prev => ({
                                ...prev,
                                email: user.email || ''
                            }));
                        }
                    }
                }
            } catch (error) {
            }
        };
        loadUserData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            // Validation
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
            if (!formData.description) {
                newErrors.description = 'Description is required';
            }
            if (!formData.photo) newErrors.photo = 'Photo is required';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setIsSubmitting(false);
                return;
            }

            // Prepare form data
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            if (formData.phone) submitData.append('phone', formData.phone);
            submitData.append('title', formData.title);
            submitData.append('type', formData.type);
            if (formData.customType) submitData.append('custom_type', formData.customType);
            submitData.append('location', formData.location);
            submitData.append('place', formData.place);
            submitData.append('description', formData.description);
            if (formData.photo) {
                console.log('Appending photo:', formData.photo.name, 'Size:', formData.photo.size, 'Type:', formData.photo.type);
                submitData.append('photo', formData.photo);
            } else {
                console.log('No photo to upload');
            }
            if (formData.floor) submitData.append('floor', formData.floor);
            if (formData.class) submitData.append('class', formData.class);
            if (formData.department) submitData.append('department', formData.department);

            // Submit
            console.log('Submitting complaint with FormData...');
            for (let [key, value] of submitData.entries()) {
                if (key === 'photo') {
                    console.log('FormData entry:', key, '=', value instanceof File ? `File: ${value.name}` : value);
                } else {
                    console.log('FormData entry:', key, '=', value);
                }
            }
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();
            console.log('API Response:', result);

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to submit complaint');
            }

            console.log('Success! Redirecting to success page...');
            router.push(`/success?id=${result.complaintId}`);

        } catch (error) {
            console.error('Submit error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit complaint';
            alert(`Error: ${errorMessage}\n\nCheck the console for more details.`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212]">
            <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <svg width="20" height="20" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:inline">Back</span>
                        </Link>
                        <h1 className="text-xl font-bold text-white flex-1">Complaint Form</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <p className="text-gray-400 mb-6">Fill out the form below to report an issue</p>

                {(formData.department || formData.floor || formData.class) && (
                    <div className="mb-6 p-4 bg-[#1E1E1E] border border-[#00BFFF]/30 rounded-lg">
                        <p className="text-sm font-medium text-white mb-2">🎯 QR Code Scanned</p>
                        {formData.department && <p className="text-xs text-gray-400">Dept: {formData.department}</p>}
                        {formData.floor && <p className="text-xs text-gray-400">Floor: {formData.floor}</p>}
                        {formData.class && <p className="text-xs text-gray-400">Room: {formData.class}</p>}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-xl border border-[#333333] p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Your Information</h2>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Full Name <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                                />
                                {errors.name && <p className="mt-2 text-sm text-[#F44336]">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email <span className="text-[#00BFFF]">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                                />
                                {errors.email && <p className="mt-2 text-sm text-[#F44336]">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                            />
                        </div>
                    </div>

                    {/* Complaint Details */}
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
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Short title"
                                className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                            />
                            {errors.title && <p className="mt-2 text-sm text-[#F44336]">{errors.title}</p>}
                        </div>
                    </div>

                    {/* Type */}
                    {(() => {
                        const grouped = getComplaintTypesByCategory();
                        const groups = Object.keys(grouped).map(category => ({
                            label: category,
                            options: grouped[category].map(type => ({
                                value: type.value,
                                label: type.label
                            }))
                        }));

                        const selectedType = COMPLAINT_TYPES.find(t => t.value === formData.type);

                        return (
                            <>
                                <GroupedSelect
                                    label="Complaint Type"
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value, customType: '' })}
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
                                            onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                                            placeholder="e.g., Staircase handrail broken"
                                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#00BFFF] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
                                        />
                                        {errors.customType && <p className="mt-2 text-sm text-[#F44336]">{errors.customType}</p>}
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
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Building & Floor"
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#00BFFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
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
                            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                            placeholder="Dept / Room"
                            className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#00BFFF]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00BFFF] focus:ring-2 focus:ring-[#00BFFF]/50"
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
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        onChange={(file) => setFormData({ ...formData, photo: file })}
                        error={errors.photo}
                        accept="image/jpeg,image/jpg,image/png"
                        maxSize={5}
                    />

                    {/* Image Preview Modal */}
                    {showImagePreview && formData.photo && (
                        <div 
                            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                            onClick={() => setShowImagePreview(false)}
                        >
                            <div className="relative max-w-5xl w-full">
                                <button
                                    onClick={() => setShowImagePreview(false)}
                                    className="absolute -top-12 right-0 text-white hover:text-[#00BFFF] transition-colors"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <img 
                                    src={URL.createObjectURL(formData.photo)} 
                                    alt="Full preview" 
                                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white font-semibold py-4 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
