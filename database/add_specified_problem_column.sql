-- Migration: Add specified_problem column for "Specify Problem Type" field
-- This separates user-specified problem from the title
-- Run this in your Supabase SQL Editor

-- Add new column for the "Specify Problem Type" field
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS specified_problem TEXT;

-- Create index for searching specified problems
CREATE INDEX IF NOT EXISTS idx_complaints_specified_problem 
ON complaints(specified_problem);

-- Add comment explaining the column
COMMENT ON COLUMN complaints.specified_problem IS 'User-specified problem type from the form (e.g., "Projector won''t turn on"). AI analyzes this field for General Other complaints.';

-- Optional: Migrate existing title data to specified_problem if needed
-- UPDATE complaints 
-- SET specified_problem = title 
-- WHERE specified_problem IS NULL;
