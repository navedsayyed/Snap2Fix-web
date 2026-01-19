/**
 * Webhook endpoint called by Supabase trigger when complaint status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('Status update webhook received:', JSON.stringify(body));

        const { record } = body;
        
        if (!record) {
            return NextResponse.json({ success: false, error: 'No record data' });
        }

        const complaintId = String(record.id);
        const newStatus = record.status;
        const userId = record.user_id;

        console.log(`Complaint #${complaintId} status changed to: ${newStatus}`);

        if (!userId) {
            console.log('No user_id found, skipping notification');
            return NextResponse.json({ success: true, message: 'No user to notify' });
        }

        // Fetch user information from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('email, full_name')
            .eq('id', userId)
            .single();

        if (userError || !user) {
            console.error('Failed to fetch user:', userError);
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        if (!user.email) {
            console.log('No user email found, skipping notification');
            return NextResponse.json({ success: true, message: 'No email to send' });
        }

        // Send status update email
        console.log(`Sending status update email to ${user.email} for complaint #${complaintId}`);
        
        const emailResult = await sendStatusUpdateEmail(
            user.email,
            complaintId,
            newStatus,
            user.full_name || 'User'
        );

        if (emailResult.success) {
            console.log('✅ Status update email sent successfully');
            return NextResponse.json({ success: true, message: 'Email sent' });
        } else {
            console.error('❌ Failed to send email:', emailResult.error);
            return NextResponse.json({ success: false, error: emailResult.error });
        }

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ success: false, error: 'Internal error' });
    }
}
