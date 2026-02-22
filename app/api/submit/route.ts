/**
 * API Route: POST /api/submit - MATCHING React Native App
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, uploadImage, getAdminClient } from '@/lib/supabase';
import { determineDepartment, getDepartmentByFloor } from '@/lib/departmentMapping';
import { sendConfirmationEmail, sendWelcomeEmail } from '@/lib/email';
import { shouldUseAIRouting } from '@/lib/gemini';

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
        // title = Main complaint title/summary
        // specified_problem = "Specify Problem Type" field (AI analyzes this!)
        // description = General "Description" field (additional details)
        const title = formData.get('title') as string;
        const specified_problem = (formData.get('specified_problem') || formData.get('custom_type')) as string | null; // Support both new and old field names
        const type = formData.get('type') as string;
        const custom_type = formData.get('custom_type') as string | null; // Keep for backward compatibility
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
        let isNewUser = false;
        
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
            // Create new user account using admin API to skip Supabase's automatic confirmation email
            const adminClient = getAdminClient();
            const tempPassword = Math.random().toString(36).substring(2, 15);
            const { data: newUser, error: signUpError } = await adminClient.auth.admin.createUser({
                email,
                password: tempPassword,
                email_confirm: true, // Auto-confirm to prevent Supabase from sending confirmation email
                user_metadata: {
                    name: name,
                    phone: phone,
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
            isNewUser = true;
            console.log('Created new user with admin API:', userId);

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

        // Determine HANDLING department based on complaint type
        // ⚡ NEW: For "General Other" ONLY → AI determines department from description
        let handlingDepartment: string;
        
        if (shouldUseAIRouting(type)) {
            // "General Other" complaint - AI will analyze description to determine department
            handlingDepartment = 'AI_PENDING'; // Temporary status
            console.log('🤖 AI routing will be triggered - analyzing description only');
        } else {
            // Normal routing - Computer → IT, Electrical → Electrical, etc.
            handlingDepartment = determineDepartment(type, undefined, floor || undefined);
            console.log(`📍 Standard routing: ${type} → ${handlingDepartment}`);
        }
        
        // Keep origin department from QR code/location
        const originDepartment = department || 'Not Specified';

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
            specified_problem: specified_problem || null, // Separate column for "Specify Problem Type"
            type,
            description,
            location,
            place,
            department: originDepartment, // WHERE it came from (e.g., "Civil" from QR code)
            complaint_type: handlingDepartment, // WHO handles it (e.g., "IT Support" for computer)
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
                console.log('Attempting to send email to:', email);
                
                if (isNewUser) {
                    // For new users: Send welcome email with password setup link
                    const setPasswordUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snap2fix.vercel.app'}/update-password?newUser=true&email=${encodeURIComponent(email)}`;
                    
                    const welcomeEmailResult = await sendWelcomeEmail({
                        email,
                        userName: name,
                        setPasswordUrl,
                        complaintId: String(complaint.id),
                        trackingUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snap2fix.vercel.app'}/track/${complaint.id}`,
                    });
                    
                    console.log('Welcome email result:', welcomeEmailResult);
                    
                    if (welcomeEmailResult.success) {
                        console.log('✅ Welcome email sent to new user');
                    } else {
                        console.error('❌ Failed to send welcome email');
                    }
                } else {
                    // For existing users: Send normal tracking email
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
                        console.error('❌ Failed to send tracking email');
                    }
                }
            } catch (emailError) {
                console.error('❌ Email sending exception:', emailError);
                // Don't fail the complaint submission if email fails
            }
        } else {
            console.log('⚠️ Email not configured - SMTP credentials missing');
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // NOTIFICATION SYSTEM
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // Two types of notifications:
        // 1. FLOOR ADMIN (monitoring only) - admin sees complaint from their floor
        // 2. DEPARTMENT ADMIN (solving) - admin + technicians handle the complaint
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        
        // ⚡ SKIP NOTIFICATIONS FOR AI_PENDING
        // AI will send notifications AFTER determining department
        if (handlingDepartment !== 'AI_PENDING') {
            try {
                const notificationResults = await sendComplaintNotifications({
                    supabase,
                    complaintId: complaint.id,
                    complaintDetails: {
                        type,
                        title: finalTitle,
                        description,
                        location,
                    },
                    handlingDepartment: handlingDepartment,
                    floor: floor,
                });

                console.log('📱 Notification Summary:');
                console.log(`   Floor admins notified: ${notificationResults.floorAdminsCount}`);
                console.log(`   Department admins notified: ${notificationResults.departmentAdminsCount}`);
                console.log(`   Technicians notified: ${notificationResults.techniciansCount}`);
                console.log(`   Total notifications sent: ${notificationResults.totalCount}`);
            } catch (notificationError) {
                console.error('❌ Notification error:', notificationError);
                // Don't fail the complaint submission if notifications fail
            }
        } else {
            console.log('⏳ AI_PENDING - Notifications will be sent after AI determines department');
        }

        // Generate tracking URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://snap2fix.vercel.app';
        const trackingUrl = `${siteUrl}/track/${complaint.id}`;

        // ⚡ TRIGGER AI ROUTING IN BACKGROUND
        // Important: We MUST await this in serverless environment or it won't execute
        if (handlingDepartment === 'AI_PENDING' && specified_problem) {
            console.log('🚀 Triggering AI routing...');
            console.log(`   Complaint ID: ${complaint.id}`);
            console.log(`   PRIMARY: "${specified_problem}"`);
            console.log(`   SECONDARY: "${description?.substring(0, 40) || 'none'}..."`);
            console.log(`   API URL: ${siteUrl}/api/ai-route`);
            
            // Call AI routing API WITH await - serverless functions need this
            // Otherwise the function terminates before the fetch completes
            try {
                const aiResponse = await fetch(`${siteUrl}/api/ai-route`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        complaintId: complaint.id,
                        specifiedProblem: specified_problem, // PRIMARY analysis source
                        mainDescription: description, // SECONDARY/fallback context
                    }),
                });

                const aiData = await aiResponse.json();
                console.log(`🔍 AI route response status: ${aiResponse.status}`);
                console.log('✅ AI routing response:', aiData);
            } catch (err) {
                console.error('❌ AI routing fetch failed:', err);
                console.error('   Error details:', err instanceof Error ? err.message : err);
                // Don't throw - complaint is already saved
                // The ai-route endpoint will handle fallback to Administration
            }

            console.log('✅ AI routing completed');
        }

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface NotificationParams {
    supabase: any;
    complaintId: string;
    complaintDetails: {
        type: string;
        title: string;
        description: string;
        location: string;
    };
    handlingDepartment: string;
    floor: string | null;
}

interface NotificationResults {
    floorAdminsCount: number;
    departmentAdminsCount: number;
    techniciansCount: number;
    totalCount: number;
}

interface NotificationUser {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    department: string;
}

/**
 * Send notifications for new complaints
 * 
 * NOTIFICATION RULES:
 * 1. Floor Admin (Monitoring) - Admin ONLY, no technicians
 *    - Sees all complaints from their floor
 *    - Does NOT have permission to solve
 * 
 * 2. Department Admin (Solving) - Admin + Technicians
 *    - Responsible for solving the complaint
 *    - Technicians also notified to work on it
 * 
 * 3. Special Case: Same person is both floor admin AND department admin
 *    - Receives ONE notification (as solver, not monitor)
 *    - Their technicians also notified
 */
