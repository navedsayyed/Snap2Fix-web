/**
 * API Route: GET /api/complaint/[id]
 * Fetches complaint details by ID for tracking page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getComplaintById } from '@/lib/supabase';
import { TimelineEvent } from '@/lib/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Fetch complaint from database
        const { data: complaint, error } = await getComplaintById(id);

        if (error) {
            console.error('Database fetch error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch complaint' },
                { status: 500 }
            );
        }

        if (!complaint) {
            return NextResponse.json(
                { success: false, error: 'Complaint not found' },
                { status: 404 }
            );
        }

        // Build timeline from complaint data
        const timeline: TimelineEvent[] = [];

        // 1. Submitted
        timeline.push({
            status: 'Submitted',
            timestamp: complaint.created_at,
            description: 'Complaint submitted and awaiting review',
        });

        // 2. Assigned (if assigned)
        if (complaint.assigned_at && complaint.technician_id) {
            timeline.push({
                status: 'Assigned',
                timestamp: complaint.assigned_at,
                description: 'Complaint assigned to technician',
                technician: complaint.technician ? {
                    name: complaint.technician.full_name,
                } : undefined,
            });
        }

        // 3. In Progress (if started)
        if (complaint.started_at) {
            timeline.push({
                status: 'In Progress',
                timestamp: complaint.started_at,
                description: 'Work has started on this complaint',
            });
        }

        // 4. Completed (if completed)
        if (complaint.completed_at) {
            timeline.push({
                status: 'Completed',
                timestamp: complaint.completed_at,
                description: 'Complaint has been resolved',
            });
        }

        // Prepare response data
        const responseData = {
            id: complaint.id,
            title: complaint.title,
            description: complaint.description,
            status: complaint.status,
            priority: complaint.priority,
            floor: complaint.floor,
            room_number: complaint.room_number,
            department: complaint.department,
            // Support multiple field name variations for images
            // Check complaint_images table first, then fallback to image field
            image_url: complaint.complaint_images?.[0]?.url || complaint.image_url || complaint.image || null,
            proof_image: complaint.proof_image || complaint.completion_image_url || null,
            completed_notes: complaint.completed_notes || complaint.completion_notes || null,
            created_at: complaint.created_at,
            updated_at: complaint.updated_at,
            assigned_at: complaint.assigned_at,
            started_at: complaint.started_at,
            completed_at: complaint.completed_at,
            user_name: complaint.user_name,
            user_email: complaint.user_email,
            created_via: complaint.created_via,
            technician: complaint.technician ? {
                name: complaint.technician.full_name,
                email: complaint.technician.email,
            } : null,
            timeline,
        };

        return NextResponse.json({
            success: true,
            complaint: responseData,
        });

    } catch (error) {
        console.error('Get complaint error:', error);
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
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
