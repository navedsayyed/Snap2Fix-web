/**
 * API Route: POST /api/webhooks/manual-route
 * Webhook triggered when super_admin manually updates complaint_type
 * from 'Administration' to an actual department (Civil, Electrical, etc.)
 * 
 * This sends notifications to:
 * 1. Floor admin (monitoring)
 * 2. Department admin (solving)
 * 3. Technicians (working)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { getDepartmentByFloor } from '@/lib/departmentMapping';

export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret (optional but recommended)
        const authHeader = request.headers.get('authorization');
        const expectedSecret = process.env.WEBHOOK_SECRET;
        
        if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
            console.error('❌ Unauthorized webhook request');
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payload = await request.json();
        const { type, record } = payload;

        // Handle Supabase webhook format
        const complaintId = record?.id || payload.complaint_id;
        const newDepartment = record?.complaint_type || payload.new_department;
        const oldDepartment = record?.old?.complaint_type || payload.old_department;

        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   WEBHOOK - MANUAL ROUTING DETECTED`);
        console.log(`   ═══════════════════════════════════════════════════════`);
        console.log(`   📋 Complaint ID: ${complaintId}`);
        console.log(`   🔄 Department Changed: ${oldDepartment} → ${newDepartment}`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

        // Validate payload
        if (!complaintId || !newDepartment) {
            console.error('❌ Missing required fields:', { complaintId, newDepartment });
            return NextResponse.json(
                { success: false, error: 'Missing complaint_id or new_department' },
                { status: 400 }
            );
        }

        // Check if this is a manual routing (from Administration/AI_PENDING to actual department)
        const isManualRouting = 
            (oldDepartment === 'Administration' || oldDepartment === 'AI_PENDING') &&
            !['Administration', 'AI_PENDING'].includes(newDepartment);

        if (!isManualRouting) {
            console.log('⏭️ Not a manual routing event - skipping notifications');
            return NextResponse.json({ 
                success: true, 
                message: 'Not a manual routing event' 
            });
        }

        const supabase = getAdminClient();

        // Fetch complaint details including floor
        const { data: complaint, error: complaintError } = await supabase
            .from('complaints')
            .select('title, description, type, location, floor')
            .eq('id', complaintId)
            .single();

        if (complaintError || !complaint) {
            console.error('❌ Complaint not found:', complaintError);
            return NextResponse.json(
                { success: false, error: 'Complaint not found' },
                { status: 404 }
            );
        }

        // Send notifications to floor admin + department team
        await notifyTeamAfterManualRouting(supabase, complaintId, newDepartment, complaint);

        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   WEBHOOK - MANUAL ROUTING COMPLETE`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

        return NextResponse.json({
            success: true,
            message: 'Notifications sent',
            notified_for: {
                complaint_id: complaintId,
                department: newDepartment
            }
        });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}

/**
 * Notify floor admin + department team after manual routing
 */
async function notifyTeamAfterManualRouting(
    supabase: any,
    complaintId: string,
    department: string,
    complaint: any
) {
    try {
        console.log('\n📲 Sending notifications...');

        let totalNotified = 0;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Step 1: Notify floor admin (if floor exists)
        let floorAdminCount = 0;
        if (complaint.floor) {
            // Map floor number to department name (e.g., "1" -> "Civil")
            const floorDepartment = getDepartmentByFloor(complaint.floor);
            
            console.log(`\n🏢 Notifying floor ${complaint.floor} admin (monitoring)...`);
            console.log(`   Floor ${complaint.floor} → ${floorDepartment} department`);
            
            const { data: floorAdmins, error: floorError } = await supabase
                .from('users')
                .select('id, email, full_name, role, department, fcm_token')
                .eq('role', 'admin')
                .eq('department', floorDepartment);

            if (!floorError && floorAdmins && floorAdmins.length > 0) {
                console.log(`   Found ${floorAdmins.length} floor admin(s)`);

                for (const admin of floorAdmins) {
                    const notificationTitle = '👁️ Complaint Manually Routed on Your Floor';
                    const notificationBody = `Routed to ${department}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
                    
                    const pushResponse = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${supabaseKey}`,
                        },
                        body: JSON.stringify({
                            userIds: [admin.id],
                            title: notificationTitle,
                            body: notificationBody,
                            data: {
                                type: 'manual_route_floor',
                                complaintId: String(complaintId),
                                floor: complaint.floor,
                                department: department,
                                status: 'in-progress',
                                title: complaint.title,
                                description: complaint.description,
                                location: complaint.location,
                            },
                        }),
                    });

                    const result = await pushResponse.json();
                    if (result.success) {
                        floorAdminCount++;
                    }
                }
                
                console.log(`   ✅ Notified ${floorAdminCount} floor admin(s)`);
            }
        }

        // Step 2: Notify department team (admins + technicians)
        console.log(`\n🔍 Fetching ${department} department team (admins + technicians)...`);
        
        const { data: departmentTeam, error: teamError } = await supabase
            .from('users')
            .select('id, email, full_name, role, department, fcm_token')
            .in('role', ['admin', 'technician'])
            .eq('department', department);

        if (teamError || !departmentTeam || departmentTeam.length === 0) {
            console.log(`⚠️  No users found in ${department} department`);
            return;
        }

        const admins = departmentTeam.filter((u: any) => u.role === 'admin');
        const technicians = departmentTeam.filter((u: any) => u.role === 'technician');
        
        console.log(`   Found ${admins.length} admin(s) and ${technicians.length} technician(s)`);
        console.log(`\n📊 Notification Recipients:`);
        
        departmentTeam.forEach((user: any) => {
            const roleLabel = user.role === 'admin' ? 'Admin - SOLVER' : 'Technician';
            console.log(`   ✅ ${user.full_name || user.email} (${department} ${roleLabel})`);
        });

        // Send personalized push notifications to department team
        let departmentNotified = 0;

        for (const user of departmentTeam) {
            const isAdmin = user.role === 'admin';
            const isTechnician = user.role === 'technician';
            
            let notificationTitle = '';
            let notificationBody = '';
            
            // Customize message based on role
            if (isTechnician) {
                notificationTitle = '🔧 New Complaint Assigned by Admin';
                notificationBody = `${complaint.type}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
            } else if (isAdmin) {
                notificationTitle = '📋 Complaint Manually Routed to Your Department';
                notificationBody = `${complaint.type}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
            }
            
            // Send notification to this user
            const pushResponse = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    userIds: [user.id],
                    title: notificationTitle,
                    body: notificationBody,
                    data: {
                        type: 'manual_route_department',
                        complaintId: String(complaintId),
                        department: department,
                        status: 'in-progress',
                        title: complaint.title,
                        description: complaint.description,
                        location: complaint.location,
                    },
                }),
            });

            const result = await pushResponse.json();
            
            if (result.success) {
                departmentNotified++;
            }
        }

        totalNotified = floorAdminCount + departmentNotified;

        console.log(`\n✅ Successfully notified ${totalNotified} users total`);
        console.log(`   📊 Breakdown:`);
        console.log(`      • ${floorAdminCount} floor admin(s) (monitoring)`);
        console.log(`      • ${admins.length} department admin(s) (solving)`);
        console.log(`      • ${technicians.length} technician(s) (working)`);

    } catch (error) {
        console.error('❌ Failed to notify team:', error);
        // Don't throw - notification failure shouldn't fail the webhook
    }
}