async function sendComplaintNotifications(
    params: NotificationParams
): Promise<NotificationResults> {
    const { supabase, complaintId, complaintDetails, handlingDepartment, floor } = params;
    
    console.log('\n🔔 ═══════════════════════════════════════════════════════');
    console.log('   NOTIFICATION ROUTING STARTED');
    console.log('   ═══════════════════════════════════════════════════════');
    console.log(`   📋 Complaint ID: ${complaintId}`);
    console.log(`   📍 Floor: ${floor || 'N/A'}`);
    console.log(`   🏢 Handling Department: ${handlingDepartment}`);
    console.log(`   🔧 Complaint Type: ${complaintDetails.type}`);
    console.log('   ═══════════════════════════════════════════════════════\n');
    const results: NotificationResults = {
        floorAdminsCount: 0,
        departmentAdminsCount: 0,
        techniciansCount: 0,
        totalCount: 0,
    };

    // Step 1: Get Floor Admins (monitoring only)
    const floorAdmins = floor ? await getFloorAdmins(supabase, floor) : [];
    
    // Step 2: Get Department Admins + Technicians (solving)
    const departmentTeam = await getDepartmentTeam(supabase, handlingDepartment);
    
    // Step 3: Check for overlap (same admin in both roles)
    const floorAdminIds = new Set(floorAdmins.map((a: NotificationUser) => a.id));
    const departmentAdminIds = new Set(
        departmentTeam.filter((u: NotificationUser) => u.role === 'admin').map((u: NotificationUser) => u.id)
    );
    const overlap = [...floorAdminIds].filter(id => departmentAdminIds.has(id));
    
    if (overlap.length > 0) {
        console.log(`⚡ DEDUPLICATION: ${overlap.length} admin(s) appear in BOTH floor and department roles`);
        console.log('   → Will receive notification as SOLVER (with technician access)');
    }
    
    // Step 4: Build notification lists
    const notificationRecipients: Set<string> = new Set();
    
    console.log('\n📊 Building notification recipient list:');
    
    // Add department team (admin + technicians) - they SOLVE the complaint
    departmentTeam.forEach((user: NotificationUser) => {
        notificationRecipients.add(user.id);
        if (user.role === 'admin') {
            results.departmentAdminsCount++;
            console.log(`   ✅ ${user.full_name || user.email} (${user.department} Admin - SOLVER)`);
        } else {
            results.techniciansCount++;
            console.log(`   ✅ ${user.full_name || user.email} (${user.department} Technician)`);
        }
    });
    
    // Add floor admins who are NOT already in department team
    floorAdmins.forEach((admin: NotificationUser) => {
        if (!departmentAdminIds.has(admin.id)) {
            notificationRecipients.add(admin.id);
            results.floorAdminsCount++;
            console.log(`   ✅ ${admin.full_name || admin.email} (Floor ${floor} Admin - MONITOR)`);
        }
    });
    
    // Step 5: Send notifications
    results.totalCount = notificationRecipients.size;
    
    console.log(`\n📱 Sending notifications to ${results.totalCount} recipient(s)...`);
    
    if (results.totalCount > 0) {
        // Send notifications with role-based messaging
        await sendPushNotifications(
            supabase,
            Array.from(notificationRecipients),
            complaintId,
            complaintDetails,
            overlap.length > 0, // hasAdminWithBothRoles
            floorAdmins,
            departmentTeam
        );
    } else {
        console.log('⚠️  NO RECIPIENTS FOUND - No notifications sent!');
        console.log('   Check if users exist with correct roles and departments in database');
    }
    
    // Log details
    console.log('\n📊 Notification Breakdown:');
    if (overlap.length > 0) {
        console.log(`   ⚡ ${overlap.length} admin(s) in BOTH roles (floor + department)`);
        console.log(`      → Notified as SOLVER (with technicians)`);
    }
    if (results.floorAdminsCount > 0) {
        console.log(`   👁️  ${results.floorAdminsCount} floor admin(s) (monitoring only)`);
    }
    if (results.departmentAdminsCount > 0) {
        console.log(`   🛠️  ${results.departmentAdminsCount} department admin(s) (solving)`);
    }
    if (results.techniciansCount > 0) {
        console.log(`   🔧 ${results.techniciansCount} technician(s) (solving)`);
    }
    
    console.log('\n🔔 ═══════════════════════════════════════════════════════');
    console.log('   NOTIFICATION ROUTING COMPLETED');
    console.log('   ═══════════════════════════════════════════════════════\n');
    
    return results;
}

