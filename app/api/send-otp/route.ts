/**
 * POST /api/send-otp
 * Generates a 6-digit OTP, stores it in Supabase, and sends it via email.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { sendOtpEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Valid email is required' },
                { status: 400 }
            );
        }

        const supabase = getAdminClient();

        // Rate limiting: check if an OTP was requested in the last 60 seconds
        const { data: recentOtp } = await supabase
            .from('email_otps')
            .select('created_at')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (recentOtp) {
            const createdAt = new Date(recentOtp.created_at).getTime();
            const now = Date.now();
            const secondsElapsed = (now - createdAt) / 1000;

            if (secondsElapsed < 60) {
                const waitSeconds = Math.ceil(60 - secondsElapsed);
                return NextResponse.json(
                    {
                        success: false,
                        error: `Please wait ${waitSeconds}s before requesting another OTP`,
                    },
                    { status: 429 }
                );
            }
        }

        // Delete any existing OTPs for this email
        await supabase.from('email_otps').delete().eq('email', email);

        // Generate secure 6-digit OTP
        const otp = String(crypto.randomInt(100000, 999999));

        // Store OTP with 5-minute expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        const { error: insertError } = await supabase.from('email_otps').insert({
            email,
            otp,
            expires_at: expiresAt,
            attempts: 0,
        });

        if (insertError) {
            console.error('Failed to store OTP:', insertError);
            return NextResponse.json(
                { success: false, error: 'Failed to generate OTP. Please try again.' },
                { status: 500 }
            );
        }

        // Send OTP via email
        const emailResult = await sendOtpEmail({ email, otp });

        if (!emailResult.success) {
            // Clean up the OTP record if email failed
            await supabase.from('email_otps').delete().eq('email', email);
            return NextResponse.json(
                { success: false, error: 'Failed to send OTP email. Please try again.' },
                { status: 500 }
            );
        }

        console.log(`✅ OTP sent to ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
