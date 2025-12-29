# User Authentication Setup Guide

## Overview
This update adds user authentication to your complaint management system, allowing users to:
- Create accounts and login
- View all their complaints in one place
- Access their profile dashboard
- Track complaint history

## Setup Steps

### 1. Run Database Migration

Go to your Supabase project dashboard:

1. Navigate to **SQL Editor**
2. Open the file `database_migration.sql` in this project
3. Copy and paste the SQL into the Supabase SQL Editor
4. Click **Run** to execute the migration

This will:
- Add `user_id` column to the complaints table
- Enable Row Level Security (RLS)
- Create policies for data access
- Add indexes for better performance

### 2. Enable Email Authentication in Supabase

1. Go to your Supabase Dashboard → **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation email, password reset, etc.

### 3. Test the New Features

#### Sign Up
1. Visit `http://localhost:3000`
2. Click "Login" in the header
3. Click "Sign up" link
4. Create a new account with:
   - Full name
   - Email
   - Password (min 6 characters)

#### Login
1. Use your credentials to sign in
2. You'll be redirected to your profile page

#### Submit Complaint as Logged-in User
1. While logged in, submit a complaint
2. The form will auto-fill your name and email
3. The complaint will be linked to your account

#### View Profile
1. Click "My Profile" in the header
2. See your account info
3. View all your submitted complaints
4. Click any complaint to track it

### 4. Features

#### Guest Submission (No Login Required)
- Users can still submit complaints without an account
- They need to manually enter name and email
- Complaints won't be linked to a profile

#### Authenticated Submission (Logged In)
- Name and email auto-filled
- Complaints automatically linked to user profile
- Can view all complaints in profile dashboard

#### Profile Dashboard
- Account information display
- List of all user's complaints
- Quick links to track individual complaints
- Sign out functionality

### 5. Navigation Updates

**Homepage Header:**
- **Not logged in**: Shows "Login" button
- **Logged in**: Shows "My Profile" button

**All Pages:**
- Login page with link to signup
- Signup page with link to login
- Profile page with sign out button

## Security Features

✅ **Row Level Security (RLS)** enabled
✅ **Secure password hashing** by Supabase Auth
✅ **Session management** with automatic token refresh
✅ **Protected routes** - profile requires authentication
✅ **User data isolation** - users only see their own complaints

## File Structure

New files created:
```
lib/auth.ts                    # Authentication helper functions
app/login/page.tsx             # Login page
app/signup/page.tsx            # Signup page
app/profile/page.tsx           # User profile/dashboard
database_migration.sql         # Database schema updates
```

Modified files:
```
lib/supabase.ts               # Enabled session persistence
app/page.tsx                  # Added login/profile links
app/submit/page.tsx           # Auto-fill for logged-in users
app/api/submit/route.ts       # Save user_id with complaints
```

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- Check that `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: Login fails with "Invalid credentials"
- Verify email and password are correct
- Check Supabase dashboard for user accounts

### Issue: Profile page shows empty
- Run the database migration SQL
- Ensure user_id column exists in complaints table

### Issue: Can't sign up
- Check Supabase Auth is enabled
- Verify email provider is configured

## Next Steps (Optional Enhancements)

- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add social login (Google, GitHub)
- [ ] Add user profile editing
- [ ] Add email notifications for complaint updates
- [ ] Add admin dashboard to manage all complaints

## Support

For issues or questions:
1. Check Supabase logs in dashboard
2. Check browser console for errors
3. Review this README for setup steps