/**
 * Get floor admins (monitoring role only)
 * Maps floor number to department name first
 */
async function getFloorAdmins(supabase: any, floor: string): Promise<NotificationUser[]> {
    // Map floor number to department name (e.g., "1" -> "Civil")
    const floorDepartment = getDepartmentByFloor(floor);
    
    console.log(`🔍 Fetching floor admins: Floor ${floor} → ${floorDepartment} department`);
    
    const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, department')
        .eq('role', 'admin')
        .eq('department', floorDepartment);
    
    if (error) {
        console.error('Failed to fetch floor admins:', error);
        return [];
    }
    
    console.log(`   Found ${data?.length || 0} floor admin(s) in ${floorDepartment}`);
    
    return data || [];
}

/**
 * Get department team (admins + technicians who will solve the complaint)
 */
async function getDepartmentTeam(supabase: any, department: string): Promise<NotificationUser[]> {
    console.log(`🔍 Fetching department team: ${department} department`);
    
    const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, department')
        .in('role', ['admin', 'technician'])
        .eq('department', department);
    
    if (error) {
        console.error('Failed to fetch department team:', error);
        return [];
    }
    
    const admins = data?.filter((u: NotificationUser) => u.role === 'admin') || [];
    const technicians = data?.filter((u: NotificationUser) => u.role === 'technician') || [];
    
    console.log(`   Found ${admins.length} admin(s) and ${technicians.length} technician(s) in ${department}`);
    
    return data || [];
}

/**
 * Notify only floor admins (for AI_PENDING complaints)
 */
