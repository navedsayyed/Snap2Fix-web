# Deploy to Vercel - Step by Step Guide

## Prerequisites
- GitHub account with this repository pushed
- Supabase account with your database setup
- Email account for sending notifications

## Deployment Steps

### 1. Go to Vercel
Visit: https://vercel.com

### 2. Sign Up/Login
- Click "Sign Up" or "Login"
- Choose "Continue with GitHub"
- Authorize Vercel to access your GitHub

### 3. Import Your Project
- Click "Add New..." → "Project"
- Find and select `smart-maintenance-web` repository
- Click "Import"

### 4. Configure Your Project
Vercel will auto-detect Next.js settings. Just click "Deploy" or configure environment variables first.

### 5. Add Environment Variables (IMPORTANT!)
Before or after deployment, add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

**How to get these values:**

#### Supabase Keys:
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Email Credentials:
For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password (not your regular password)

### 6. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- You'll get a live URL like: `https://smart-maintenance-web.vercel.app`

### 7. Test Your App
Visit the URL and test:
- ✅ Submit a complaint
- ✅ Track a complaint
- ✅ Receive email confirmation

## Redeploy After Changes

Every time you push to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Vercel automatically redeploys! 🚀

## Custom Domain (Optional)

In Vercel Dashboard → Project → Settings → Domains:
- Add your custom domain
- Update DNS records as instructed
- SSL certificate added automatically

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- View build logs in Vercel dashboard

**App loads but features don't work?**
- Verify environment variables
- Check Supabase connection
- Review function logs in Vercel

## Support
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

---

**Estimated Time: 5-10 minutes** ⏱️
