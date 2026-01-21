/**
 * API Route: POST /api/set-password
 * Sets password for new users created via admin API
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Get admin client to update user password
        const adminClient = getAdminClient();

        // Find user by email
        const { data: users, error: listError } = await adminClient.auth.admin.listUsers();
        
        if (listError) {
            console.error('Failed to list users:', listError);
            return NextResponse.json(
                { success: false, error: 'Failed to find user' },
                { status: 500 }
            );
        }

        const user = users.users.find(u => u.email === email);
        
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Update user password
        const { error: updateError } = await adminClient.auth.admin.updateUserById(
            user.id,
            { password }
        );

        if (updateError) {
            console.error('Failed to update password:', updateError);
            return NextResponse.json(
                { success: false, error: 'Failed to set password' },
                { status: 500 }
            );
        }

        console.log('✅ Password set successfully for user:', email);

        return NextResponse.json({
            success: true,
            message: 'Password set successfully'
        });

    } catch (error) {
        console.error('❌ Set password error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
