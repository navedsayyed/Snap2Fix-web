import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user from token
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch profile data from users table
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id, email, full_name, phone, role, department')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Profile fetch error:', profileError);
            // Return user email at minimum
            return NextResponse.json({
                email: user.email,
                full_name: '',
                phone: '',
                role: 'user'
            });
        }

        return NextResponse.json({
            email: profile.email || user.email,
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            role: profile.role || 'user',
            department: profile.department || null
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
