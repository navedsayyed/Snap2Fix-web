/**
 * Form Validation Schemas using Zod
 * Defines validation rules for all forms in the application
 */

import { z } from 'zod';

/**
 * Complaint submission form schema
 */
export const complaintFormSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    email: z.string()
        .email('Please enter a valid email address')
        .min(5, 'Email is required')
        .max(100, 'Email must be less than 100 characters'),

    phone: z.string()
        .optional()
        .refine((val) => !val || /^[\d\s\-\+\(\)]{10,}$/.test(val), {
            message: 'Please enter a valid phone number',
        }),

    floor: z.string()
        .min(1, 'Please select a floor'),

    room_number: z.string()
        .min(1, 'Room number is required')
        .max(50, 'Room number must be less than 50 characters'),

    issue_type: z.string()
        .min(1, 'Please select an issue type'),

    priority: z.enum(['Low', 'Medium', 'High'], {
        message: 'Please select a priority level',
    }),

    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),

    photo: z.instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
            message: 'File size must be less than 5MB',
        })
        .refine(
            (file) => !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
            {
                message: 'Only JPEG and PNG images are allowed',
            }
        ),
});

export type ComplaintFormData = z.infer<typeof complaintFormSchema>;

/**
 * Track complaint form schema (just complaint ID)
 */
export const trackComplaintSchema = z.object({
    complaintId: z.string()
        .min(1, 'Please enter a complaint ID')
        .uuid('Please enter a valid complaint ID'),
});

export type TrackComplaintData = z.infer<typeof trackComplaintSchema>;

/**
 * API request validation schemas
 */

// Submit complaint API request
export const submitComplaintApiSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(100),
    phone: z.string().optional(),
    floor: z.string().min(1),
    room_number: z.string().min(1).max(50),
    issue_type: z.string().min(1),
    priority: z.enum(['Low', 'Medium', 'High']),
    description: z.string().min(10).max(1000),
    image_url: z.string().optional(), // Can be either a file path or full URL for backward compatibility
    department: z.string().optional(),
});

export type SubmitComplaintApiData = z.infer<typeof submitComplaintApiSchema>;
