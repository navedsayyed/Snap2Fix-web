/**
 * API Route: PATCH /api/complaint/[id]/update-department
 * Updates complaint_type when super_admin manually routes complaint
 * Sends notifications to floor admin, department admin, and technicians
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { department } = body;

        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   MANUAL ROUTING - SUPER ADMIN`);
        console.log(`   ═══════════════════════════════════════════════════════`);
        console.log(`   📋 Complaint ID: ${id}`);
        console.log(`   🏢 New Department: ${department}`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

        if (!department) {
            return NextResponse.json(
                { success: false, error: 'Department is required' },
                { status: 400 }
            );
        }

        const supabase = getAdminClient();

        // Step 1: Update complaint_type in database
        const { data: complaint, error: updateError } = await supabase
            .from('complaints')
            .update({
                complaint_type: department,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select('title, description, type, location, floor')
            .single();

        if (updateError || !complaint) {
            console.error('❌ Failed to update complaint:', updateError);
            return NextResponse.json(
                { success: false, error: 'Failed to update complaint' },
                { status: 500 }
            );
        }

        console.log('✅ Complaint type updated in database');

        // Step 2: Send notifications to floor admin + department team
        await notifyTeamAfterManualRouting(supabase, id, department, complaint);

        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   MANUAL ROUTING - COMPLETE`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

        return NextResponse.json({
            success: true,
            complaint: {
                id: id,
                complaint_type: department,
            },
        });

    } catch (error) {
        console.error('❌ Update department error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Notify floor admin + department team after super_admin manually routes complaint
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
            console.log(`\n🏢 Notifying floor ${complaint.floor} admin (monitoring)...`);
            
            const { data: floorAdmins, error: floorError } = await supabase
                .from('users')
                .select('id, email, full_name, role, floor, fcm_token')
                .eq('role', 'admin')
                .eq('floor', complaint.floor);

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
        // Don't throw - notification failure shouldn't fail the update
    }
}
