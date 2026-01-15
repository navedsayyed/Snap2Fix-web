/**
 * Authentication Helper Functions
 * Provides utilities for user authentication using Supabase Auth
 */

import { supabase } from './supabase';

export interface User {
    id: string;
    email: string;
    name?: string;
    created_at: string;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    });

    if (error) throw error;
    return data;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            // Don't log "Auth session missing" as it's expected when not logged in
            if (!error.message?.includes('Auth session missing')) {
                console.error('Auth error:', error.message);
            }
            return null;
        }
        return user;
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
}

/**
 * Get user session
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
}
