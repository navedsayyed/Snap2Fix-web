-- ============================================================================
-- MANUAL ROUTING WEBHOOK
-- Trigger notifications when super_admin manually routes complaint
-- (complaint_type changes from 'Administration' to actual department)
-- ============================================================================

-- This webhook triggers when complaint_type is updated
-- It should call the same notification logic as AI routing

-- Step 1: Create a Supabase webhook in the dashboard:
-- 1. Go to Database > Webhooks
-- 2. Click "Create a new webhook"
-- 3. Configure:
--    - Name: manual-routing-notification
--    - Table: complaints
--    - Events: UPDATE
--    - Type: HTTP Request
--    - Method: POST
--    - URL: https://your-domain.vercel.app/api/webhooks/manual-route
--    - HTTP Headers: 
--        {
--          "Content-Type": "application/json",
--          "Authorization": "Bearer YOUR_WEBHOOK_SECRET"
--        }

-- Step 2: Webhook should only trigger when complaint_type changes
-- Add this condition in the webhook settings:
-- (OLD.complaint_type IS DISTINCT FROM NEW.complaint_type) 
-- AND (OLD.complaint_type = 'Administration' OR OLD.complaint_type = 'AI_PENDING')
-- AND NEW.complaint_type NOT IN ('Administration', 'AI_PENDING')

-- Alternative: Use database function trigger (if webhooks not available)
-- ============================================================================

-- Create function to detect manual routing
CREATE OR REPLACE FUNCTION notify_manual_routing()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    payload JSON;
BEGIN
    -- Only trigger if complaint_type changed from Administration/AI_PENDING to actual department
    IF (OLD.complaint_type IN ('Administration', 'AI_PENDING') 
        AND NEW.complaint_type NOT IN ('Administration', 'AI_PENDING')
        AND OLD.complaint_type IS DISTINCT FROM NEW.complaint_type) THEN
        
        -- Log the manual routing
        RAISE NOTICE 'Manual routing detected: Complaint % updated from % to %', 
            NEW.id, OLD.complaint_type, NEW.complaint_type;
        
        -- Prepare payload for webhook
        payload := json_build_object(
            'type', 'manual_route',
            'complaint_id', NEW.id,
            'old_department', OLD.complaint_type,
            'new_department', NEW.complaint_type,
            'floor', NEW.floor,
            'timestamp', NOW()
        );
        
        -- Call webhook endpoint (requires pg_net extension)
        -- Make sure pg_net is enabled: CREATE EXTENSION IF NOT EXISTS pg_net;
        -- Replace with your actual Vercel URL
        webhook_url := 'https://your-domain.vercel.app/api/webhooks/manual-route';
        
        -- Note: Uncomment below if pg_net extension is available
        -- PERFORM net.http_post(
        --     url := webhook_url,
        --     headers := '{"Content-Type": "application/json"}'::jsonb,
        --     body := payload::jsonb
        -- );
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (if using database function instead of Supabase webhook)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'notify_manual_routing_trigger') THEN
        CREATE TRIGGER notify_manual_routing_trigger
            AFTER UPDATE ON complaints
            FOR EACH ROW
            EXECUTE FUNCTION notify_manual_routing();
    END IF;
END $$;

-- ============================================================================
-- NOTES FOR IMPLEMENTATION:
-- ============================================================================
-- 
-- Option 1 (RECOMMENDED): Use Supabase Webhooks in Dashboard
--   - Easier to configure
--   - No need for pg_net extension
--   - Can retry on failure
--   - Configure as described in Step 1 above
--
-- Option 2: Use Database Trigger + pg_net
--   - Requires pg_net extension: CREATE EXTENSION IF NOT EXISTS pg_net;
--   - Uncomment the PERFORM net.http_post() section above
--   - Less reliable (no automatic retries)
--
-- Option 3 (CURRENT): Call API endpoint directly from mobile app
--   - Mobile app calls: PATCH /api/complaint/[id]/update-department
--   - Most reliable and straightforward
--   - Recommended for production use
--
-- ============================================================================
