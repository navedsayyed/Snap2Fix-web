/**
 * POST /api/verify-otp
 * Validates the submitted OTP against the stored one in Supabase.
 * Deletes OTP row on success. Tracks failed attempts (max 3).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { timingSafeEqual } from 'crypto';

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { success: false, error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const supabase = getAdminClient();

        // Fetch the latest OTP record for this email
        const { data: otpRecord, error: fetchError } = await supabase
            .from('email_otps')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchError || !otpRecord) {
            return NextResponse.json(
                { success: false, error: 'No OTP found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check expiry
        if (new Date(otpRecord.expires_at) < new Date()) {
            await supabase.from('email_otps').delete().eq('id', otpRecord.id);
            return NextResponse.json(
                { success: false, error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Check max attempts
        if (otpRecord.attempts >= MAX_ATTEMPTS) {
            await supabase.from('email_otps').delete().eq('id', otpRecord.id);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Maximum verification attempts reached. Please request a new OTP.',
                },
                { status: 400 }
            );
        }

        // Increment attempt count first
        await supabase
            .from('email_otps')
            .update({ attempts: otpRecord.attempts + 1 })
            .eq('id', otpRecord.id);

        // Validate OTP with constant-time comparison to prevent timing attacks
        const inputBuf = Buffer.from(otp.trim().padEnd(6, '\0'));
        const storedBuf = Buffer.from(otpRecord.otp.padEnd(6, '\0'));
        const isValid =
            otp.trim().length === 6 &&
            otp.trim().length === otpRecord.otp.length &&
            timingSafeEqual(inputBuf, storedBuf);

        if (!isValid) {
            const remainingAttempts = MAX_ATTEMPTS - (otpRecord.attempts + 1);
            return NextResponse.json(
                {
                    success: false,
                    error:
                        remainingAttempts > 0
                            ? `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
                            : 'Invalid OTP. No attempts remaining. Please request a new OTP.',
                },
                { status: 400 }
            );
        }

        // ✅ OTP is correct — delete record and return success
        await supabase.from('email_otps').delete().eq('id', otpRecord.id);

        console.log(`✅ Email verified: ${email}`);

        return NextResponse.json({ success: true, verified: true });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { success: false, error: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
