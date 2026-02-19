/**
 * API Route: PATCH /api/complaint/[id]/update-status
 * Updates complaint status and sends email notification
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendCompletionEmail } from '@/lib/email';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, completed_notes, proof_image } = body;

        if (!status) {
            return NextResponse.json(
                { success: false, error: 'Status is required' },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {
            status,
            updated_at: new Date().toISOString(),
        };

        // Add timestamps based on status
        if (status === 'assigned' && !updateData.assigned_at) {
            updateData.assigned_at = new Date().toISOString();
        } else if (status === 'in-progress' && !updateData.started_at) {
            updateData.started_at = new Date().toISOString();
        } else if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
            if (completed_notes) updateData.completed_notes = completed_notes;
            if (proof_image) updateData.proof_image = proof_image;
        }

        // Update complaint in database
        const { data: complaint, error: updateError } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                users:user_id (
                    email,
                    full_name
                )
            `)
            .single();

        if (updateError) {
            console.error('Database update error:', updateError);
            return NextResponse.json(
                { success: false, error: 'Failed to update complaint' },
                { status: 500 }
            );
        }

        if (!complaint) {
            return NextResponse.json(
                { success: false, error: 'Complaint not found' },
                { status: 404 }
            );
        }

        // Send email notification ONLY when complaint is completed
        // Skip intermediate status updates (assigned, in-progress, etc.)
        if (status === 'completed' && complaint.users?.email) {
            try {
                console.log(`Sending COMPLETION email to: ${complaint.users.email}`);
                
                const emailResult = await sendCompletionEmail(
                    complaint.users.email,
                    String(complaint.id),
                    complaint.users.full_name || 'User',
                    {
                        title: complaint.title,
                        floor: complaint.floor || 'N/A',
                        room_number: complaint.class || 'N/A',
                        priority: complaint.priority || 'Medium',
                        description: complaint.description || '',
                    },
                    complaint.completed_notes || undefined
                );

                if (emailResult.success) {
                    console.log('✅ Completion email sent successfully');
                } else {
                    console.error('❌ Failed to send completion email');
                }
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                // Don't fail the status update if email fails
            }
        } else {
            console.log(`⏭️ Skipping email notification for status: ${status}`);
        }

        return NextResponse.json({
            success: true,
            complaint: {
                id: complaint.id,
                status: complaint.status,
                updated_at: complaint.updated_at,
            },
        });

    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
