/**
 * API Route: POST /api/submit - MATCHING React Native App
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, uploadImage } from '@/lib/supabase';
import { determineDepartment } from '@/lib/departmentMapping';

export async function POST(request: NextRequest) {
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Parse form data
        const formData = await request.formData();

        // Extract fields - MATCHING React Native app
        const title = formData.get('title') as string;
        const type = formData.get('type') as string;
        const custom_type = formData.get('custom_type') as string | null;
        const location = formData.get('location') as string;
        const place = formData.get('place') as string;
        const description = formData.get('description') as string;
        const photo = formData.get('photo') as File | null;
        const floor = formData.get('floor') as string | null;
        const classRoom = formData.get('class') as string | null;
        const department = formData.get('department') as string | null;

        // Validate
        if (!title || !type || !location || !place || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle custom type
        const finalTitle = custom_type ? `${custom_type} - ${title}` : title;

        // Determine department
        let routingDepartment = department || determineDepartment(type, undefined, floor || undefined);

        // Upload photo
        let imageUrl: string | null = null;
        let imageUploadWarning: string | null = null;
        
        if (photo && photo.size > 0) {
            if (photo.size > 5 * 1024 * 1024) {
                imageUploadWarning = 'File too large';
            } else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photo.type)) {
                imageUploadWarning = 'Invalid file type';
            } else {
                const { url, error: uploadError } = await uploadImage(photo);
                if (uploadError) {
                    imageUploadWarning = 'Upload failed';
                } else {
                    imageUrl = url;
                }
            }
        }

        // For web submissions without login, use a default guest UUID
        // This matches the database NOT NULL constraint
        const GUEST_USER_ID = '00000000-0000-0000-0000-000000000001';

        // Prepare complaint data
        const complaintData = {
            user_id: user?.id || GUEST_USER_ID,
            title: finalTitle,
            type,
            description,
            location,
            place,
            department: routingDepartment,
            complaint_type: routingDepartment,
            floor: floor || null,
            class: classRoom || null,
            status: 'in-progress',
            assigned_to: null,
        };

        // Insert complaint
        const { data: complaint, error: insertError } = await supabase
            .from('complaints')
            .insert([complaintData])
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to submit' },
                { status: 500 }
            );
        }

        // Save image
        if (imageUrl && complaint?.id) {
            await supabase.from('complaint_images').insert({
                complaint_id: complaint.id,
                url: imageUrl,
                storage_path: imageUrl,
            });
        }

        return NextResponse.json({
            success: true,
            complaintId: complaint.id,
            warning: imageUploadWarning,
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        );
    }
}
