/**
 * API Route: POST /api/ai-route
 * Background AI routing for "General Other" complaints
 * This runs AFTER user sees success - no waiting!
 * 
 * Analyzes:
 *   PRIMARY: "Specify Problem Type" field (specifiedProblem)
 *   SECONDARY: "Description" field (mainDescription) - used if PRIMARY is unclear
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { analyzeComplaintWithAI, getConfidenceThreshold } from '@/lib/gemini';
import { getDepartmentByIssueType } from '@/lib/departmentMapping';

export async function POST(request: NextRequest) {
    let complaintId: string | undefined;
    
    try {
        const body = await request.json();
        const { complaintId: id, specifiedProblem, mainDescription, imageUrl } = body;
        complaintId = id;

        console.log('🤖 AI Route called with:', { complaintId, specifiedProblem: specifiedProblem?.substring(0, 50), mainDescription: mainDescription?.substring(0, 50) });

        if (!complaintId || !specifiedProblem) {
            console.error('❌ Missing required fields:', { complaintId: !!complaintId, specifiedProblem: !!specifiedProblem });
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log(`🤖 Starting AI analysis for complaint #${complaintId}...`);
        console.log(`   PRIMARY: "${specifiedProblem}"`);
        if (mainDescription) {
            console.log(`   SECONDARY: "${mainDescription.substring(0, 50)}${mainDescription.length > 50 ? '...' : ''}"`);
        }

        // Step 1: Analyze with Gemini AI (PRIMARY: specified problem, SECONDARY: main description)
        const aiResult = await analyzeComplaintWithAI(specifiedProblem, mainDescription, null);
        
        console.log(`   Department: ${aiResult.department}`);
        console.log(`   Confidence: ${aiResult.confidence}%`);
        console.log(`   Reasoning: ${aiResult.reasoning}`);

        // Step 2: Check if confidence meets threshold
        const threshold = getConfidenceThreshold();
        const supabase = getAdminClient();

        if (aiResult.confidence >= threshold) {
            // High confidence - update complaint type
            console.log(`✅ Confidence ${aiResult.confidence}% >= ${threshold}% threshold - Updating complaint`);

            const { error: updateError } = await supabase
                .from('complaints')
                .update({
                    complaint_type: aiResult.department,
                    ai_routed: true,
                    ai_confidence: aiResult.confidence,
                    ai_reasoning: aiResult.reasoning,
                    ai_analyzed_at: new Date().toISOString()
                })
                .eq('id', complaintId);

            if (updateError) {
                console.error('❌ Failed to update complaint:', updateError);
                return NextResponse.json(
                    { success: false, error: 'Database update failed' },
                    { status: 500 }
                );
            }

            // Step 3: Notify the department admin
            await notifyDepartmentAdmin(supabase, complaintId, aiResult.department);

            console.log(`🎯 Complaint #${complaintId} routed to ${aiResult.department} department`);

            return NextResponse.json({
                success: true,
                department: aiResult.department,
                confidence: aiResult.confidence,
                reasoning: aiResult.reasoning
            });

        } else {
            // Low confidence - keep as Administration for manual review
            console.log(`⚠️ Confidence ${aiResult.confidence}% < ${threshold}% threshold - Sending to Administration`);

            const { error: updateError } = await supabase
                .from('complaints')
                .update({
                    complaint_type: 'Administration',
                    ai_routed: false,
                    ai_confidence: aiResult.confidence,
                    ai_reasoning: `Low confidence: ${aiResult.reasoning}`,
                    ai_analyzed_at: new Date().toISOString()
                })
                .eq('id', complaintId);

            if (updateError) {
                console.error('❌ Failed to update complaint:', updateError);
            }

            // Notify Administration for manual routing
            await notifyDepartmentAdmin(supabase, complaintId, 'Administration');

            return NextResponse.json({
                success: true,
                department: 'Administration',
                confidence: aiResult.confidence,
                reasoning: 'Low confidence - requires manual review',
                lowConfidence: true
            });
        }

    } catch (error) {
        console.error('❌ AI routing error:', error);
        console.error('Error details:', error instanceof Error ? error.stack : JSON.stringify(error));
        
        // On error, set complaint to Administration as fallback
        if (complaintId) {
            try {
                const supabase = getAdminClient();
                
                console.log(`🔄 Falling back to Administration for complaint #${complaintId}`);
                
                const { error: updateError } = await supabase
                    .from('complaints')
                    .update({
                        complaint_type: 'Administration',
                        ai_routed: false,
                        ai_confidence: 0,
                        ai_reasoning: `AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        ai_analyzed_at: new Date().toISOString()
                    })
                    .eq('id', complaintId);

                if (updateError) {
                    console.error('❌ Fallback database update failed:', updateError);
                } else {
                    console.log('✅ Complaint updated to Administration');
                    // Notify Administration
                    await notifyDepartmentAdmin(supabase, complaintId, 'Administration');
                }
            } catch (fallbackError) {
                console.error('❌ Fallback update failed:', fallbackError);
            }
        }

        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'AI routing failed',
                fallback: 'Administration'
            },
            { status: 500 }
        );
    }
}

/**
 * Notify department admin about new complaint
 * This is called AFTER AI determines the department
 */
