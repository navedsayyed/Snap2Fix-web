-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to check your notification setup
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 1: Check if you have admin users
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '👨‍💼 ADMIN USERS' as type,
    email, 
    full_name, 
    role, 
    department,
    created_at
FROM users 
WHERE role = 'admin'
ORDER BY department;

-- Expected: 6 admins (Civil, Electrical, Mechanical, IT, Housekeeping, First Year)
-- If you see 0 rows, you need to create admin accounts!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 2: Check if you have technician users
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '🔧 TECHNICIAN USERS' as type,
    email, 
    full_name, 
    role, 
    department,
    created_at
FROM users 
WHERE role = 'technician'
ORDER BY department;

-- Expected: At least a few technicians in different departments
-- If you see 0 rows, notifications will work for admins but not technicians

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 3: Check department distribution
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '📊 DEPARTMENT STATS' as type,
    department,
    role,
    COUNT(*) as user_count
FROM users 
WHERE role IN ('admin', 'technician')
GROUP BY department, role
ORDER BY department, role;

-- Expected: Each department should have at least 1 admin
-- Example output:
--   Civil       | admin      | 1
--   Civil       | technician | 2
--   IT          | admin      | 1
--   IT          | technician | 3

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 4: Check for exact department names
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT DISTINCT 
    '🏢 DEPARTMENT NAMES' as type,
    department
FROM users
ORDER BY department;

-- Expected department names (EXACTLY):
--   Civil
--   Electrical
--   First Year
--   Housekeeping
--   IT
--   Mechanical
-- 
-- ⚠️ Common mistakes:
--   ❌ "IT Department" (should be "IT")
--   ❌ "it" (lowercase - should be "IT")
--   ❌ "Electrical Dept" (should be "Electrical")

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 5: Check for FCM tokens (push notifications)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '📱 FCM TOKEN STATUS' as type,
    u.email,
    u.full_name,
    u.role,
    u.department,
    CASE 
        WHEN u.fcm_token IS NOT NULL THEN '✅ Has Token'
        ELSE '❌ No Token'
    END as token_status
FROM users u
WHERE role IN ('admin', 'technician')
ORDER BY u.department, u.role;

-- Users without FCM tokens won't receive push notifications
-- They need to log into the mobile app to register their device

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 6: Test query for Floor 1 → Civil mapping
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '🧪 TEST: Floor 1 Admin Query' as test,
    email,
    full_name,
    role,
    department
FROM users
WHERE role = 'admin' 
  AND department = 'Civil';  -- Floor 1 maps to Civil

-- Expected: Should find at least 1 Civil admin
-- If empty: No admin exists for Floor 1 complaints!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- STEP 7: Test query for IT department team (computer complaints)
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SELECT 
    '🧪 TEST: IT Department Team Query' as test,
    email,
    full_name,
    role,
    department
FROM users
WHERE role IN ('admin', 'technician') 
  AND department = 'IT';  -- Computer complaints map to IT

-- Expected: Should find at least 1 IT admin + some IT technicians
-- If empty: No one will receive computer complaint notifications!

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- VERIFICATION COMPLETE
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- 📋 CHECKLIST:
-- □ Do you have at least 1 admin per department?
-- □ Do all departments use exact names (Civil, IT, Electrical, etc.)?
-- □ Do you have technicians in departments that handle complaints?
-- □ Do users have FCM tokens (logged into mobile app)?

-- If any checklist item is NO, see the FIX SCRIPT below:

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- FIX SCRIPT: Create sample admin and technician users
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- UNCOMMENT AND RUN ONLY IF YOU HAVE NO USERS:

-- -- Create admin users (6 departments)
-- INSERT INTO users (id, email, full_name, role, department) VALUES
--   (gen_random_uuid(), 'ag.chaudhari@college.edu', 'Mr. A.G. Chaudhari', 'admin', 'Civil'),
--   (gen_random_uuid(), 'bg.dabhade@college.edu', 'Mr. B.G. Dabhade', 'admin', 'Electrical'),
--   (gen_random_uuid(), 'rs.khandare@college.edu', 'Mr. R.S. Khandare', 'admin', 'Mechanical'),
--   (gen_random_uuid(), 'pc.patil@college.edu', 'Mr. P.C. Patil', 'admin', 'IT'),
--   (gen_random_uuid(), 'vinayak.apsingkar@college.edu', 'Mr. Vinayak Apsingkar', 'admin', 'Housekeeping'),
--   (gen_random_uuid(), 'umakant.butkar@college.edu', 'Mr. Umakant Butkar', 'admin', 'First Year');

-- -- Create sample technicians
-- INSERT INTO users (id, email, full_name, role, department) VALUES
--   (gen_random_uuid(), 'rajesh.it@college.edu', 'Rajesh Kumar', 'technician', 'IT'),
--   (gen_random_uuid(), 'amit.it@college.edu', 'Amit Shah', 'technician', 'IT'),
--   (gen_random_uuid(), 'suresh.electrical@college.edu', 'Suresh Patil', 'technician', 'Electrical'),
--   (gen_random_uuid(), 'mahesh.civil@college.edu', 'Mahesh Joshi', 'technician', 'Civil'),
--   (gen_random_uuid(), 'ganesh.mechanical@college.edu', 'Ganesh Desai', 'technician', 'Mechanical'),
--   (gen_random_uuid(), 'pradeep.housekeeping@college.edu', 'Pradeep Sharma', 'technician', 'Housekeeping');

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- DONE! Re-run verification queries above to confirm
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
