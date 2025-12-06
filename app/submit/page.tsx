/**
 * Submit Complaint Page
 * Form for submitting new complaints with QR code support
 */

'use client';

import { useState, useEffect } from 'react';
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

export default function SubmitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const locationId = searchParams.get('loc');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Pre-fill location from QR code
    useEffect(() => {
        if (locationId) {
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
    }, [locationId]);

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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Back to Home</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
                    <p className="text-lg text-gray-600">
                        Fill out the form below to report an issue. We'll get back to you within 24-48 hours.
                    </p>
                    {locationId && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <svg width="20" height="20" className="text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-green-900">QR Code Scanned</p>
                                <p className="text-sm text-green-700">Location details have been pre-filled for you</p>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={errors.name}
                                placeholder="John Doe"
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="mt-6">
                            <Input
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                error={errors.phone}
                                placeholder="+1 (555) 123-4567"
                                helperText="Optional - for urgent follow-ups"
                            />
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                        <div className="grid md:grid-cols-2 gap-6">
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
                            <Input
                                label="Room Number"
                                required
                                value={formData.room_number}
                                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                                error={errors.room_number}
                                placeholder="e.g., Lab 101, Classroom 201"
                            />
                        </div>
                    </div>

                    {/* Issue Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Details</h2>
                        <div className="space-y-6">
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
                                            <Input
                                                label="Specify Issue Type"
                                                required
                                                value={formData.custom_type}
                                                onChange={(e) => setFormData({ ...formData, custom_type: e.target.value })}
                                                error={errors.custom_type}
                                                placeholder="Please specify the issue type"
                                                helperText="Provide more details about the issue"
                                            />
                                        )}
                                    </>
                                );
                            })()}


                            {/* Priority Selection - Currently not needed
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['Low', 'Medium', 'High'] as const).map((priority) => (
                                        <button
                                            key={priority}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority })}
                                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.priority === priority
                                                ? priority === 'High'
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : priority === 'Medium'
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {priority}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            */}


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
                    <div className="pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                        <p className="mt-3 text-sm text-gray-500 text-center">
                            You'll receive a confirmation email with a tracking link
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}
