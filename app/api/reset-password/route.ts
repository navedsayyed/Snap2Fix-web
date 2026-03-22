/**
 * POST /api/reset-password
 * Validates that the email belongs to an existing user,
 * then sends a password reset link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { isValidEmail } from '@/lib/utils';

const DEFAULT_REDIRECT_ORIGIN = 'https://snap2fix.vercel.app';
const MAX_USER_SCAN_PAGES = 20;
const USERS_PER_PAGE = 1000;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const rawEmail = typeof body?.email === 'string' ? body.email : '';
        const email = rawEmail.trim().toLowerCase();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { success: false, error: 'Valid email is required' },
                { status: 400 }
            );
        }

        const adminClient = getAdminClient();

        // Supabase reset API can return success for unknown emails.
        // Scan auth users first so the UI can show a real "user not found" error.
        let userExists = false;

        for (let page = 1; page <= MAX_USER_SCAN_PAGES; page++) {
            const { data, error } = await adminClient.auth.admin.listUsers({
                page,
                perPage: USERS_PER_PAGE,
            });

            if (error) {
                console.error('Failed to list auth users:', error);
                return NextResponse.json(
                    { success: false, error: 'Unable to verify email account right now. Please try again.' },
                    { status: 500 }
                );
            }

            const users = data?.users ?? [];
            userExists = users.some(user => user.email?.toLowerCase() === email);

            if (userExists || users.length < USERS_PER_PAGE) {
                break;
            }
        }

        if (!userExists) {
            return NextResponse.json(
                { success: false, error: 'No account found with this email address.' },
                { status: 404 }
            );
        }

        const origin = request.headers.get('origin')?.trim();
        const redirectOrigin = origin && /^https?:\/\//.test(origin)
            ? origin
            : DEFAULT_REDIRECT_ORIGIN;
        const redirectTo = `${redirectOrigin}/update-password`;

        const { error: resetError } = await adminClient.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (resetError) {
            console.error('Failed to send password reset email:', resetError);
            return NextResponse.json(
                { success: false, error: 'Failed to send reset email. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reset password API error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
