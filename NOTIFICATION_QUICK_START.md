# ✅ Notification System - Quick Start Checklist

## What I Fixed
1. ✅ Floor-to-department mapping (Floor "1" → "Civil" department)
2. ✅ Added "First Year" as valid department (Floor 2)
3. ✅ Added comprehensive debug logging
4. ✅ Fixed all TypeScript errors

---

## What You Need to Do NOW

### Step 1: Run Database Verification (5 minutes)

1. Open **Supabase Dashboard** → **SQL Editor**

2. Copy and paste the entire contents of:
   ```
   database/verify_notification_setup.sql
   ```

3. Click **Run** and check the results:

   **Look for these sections:**
   - 👨‍💼 ADMIN USERS - Should show 6 admins (Civil, IT, Electrical, etc.)
   - 🔧 TECHNICIAN USERS - Should show some technicians
   - 📊 DEPARTMENT STATS - Should show user counts per department

4. **If you see 0 users:**
   - Scroll to bottom of the SQL script
   - Uncomment the INSERT statements (remove the `--` at start of each line)
   - Run again to create sample users

---

### Step 2: Test the Notification System

1. **Submit a test complaint:**
   - Go to your web app: http://localhost:3000/submit
   - Fill in:
     - Floor: **1** (maps to Civil department)
     - Type: **Computer** (maps to IT department)
     - Title: "Test notification"
     - Description: "Testing dual notification system"
   - Submit

2. **Check the console logs** (Vercel logs or terminal):

   You should see detailed output like:
   ```
   🔔 ═══════════════════════════════════════════════════════
      NOTIFICATION ROUTING STARTED
      ═══════════════════════════════════════════════════════
      📋 Complaint ID: 123
      📍 Floor: 1
      🏢 Handling Department: IT
      🔧 Complaint Type: computer
      ═══════════════════════════════════════════════════════

   🔍 Fetching floor admins: Floor 1 → Civil department
      Found 1 floor admin(s) in Civil

   🔍 Fetching department team: IT department
      Found 1 admin(s) and 2 technician(s) in IT

   📊 Building notification recipient list:
      ✅ Mr. P.C. Patil (IT Admin - SOLVER)
      ✅ Rajesh Kumar (IT Technician)
      ✅ Mr. A.G. Chaudhari (Civil Admin - MONITOR)

   📱 Sending notifications to 3 recipient(s)...
   ```

3. **If you see "NO RECIPIENTS FOUND":**
   - You don't have users in the database
   - Go back to Step 1 and create sample users

---

### Step 3: Verify Notifications Reached Devices

**Important:** Users need to have the mobile app installed and logged in to receive push notifications.

1. Check if users have FCM tokens:
   ```sql
   SELECT email, full_name, 
          CASE WHEN fcm_token IS NOT NULL THEN 'Has Token' ELSE 'No Token' END
   FROM users 
   WHERE role IN ('admin', 'technician');
   ```

2. If users don't have tokens:
   - They need to log into the mobile app
   - The app will register their device and save the FCM token

---

## Expected Notification Flow

### Example: Computer complaint from Floor 1

**What happens:**
1. User submits complaint from Floor 1 (Civil) for computer issue (IT)
2. System fetches:
   - Civil admin (floor manager - MONITOR)
   - IT admin (computer expert - SOLVER)
   - IT technicians (workers)
3. Notifications sent to:
   - ✅ **Civil Admin** - "New complaint on your floor"
   - ✅ **IT Admin** - "New work for your department"
   - ✅ **IT Technicians** - "New task available"

---

## Troubleshooting

### "no user found" in edge function logs

**Cause:** No users in database OR users have wrong department names

**Fix:**
```sql
-- Check what departments exist
SELECT DISTINCT department FROM users;

-- Should be EXACTLY:
-- Civil
-- Electrical  
-- IT
-- Mechanical
-- Housekeeping
-- First Year

-- NOT:
-- "IT Department" ❌
-- "it" ❌
-- "Electrical Dept" ❌
```

---

### Notifications not appearing on phones

**Cause:** Users don't have FCM tokens registered

**Fix:**
1. Each user must log into the mobile app
2. App will request notification permission
3. FCM token gets saved to database
4. After that, notifications will work

---

### Admin seeing duplicate notifications

**This is FIXED** ✅

The deduplication logic ensures that if an admin manages both the floor AND the department, they get **1 notification** (as SOLVER), not 2.

---

## Summary

**Your notification system is now:**
- ✅ Properly mapping floors to departments
- ✅ Supporting "First Year" department (Floor 2)
- ✅ Providing detailed debug logs
- ✅ Deduplicating admins with dual roles

**What you need:**
- ⏳ Users in database with correct roles and departments
- ⏳ Users logged into mobile app (for FCM tokens)

**Next step:**
→ Run `database/verify_notification_setup.sql` in Supabase SQL Editor

---

## Files Created

1. 📄 `NOTIFICATION_FIX_SUMMARY.md` - Detailed explanation of all changes
2. 📄 `database/verify_notification_setup.sql` - Database verification queries
3. 📄 `NOTIFICATION_QUICK_START.md` - This checklist

---

## Need Help?

If you're still seeing issues, share:
1. Console logs from complaint submission
2. Result of database verification queries
3. Edge function logs

The detailed logs will show exactly where the issue is!
