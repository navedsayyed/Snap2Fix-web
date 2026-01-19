/**
 * Webhook endpoint called by Supabase trigger when complaint status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('Status update webhook received:', body);

        const { record } = body;
        
        if (!record) {
            return NextResponse.json({ success: false, error: 'No record data' });
        }

        // Get user email and name
        const userEmail = record.user_email;
        const userName = record.user_name || 'User';
        const complaintId = String(record.id);
        const newStatus = record.status;

        if (!userEmail) {
            console.log('No user email found, skipping notification');
            return NextResponse.json({ success: true, message: 'No email to send' });
        }

        // Send status update email
        console.log(`Sending status update email to ${userEmail} for complaint #${complaintId}`);
        
        const emailResult = await sendStatusUpdateEmail(
            userEmail,
            complaintId,
            newStatus,
            userName
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