async function notifyFloorAdmins(
    supabase: any,
    complaintId: string,
    complaintDetails: any,
    floor: string,
    results: NotificationResults
) {
    const floorAdmins = await getFloorAdmins(supabase, floor);
    
    if (floorAdmins.length > 0) {
        results.floorAdminsCount = floorAdmins.length;
        results.totalCount = floorAdmins.length;
        
        await sendPushNotifications(
            supabase,
            floorAdmins.map((a: NotificationUser) => a.id),
            complaintId,
            complaintDetails,
            false,
            floorAdmins,
            [] // No department team for AI_PENDING
        );
        
        console.log(`   👁️  ${results.floorAdminsCount} floor admin(s) notified (AI determining department...)`);
    }
}

/**
 * Send push notifications via Supabase Edge Function
 * Customizes notification message based on recipient role and responsibilities
 */
async function sendPushNotifications(
    supabase: any,
    userIds: string[],
    complaintId: string,
    complaintDetails: any,
    hasAdminWithBothRoles: boolean,
    floorAdmins: NotificationUser[],
    departmentTeam: NotificationUser[]
) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        // Create sets for quick lookup
        const floorAdminIds = new Set(floorAdmins.map((a: NotificationUser) => a.id));
        const departmentAdminIds = new Set(
            departmentTeam.filter((u: NotificationUser) => u.role === 'admin').map((u: NotificationUser) => u.id)
        );
        const technicianIds = new Set(
            departmentTeam.filter((u: NotificationUser) => u.role === 'technician').map((u: NotificationUser) => u.id)
        );
        
        // Send personalized notifications for each user
        for (const userId of userIds) {
            const isFloorAdmin = floorAdminIds.has(userId);
            const isDepartmentAdmin = departmentAdminIds.has(userId);
            const isTechnician = technicianIds.has(userId);
            
            let notificationTitle = '';
            let notificationBody = '';
            
            // Customize message based on role and responsibilities
            if (isTechnician) {
                // TECHNICIANS: Simple work assignment message
                notificationTitle = '🔧 New Complaint Assigned';
                notificationBody = `${complaintDetails.type}: ${complaintDetails.description.substring(0, 50)}${complaintDetails.description.length > 50 ? '...' : ''}`;
                console.log(`   📲 Technician notification: "${notificationTitle}"`);
            } else if (isFloorAdmin && isDepartmentAdmin) {
                // ADMIN WITH BOTH ROLES: Merged message
                notificationTitle = '🔔 Complaint from Your Floor & Department';
                notificationBody = `${complaintDetails.type}: ${complaintDetails.description.substring(0, 50)}${complaintDetails.description.length > 50 ? '...' : ''}`;
                console.log(`   📲 Merged admin notification: "${notificationTitle}"`);
            } else if (isFloorAdmin) {
                // FLOOR ADMIN ONLY: Monitoring message
                notificationTitle = '👁️ Complaint from Your Floor';
                notificationBody = `${complaintDetails.type}: ${complaintDetails.description.substring(0, 50)}${complaintDetails.description.length > 50 ? '...' : ''}`;
                console.log(`   📲 Floor admin notification: "${notificationTitle}"`);
            } else if (isDepartmentAdmin) {
                // DEPARTMENT ADMIN ONLY: Department responsibility message
                notificationTitle = '🛠️ Complaint for Your Department';
                notificationBody = `${complaintDetails.type}: ${complaintDetails.description.substring(0, 50)}${complaintDetails.description.length > 50 ? '...' : ''}`;
                console.log(`   📲 Department admin notification: "${notificationTitle}"`);
            } else {
                // Fallback (shouldn't happen)
                notificationTitle = '📝 New Complaint Filed';
                notificationBody = `${complaintDetails.type}: ${complaintDetails.description.substring(0, 50)}${complaintDetails.description.length > 50 ? '...' : ''}`;
            }
            
            // Send notification to this user
            const response = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    userIds: [userId], // Send to single user with personalized message
                    title: notificationTitle,
                    body: notificationBody,
                    data: {
                        type: 'new_complaint',
                        complaintId: String(complaintId),
                        status: 'in-progress',
                        title: complaintDetails.title,
                        description: complaintDetails.description,
                        location: complaintDetails.location,
                    },
                }),
            });

            const result = await response.json();
            
            if (!result.success) {
                console.error(`Push notification failed for user ${userId}:`, result);
            }
        }
        
        console.log(`✅ Sent ${userIds.length} personalized notification(s)`);
        
    } catch (error) {
        console.error('Failed to send push notifications:', error);
    }
}
