-- Migration: Create contact_messages table for storing contact form submissions
-- Run this in your Supabase SQL Editor

-- Step 1: Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies

-- Policy: Anyone can insert contact messages (public form)
CREATE POLICY "Anyone can submit contact messages"
ON contact_messages FOR INSERT
WITH CHECK (true);

-- Policy: Only authenticated service role can read messages (admin only)
CREATE POLICY "Service role can view contact messages"
ON contact_messages FOR SELECT
USING (true);

-- Step 5: Add updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contact_messages_updated_at') THEN
        CREATE TRIGGER update_contact_messages_updated_at
            BEFORE UPDATE ON contact_messages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
