-- Migration: Add user authentication support to complaints table
-- Run this in your Supabase SQL Editor

-- Step 1: Add user_id column to complaints table
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Step 2: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);

-- Step 3: Enable Row Level Security (RLS) on complaints table
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies

-- Policy: Anyone can insert complaints (for guest submissions)
CREATE POLICY "Anyone can submit complaints" 
ON complaints FOR INSERT 
WITH CHECK (true);

-- Policy: Anyone can read complaints (for tracking)
CREATE POLICY "Anyone can view complaints" 
ON complaints FOR SELECT 
USING (true);

-- Policy: Users can update their own complaints
CREATE POLICY "Users can update own complaints" 
ON complaints FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own complaints
CREATE POLICY "Users can delete own complaints" 
ON complaints FOR DELETE 
USING (auth.uid() = user_id);

-- Step 5: Update existing API route to include user_id
-- Note: You'll need to update your API routes to set user_id when creating complaints

-- Optional: Add created_at and updated_at triggers if not already present
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_complaints_updated_at') THEN
        CREATE TRIGGER update_complaints_updated_at
            BEFORE UPDATE ON complaints
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
