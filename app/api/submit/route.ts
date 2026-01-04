/**
 * API Route: POST /api/submit
 * Handles complaint submission from web form
 */

import { NextRequest, NextResponse } from 'next/server';
import { insertComplaint, uploadImage, supabase } from '@/lib/supabase';
import { determineDepartment } from '@/lib/departmentMapping';
import { sendConfirmationEmail } from '@/lib/email';
import { submitComplaintApiSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
        // Get current user if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        // Parse form data
        const formData = await request.formData();

        // Extract fields
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string | null;
        const floor = formData.get('floor') as string;
        const room_number = formData.get('room_number') as string;
        const issue_type = formData.get('issue_type') as string;
        const priority = formData.get('priority') as 'Low' | 'Medium' | 'High';
        const description = formData.get('description') as string;
        const photo = formData.get('photo') as File | null;
        const locationDepartment = formData.get('location_department') as string | null;

        // Validate required fields
        if (!name || !email || !floor || !room_number || !issue_type || !priority || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Upload photo if provided (non-blocking - complaint can be submitted without image)
        let imageUrl: string | null = null;
        let imageUploadWarning: string | null = null;
        
        if (photo && photo.size > 0) {
            // Validate file size (5MB max)
            if (photo.size > 5 * 1024 * 1024) {
                imageUploadWarning = 'File size exceeds 5MB limit';
                console.warn('Image too large:', photo.size);
            }
            // Validate file type
            else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photo.type)) {
                imageUploadWarning = 'Only JPEG and PNG images are allowed';
                console.warn('Invalid file type:', photo.type);
            }
            // Try to upload
            else {
                console.log('Attempting to upload image:', photo.name, 'Size:', photo.size);
                const { url, error: uploadError } = await uploadImage(photo);
                
                if (uploadError) {
                    console.error('Image upload error:', uploadError);
                    imageUploadWarning = 'Image upload failed - complaint submitted without photo';
                    // Don't block submission, just continue without image
                } else {
                    imageUrl = url;
                    console.log('Image uploaded successfully:', imageUrl);
                }
            }
        }

        // Determine department based on issue type and location
        const department = determineDepartment(
            issue_type,
            locationDepartment || undefined,
            floor
        );

        // Get location and place from form data
        const location = formData.get('location') as string || `Building A - Floor ${floor}`;
        const place = formData.get('place') as string || `${locationDepartment || 'General'} - Room ${room_number}`;

        // Handle custom type - prepend to title if provided
        const custom_type = formData.get('custom_type') as string | null;
        const baseTitle = custom_type || issue_type;
        const title = `${baseTitle} issue in ${room_number}`;

        // Prepare complaint data - MATCHING React Native app structure
        const complaintData = {
            user_id: user?.id || null, // Set user_id if authenticated, null for guest
            title,                      // Complaint title
            type: issue_type,          // Original complaint type (REQUIRED by React Native)
            description,               // Description
            location,                  // "Building A - Floor 1" format
            place,                     // "Civil - Room 101" format
            department,                // Auto-determined from type/floor
            complaint_type: department, // Department name for HOD filtering
            floor: floor || null,      // Floor number
            class: room_number || null, // Room/class number (React Native uses 'class' field)
            status: 'in-progress',     // MUST be 'in-progress' not 'Pending'
            assigned_to: null,         // Initially null
            completed_at: null,
            completion_notes: null,
            completion_image_url: null,
            completion_image_path: null,
        };

        // Insert complaint into database
        const { data: complaint, error: insertError } = await insertComplaint(complaintData);

        if (insertError) {
            console.error('Database insert error:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to submit complaint' },
                { status: 500 }
            );
        }

        if (!complaint) {
            return NextResponse.json(
                { success: false, error: 'Failed to create complaint' },
                { status: 500 }
            );
        }

        // Upload image AFTER complaint is created (matching React Native flow)
        if (imageUrl && complaint.id) {
            try {
                // Store image reference in complaint_images table
                const { error: imageRecordError } = await supabase
                    .from('complaint_images')
                    .insert({
                        complaint_id: complaint.id,
                        url: imageUrl,
                        storage_path: imageUrl, // Store the full URL
                        created_at: new Date().toISOString(),
                    });

                if (imageRecordError) {
                    console.error('Failed to create image record:', imageRecordError);
                    imageUploadWarning = 'Image uploaded but failed to link to complaint';
                }
            } catch (err) {
                console.error('Image record exception:', err);
                imageUploadWarning = 'Image uploaded but failed to link to complaint';
            }
        }

        // Send confirmation email (don't wait for it, send async)
        sendConfirmationEmail({
            email,
            complaintId: complaint.id,
            userName: name,
            complaintDetails: {
                title,
                floor,
                room_number,
                priority,
                description,
            },
        }).catch((error) => {
            console.error('Email send error:', error);
            // Don't fail the request if email fails
        });

        // Generate tracking URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const trackingUrl = `${siteUrl}/track/${complaint.id}`;

        // Return success response
        return NextResponse.json({
            success: true,
            complaintId: complaint.id,
            trackingUrl,
            warning: imageUploadWarning, // Include warning if image upload failed
        });

    } catch (error) {
        console.error('Submit complaint error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
