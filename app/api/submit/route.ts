/**
 * API Route: POST /api/submit
 * Handles complaint submission from web form
 */

import { NextRequest, NextResponse } from 'next/server';
import { insertComplaint, uploadImage } from '@/lib/supabase';
import { determineDepartment } from '@/lib/departmentMapping';
import { sendConfirmationEmail } from '@/lib/email';
import { submitComplaintApiSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
    try {
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

        // Upload photo if provided
        let imageUrl: string | null = null;
        if (photo && photo.size > 0) {
            // Validate file size (5MB max)
            if (photo.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, error: 'File size must be less than 5MB' },
                    { status: 400 }
                );
            }

            // Validate file type
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photo.type)) {
                return NextResponse.json(
                    { success: false, error: 'Only JPEG and PNG images are allowed' },
                    { status: 400 }
                );
            }

            const { url, error: uploadError } = await uploadImage(photo);
            if (uploadError) {
                console.error('Image upload error:', uploadError);
                return NextResponse.json(
                    { success: false, error: 'Failed to upload image' },
                    { status: 500 }
                );
            }
            imageUrl = url;
        }

        // Determine department based on issue type and location
        const department = determineDepartment(
            issue_type,
            locationDepartment || undefined,
            floor
        );

        // Create complaint title from issue type and room
        const title = `${issue_type} issue in ${room_number}`;

        // Prepare complaint data
        const complaintData = {
            user_id: null, // Web submissions don't have user accounts
            title,
            description,
            department,
            floor,
            room_number,
            status: 'Pending',
            priority,
            image_url: imageUrl,
            proof_image: null,
            technician_id: null,
            completed_at: null,
            user_name: name,
            user_email: email,
            user_phone: phone || null,
            created_via: 'web',
            tracking_token: crypto.randomUUID(),
            assigned_at: null,
            started_at: null,
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
