# College Complaint System - Web Application

A modern, production-ready web application for submitting and tracking facility complaints. Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

- **Easy Complaint Submission** - Simple form with validation
- **QR Code Support** - Pre-fill location data by scanning QR codes
- **Real-time Tracking** - Live status updates via Supabase subscriptions
- **Email Notifications** - Automatic confirmation and status update emails
- **Image Upload** - Attach photos of issues
- **Responsive Design** - Works on all devices
- **Professional UI** - Modern, clean interface with smooth animations

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Email**: Resend
- **Form Handling**: React Hook Form + Zod
- **Real-time**: Supabase Realtime

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Resend account for email notifications (optional but recommended)

## 🛠️ Installation

1. **Clone or navigate to the project**:
   ```bash
   cd complaint-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Update `.env.local` with your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Resend (for emails)
   RESEND_API_KEY=your_resend_api_key
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=College Complaint System
   ```

4. **Run database migrations**:
   
   Execute the SQL commands in Supabase SQL Editor (see `Database Setup` section below)

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- 1. Make user_id nullable (for web submissions without accounts)
ALTER TABLE complaints 
ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add web-specific fields
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_phone TEXT,
ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'app',
ADD COLUMN IF NOT EXISTS tracking_token UUID DEFAULT gen_random_uuid();

-- 3. Add timestamp fields for better tracking
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_token ON complaints(tracking_token);
CREATE INDEX IF NOT EXISTS idx_complaints_created_via ON complaints(created_via);
CREATE INDEX IF NOT EXISTS idx_complaints_user_email ON complaints(user_email);

-- 5. Update existing complaints to mark as 'app' source
UPDATE complaints 
SET created_via = 'app' 
WHERE created_via IS NULL;
```

## 📧 Email Setup

1. Sign up for [Resend](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key from the dashboard
4. Add it to `.env.local` as `RESEND_API_KEY`

## 🎯 Usage

### Submitting a Complaint

1. Navigate to `/submit` or click "File a Complaint" on homepage
2. Fill out the form with:
   - Personal information (name, email, phone)
   - Location (floor, room number)
   - Issue details (type, priority, description)
   - Optional photo upload
3. Submit and receive confirmation email

### QR Code Integration

Generate QR codes that link to: `https://yoursite.com/submit?loc=lab-101`

The location will be auto-filled based on the `loc` parameter. Location mappings are defined in `lib/locations.ts`.

### Tracking a Complaint

1. Navigate to `/track` or click "Track Complaint"
2. Enter your complaint ID (from confirmation email)
3. View real-time status updates

## 📁 Project Structure

```
complaint-web/
├── app/
│   ├── api/
│   │   ├── submit/route.ts          # Complaint submission API
│   │   └── complaint/[id]/route.ts  # Complaint retrieval API
│   ├── submit/page.tsx               # Complaint form page
│   ├── success/page.tsx              # Success confirmation page
│   ├── track/
│   │   ├── page.tsx                  # Track landing page
│   │   └── [id]/page.tsx             # Individual complaint tracking
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Homepage
│   └── globals.css                   # Global styles
├── components/
│   └── ui/
│       ├── Button.tsx                # Button component
│       ├── Input.tsx                 # Input component
│       ├── Select.tsx                # Select dropdown
│       ├── Textarea.tsx              # Textarea component
│       ├── StatusBadge.tsx           # Status badge
│       ├── Timeline.tsx              # Timeline component
│       └── FileUpload.tsx            # File upload component
├── lib/
│   ├── supabase.ts                   # Supabase client & helpers
│   ├── types.ts                      # TypeScript interfaces
│   ├── locations.ts                  # QR code location mapping
│   ├── departmentMapping.ts          # Department assignment logic
│   ├── email.ts                      # Email service
│   ├── utils.ts                      # Utility functions
│   └── validations.ts                # Zod schemas
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🎨 Customization

### Colors

Edit `app/globals.css` to change the color scheme:

```css
:root {
  --primary: 122 39% 49%;      /* Green */
  --secondary: 207 90% 54%;    /* Blue */
  --success: 122 39% 49%;      /* Green */
  --warning: 36 100% 50%;      /* Orange */
  --error: 4 90% 58%;          /* Red */
}
```

### Locations

Add or modify locations in `lib/locations.ts`:

```typescript
export const LOCATIONS: Record<string, Location> = {
  'lab-101': {
    id: 'lab-101',
    name: 'Lab 101',
    floor: 'First Floor',
    department: 'IT Support'
  },
  // Add more locations...
};
```

### Issue Types

Modify issue types in `lib/types.ts`:

```typescript
export const ISSUE_TYPES = [
  'Computer',
  'Projector',
  'AC',
  // Add more types...
] as const;
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🔒 Security

- All API routes include validation
- File uploads are restricted to images only (max 5MB)
- Email addresses are validated
- SQL injection protection via Supabase
- CORS headers configured for API routes

## 📊 Monitoring

- Check Supabase dashboard for database activity
- Monitor Resend dashboard for email delivery
- Use Vercel Analytics for web traffic (if deployed on Vercel)

## 🐛 Troubleshooting

### Emails not sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for logs
- Ensure domain is verified

### Images not uploading
- Check Supabase Storage bucket exists (`complaint-images`)
- Verify storage permissions in Supabase
- Ensure file size is under 5MB

### Real-time updates not working
- Check Supabase Realtime is enabled
- Verify complaint ID is correct
- Check browser console for errors

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase and Resend documentation
3. Contact the development team

---

Built with ❤️ using Next.js and Supabase
