/**
 * Supabase Client Configuration
 * Provides a singleton instance of the Supabase client
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // Web app doesn't need session persistence
    },
});

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param path - The path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
    file: File,
    bucket: string = 'complaint-images',
    pathPrefix: string = 'web'
): Promise<{ url: string | null; error: Error | null }> {
    try {
        const timestamp = Date.now();
        const fileName = `${pathPrefix}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            return { url: null, error };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return { url: publicUrl, error: null };
    } catch (error) {
        console.error('Upload exception:', error);
        return { url: null, error: error as Error };
    }
}

/**
 * Insert a new complaint into the database
 */
export async function insertComplaint(complaintData: any) {
    const { data, error } = await supabase
        .from('complaints')
        .insert([complaintData])
        .select()
        .single();

    return { data, error };
}

/**
 * Fetch a complaint by ID
 */
export async function getComplaintById(id: string) {
    const { data, error } = await supabase
        .from('complaints')
        .select(`
      *,
      technician:users!technician_id(
        full_name,
        email
      )
    `)
        .eq('id', id)
        .single();

    return { data, error };
}

/**
 * Subscribe to real-time updates for a complaint
 */
export function subscribeToComplaint(
    complaintId: string,
    callback: (payload: any) => void
) {
    const channel = supabase
        .channel(`complaint-${complaintId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'complaints',
                filter: `id=eq.${complaintId}`,
            },
            callback
        )
        .subscribe();

    return channel;
}
