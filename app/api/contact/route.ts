/**
 * Contact Form API Route
 * Handles contact form submissions:
 * 1. Validates the form data
 * 2. Stores the message in the contact_messages table (Supabase)
 * 3. Sends a confirmation email to the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { sendContactConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // --- Validation ---
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Please fill in all required fields (Name, Email, Subject, Message).' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
                { status: 400 }
            );
        }

        // Subject label mapping
        const subjectLabels: Record<string, string> = {
            general: 'General Inquiry',
            support: 'Technical Support',
            complaint: 'Complaint Issue',
            partnership: 'Partnership',
            feedback: 'Feedback',
        };

        const subjectLabel = subjectLabels[subject] || subject;

        // --- Store in Database ---
        const adminClient = getAdminClient();

        const { data: contactMessage, error: dbError } = await adminClient
            .from('contact_messages')
            .insert([
                {
                    full_name: name,
                    email: email,
                    phone: phone || null,
                    subject: subjectLabel,
                    message: message,
                    status: 'unread',
                },
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Database error storing contact message:', dbError);
            return NextResponse.json(
                { error: 'Failed to save your message. Please try again later.' },
                { status: 500 }
            );
        }

        // --- Send Confirmation Email to User ---
        const emailResult = await sendContactConfirmationEmail({
            email,
            userName: name,
            subject: subjectLabel,
            message,
            messageId: contactMessage.id,
        });

        if (!emailResult.success) {
            console.error('Failed to send confirmation email, but message was saved.');
            // Still return success since the message was saved
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Your message has been sent successfully! A confirmation email has been sent to your inbox.',
                id: contactMessage.id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form API error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
