# Supabase Storage Setup Guide

## Create Storage Bucket

1. Go to your Supabase Dashboard
2. Click on **Storage** in the left sidebar
3. Click **New Bucket**
4. Configure the bucket:
   - **Name**: `complaint-images`
   - **Public bucket**: ✅ **YES** (Check this box)
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png` (optional)

5. Click **Create bucket**

## Set Storage Policies

After creating the bucket, you need to set up access policies:

1. Click on the `complaint-images` bucket
2. Go to **Policies** tab
3. Click **New Policy**

### Policy 1: Allow Public Uploads
```sql
-- Allow anyone to upload images
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'complaint-images');
```

### Policy 2: Allow Public Read Access
```sql
-- Allow anyone to view images
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'complaint-images');
```

### Policy 3: Allow Authenticated Updates (Optional)
```sql
-- Allow authenticated users to update their images
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'complaint-images');
```

### Policy 4: Allow Authenticated Deletes (Optional)
```sql
-- Allow authenticated users to delete their images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'complaint-images');
```

## Quick Setup via SQL

Alternatively, run this SQL in your Supabase SQL Editor:

```sql
-- Create the bucket (if using SQL API)
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true);

-- Create policies
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'complaint-images');

CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'complaint-images');

CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'complaint-images');

CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'complaint-images');
```

## Verify Setup

After setup, test by:
1. Submit a complaint with an image from the web app
2. Check the browser console for upload logs
3. Go to Storage > complaint-images in Supabase to see uploaded files
4. Check the database `complaints` table - `image_url` should have a value

## Troubleshooting

### Images not uploading?
- Make sure the bucket is **public**
- Verify the bucket name is exactly `complaint-images`
- Check that upload policies exist
- Look at browser console and API logs for errors

### Images uploading but not showing?
- Verify the bucket is set to **public**
- Check the `image_url` in the database is correct
- Test the image URL directly in your browser

### Permission denied errors?
- Make sure the storage policies are created
- Verify RLS is enabled on storage.objects
- Check that public access is allowed for INSERT and SELECT
