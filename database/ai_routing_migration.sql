-- AI Routing Migration
-- Add AI-related fields to complaints table for intelligent routing
-- Run this in your Supabase SQL Editor

-- Add AI routing fields
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS ai_routed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_confidence INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_reasoning TEXT,
ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMP WITH TIME ZONE;

-- Create index for AI routed complaints
CREATE INDEX IF NOT EXISTS idx_complaints_ai_routed ON complaints(ai_routed);

-- Create index for AI pending complaints
CREATE INDEX IF NOT EXISTS idx_complaints_ai_pending ON complaints(complaint_type) 
WHERE complaint_type = 'AI_PENDING';

-- Add comment
COMMENT ON COLUMN complaints.ai_routed IS 'Whether complaint was routed using AI (true) or manual logic (false)';
COMMENT ON COLUMN complaints.ai_confidence IS 'AI confidence score (0-100) for department assignment';
COMMENT ON COLUMN complaints.ai_reasoning IS 'AI explanation for department choice';
COMMENT ON COLUMN complaints.ai_analyzed_at IS 'Timestamp when AI analysis completed';
