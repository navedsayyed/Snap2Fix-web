/**
 * API Route: POST /api/submit - MATCHING React Native App
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, uploadImage } from '@/lib/supabase';
import { determineDepartment } from '@/lib/departmentMapping';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        
        console.log('=== FORM DATA RECEIVED ===');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File { name: "${value.name}", size: ${value.size}, type: "${value.type}" }`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log('=========================');

        // Extract user info
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string | null;

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
        if (!name || !email || !title || !type || !location || !place || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find or create user by email
        let userId: string;
        
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            userId = existingUser.id;
            console.log('Using existing user:', userId);
        } else {
            // Create new user account
            const { data: newUser, error: signUpError } = await supabase.auth.signUp({
                email,
                password: Math.random().toString(36).substring(2, 15), // Random password
                options: {
                    data: {
                        name: name,
                        phone: phone,
                    }
                }
            });

            if (signUpError || !newUser.user) {
                console.error('Failed to create user:', signUpError);
                return NextResponse.json(
                    { success: false, error: 'Failed to create user account' },
                    { status: 500 }
                );
            }

            userId = newUser.user.id;
            console.log('Created new user:', userId);

            // Update user table with name and phone
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({
                    full_name: name,
                    phone: phone
                })
                .eq('id', userId);

            if (userUpdateError) {
                console.error('Failed to update user:', userUpdateError);
                // Don't fail the request, just log the error
            } else {
                console.log('User updated with name and phone');
            }
        }

        // Handle custom type
        const finalTitle = custom_type ? `${custom_type} - ${title}` : title;

        // Determine department
        let routingDepartment = department || determineDepartment(type, undefined, floor || undefined);

        // Upload photo
        let imageUrl: string | null = null;
        let imageUploadWarning: string | null = null;
        
        console.log('Photo received:', photo ? `${photo.name} (${photo.size} bytes)` : 'No photo');
        
        if (photo && photo.size > 0) {
            if (photo.size > 5 * 1024 * 1024) {
                imageUploadWarning = 'File too large';
                console.log('Image upload failed: File too large');
            } else if (!['image/jpeg', 'image/jpg', 'image/png'].includes(photo.type)) {
                imageUploadWarning = 'Invalid file type';
                console.log('Image upload failed: Invalid file type', photo.type);
            } else {
                console.log('Uploading image...');
                const { url, error: uploadError } = await uploadImage(photo, 'complaint-images');
                if (uploadError) {
                    imageUploadWarning = 'Upload failed';
                    console.error('Image upload failed:', uploadError);
                } else {
                    imageUrl = url;
                    console.log('Image uploaded successfully:', imageUrl);
                }
            }
        } else {
            console.log('No photo provided or photo size is 0');
        }

        // For web submissions without login, use a default guest UUID
        // This matches the database NOT NULL constraint
        const GUEST_USER_ID = '00000000-0000-0000-0000-000000000001';

        // Prepare complaint data
        const complaintData = {
            user_id: userId, // Use the found or created user ID
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
            image_url: imageUrl, // Add image URL to complaint
        };

        // Insert complaint
        console.log('Attempting to insert complaint:', complaintData);
        const { data: complaint, error: insertError } = await supabase
            .from('complaints')
            .insert([complaintData])
            .select()
            .single();

        if (insertError) {
            console.error('Insert error:', insertError);
            console.error('Insert error details:', JSON.stringify(insertError, null, 2));
            return NextResponse.json(
                { success: false, error: `Failed to submit: ${insertError.message}` },
                { status: 500 }
            );
        }

        if (!complaint) {
            console.error('No complaint data returned');
            return NextResponse.json(
                { success: false, error: 'No complaint created' },
                { status: 500 }
            );
        }

        console.log('Complaint created successfully:', complaint.id);

        // Save image
        if (imageUrl && complaint?.id) {
            console.log('Saving image reference for complaint:', complaint.id);
            const { error: imageError } = await supabase.from('complaint_images').insert({
                complaint_id: complaint.id,
                url: imageUrl,
                storage_path: imageUrl,
            });
            
            if (imageError) {
                console.error('Image reference save error:', imageError);
            }
        }

        // Try to send email if SMTP is configured (optional)
        console.log('SMTP_USER exists:', !!process.env.SMTP_USER);
        console.log('SMTP_PASS exists:', !!process.env.SMTP_PASS);
        
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                console.log('Attempting to send tracking email to:', email);
                const emailResult = await sendConfirmationEmail({
                    email,
                    complaintId: String(complaint.id),
                    userName: name,
                    complaintDetails: {
                        title: finalTitle,
                        floor: floor || 'N/A',
                        room_number: classRoom || 'N/A',
                        priority: 'Medium',
                        description
                    }
                });
                
                console.log('Email result:', emailResult);
                
                if (emailResult.success) {
                    console.log('✅ Tracking email sent successfully');
                } else {
                    console.error('❌ Failed to send tracking email:', emailResult.error);
                }
            } catch (emailError) {
                console.error('❌ Email sending exception:', emailError);
                // Don't fail the complaint submission if email fails
            }
        } else {
            console.log('⚠️ Email not configured - SMTP credentials missing');
        }

        // Send push notifications to admins/technicians (matching mobile app behavior)
        try {
            console.log('📱 Sending push notifications to admins/technicians...');
            
            // Get all admin and technician user IDs
            const { data: adminUsers, error: adminError } = await supabase
                .from('users')
                .select('id')
                .in('role', ['admin', 'technician']);

            if (adminError) {
                console.error('Failed to fetch admin users:', adminError);
            } else if (adminUsers && adminUsers.length > 0) {
                const userIds = adminUsers.map(u => u.id);
                
                // Call Supabase Edge Function to send push notifications
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                
                const pushResponse = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseKey}`,
                    },
                    body: JSON.stringify({
                        userIds,
                        title: '🆕 New Complaint',
                        body: `${finalTitle} - ${location}`,
                        data: {
                            type: 'new_complaint',
                            complaintId: String(complaint.id),
                            status: 'in-progress',
                        },
                    }),
                });

                const pushResult = await pushResponse.json();
                console.log('Push notification result:', pushResult);
            } else {
                console.log('No admin/technician users found for push notifications');
            }
        } catch (pushError) {
            console.error('Push notification error:', pushError);
            // Don't fail the complaint submission if push fails
        }

        // Generate tracking URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smart-maintenance-web.vercel.app';
        const trackingUrl = `${siteUrl}/track/${complaint.id}`;

        return NextResponse.json({
            success: true,
            complaintId: complaint.id,
            trackingUrl: trackingUrl,
            warning: imageUploadWarning,
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