async function notifyDepartmentAdmin(
    supabase: any,
    complaintId: string,
    department: string
) {
    try {
        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   AI ROUTING - NOTIFYING TEAM`);
        console.log(`   ═══════════════════════════════════════════════════════`);
        console.log(`   🏢 Department: ${department}`);
        console.log(`   📋 Complaint ID: ${complaintId}`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

        // Step 1: Get complaint details including floor
        const { data: complaint } = await supabase
            .from('complaints')
            .select('title, description, type, location, floor')
            .eq('id', complaintId)
            .single();

        if (!complaint) {
            console.error('❌ Complaint not found for notification');
            return;
        }

        let totalNotified = 0;

        // Step 2: If Administration (low confidence) → Notify only super_admin
        if (department === 'Administration') {
            console.log('⚠️  Low confidence - AI could not determine department');
            console.log('🔍 Fetching super_admin users for manual review...');
            
            const { data: superAdmins, error: adminError } = await supabase
                .from('users')
                .select('id, email, full_name, role, fcm_token')
                .eq('role', 'super_admin');

            if (adminError || !superAdmins || superAdmins.length === 0) {
                console.log('⚠️  No super_admin users found');
                return;
            }

            console.log(`   Found ${superAdmins.length} super_admin(s)`);
            console.log(`\n📊 Notification Recipients (Manual Review Required):`);
            
            superAdmins.forEach((admin: any) => {
                console.log(`   ✅ ${admin.full_name || admin.email} (Super Admin)`);
            });

            // Send notifications to super admins
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            for (const admin of superAdmins) {
                const notificationTitle = '⚠️ AI Needs Help - Manual Review Required';
                const notificationBody = `${complaint.type}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
                
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
                            type: 'ai_low_confidence',
                            complaintId: String(complaintId),
                            department: 'Administration',
                            status: 'in-progress',
                            title: complaint.title,
                            description: complaint.description,
                            location: complaint.location,
                        },
                    }),
                });

                const result = await pushResponse.json();
                if (result.success) {
                    totalNotified++;
                }
            }

            console.log(`\n✅ Successfully notified ${totalNotified} super_admin(s) for manual review`);
            console.log(`   📊 No floor admin or department team notified (requires manual assignment)`);
            console.log(`\n📢 ═══════════════════════════════════════════════════════\n`);
            return;
        }

        // Step 3: High confidence → Notify floor admin + department team
        console.log('✅ High confidence - AI determined department successfully');
        
        // 3a. Notify floor admin (if floor exists)
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
                
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                for (const admin of floorAdmins) {
                    const notificationTitle = '👁️ New Complaint on Your Floor';
                    const notificationBody = `Floor ${complaint.floor}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
                    
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
                                type: 'floor_monitoring',
                                complaintId: String(complaintId),
                                floor: complaint.floor,
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

        // 3b. Notify department team (admins + technicians)
        console.log(`\n🔍 Fetching ${department} department team (admins + technicians)...`);
        
        const { data: departmentTeam, error: teamError } = await supabase
            .from('users')
            .select('id, email, full_name, role, department, fcm_token')
            .in('role', ['admin', 'technician'])
            .eq('department', department);

        if (teamError || !departmentTeam || departmentTeam.length === 0) {
            console.log(`⚠️  No users found in ${department} department`);
            console.log(`\n📢 ═══════════════════════════════════════════════════════\n`);
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
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        let departmentNotified = 0;

        for (const user of departmentTeam) {
            const isAdmin = user.role === 'admin';
            const isTechnician = user.role === 'technician';
            
            let notificationTitle = '';
            let notificationBody = '';
            
            // Customize message based on role
            if (isTechnician) {
                notificationTitle = '🔧 New Complaint Assigned';
                notificationBody = `${complaint.type}: ${complaint.description.substring(0, 50)}${complaint.description.length > 50 ? '...' : ''}`;
            } else if (isAdmin) {
                notificationTitle = '🤖 AI-Routed Complaint for Your Department';
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
                        type: 'ai_routed_complaint',
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
        console.log(`\n📢 ═══════════════════════════════════════════════════════`);
        console.log(`   AI ROUTING - NOTIFICATION COMPLETE`);
        console.log(`   ═══════════════════════════════════════════════════════\n`);

    } catch (error) {
        console.error('❌ Failed to notify team:', error);
        // Don't throw - notification failure shouldn't fail the routing
    }
}
