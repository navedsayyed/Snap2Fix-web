# Snap2Fix – Smart Complaint Management System (Web)

**Snap2Fix** is a centralized complaint management system designed for universities, companies, and organizations to handle all types of maintenance and service-related issues. It allows users to submit complaints such as electrical, mechanical, technical, cleanliness, and other operational problems through a single digital platform. With role-based access for Users, Technicians, Admins, and Super Admins, the system ensures efficient task assignment, real-time tracking, and faster resolution of reported issues.

## 📊 Development Activity

### 📈 Commit Activity Graph

[![Snap2Fix Commit History](https://github-readme-activity-graph.vercel.app/graph?username=navedsayyed&repo=Snap2Fix-web&theme=react-dark&bg_color=1a1b27&color=38bdae&line=70a5fd&point=bf91f3&area=true&hide_border=false&custom_title=Snap2Fix%20Web%20Commit%20Activity)](https://github.com/navedsayyed/Snap2Fix-web/commits)

**📊 Graph Details:**
- **X-Axis**: Timeline showing days from project start to present
- **Y-Axis**: Number of commits per day
- **Visualization**: Line graph with connected dots showing daily commit activity
- 📅 **Interactive**: Click graph to view detailed commit history

---

<!-- ### Additional Statistics

![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/navedsayyed/Snap2Fix-web?style=for-the-badge&logo=github&label=Monthly%20Commits)
![Last Commit](https://img.shields.io/github/last-commit/navedsayyed/Snap2Fix-web?style=for-the-badge&logo=github&label=Last%20Commit)
![GitHub Contributors](https://img.shields.io/github/contributors/navedsayyed/Snap2Fix-web?style=for-the-badge&logo=github&label=Contributors) -->

### Contribution Streak

![Commit Stats](https://github-readme-streak-stats.herokuapp.com/?user=navedsayyed&theme=react&hide_border=true&background=1a1b27&ring=70a5fd&fire=bf91f3&currStreakLabel=38bdae)

## 🌐 Platform Overview

**Snap2Fix** operates on a hybrid platform model:

- **Web Application (Next.js)**: This repository - Users submit complaints through our Next.js web interface for easy access and streamlined complaint submission
- **Mobile Application (React Native)**: Admins, Technicians, and Super Admins use the **Snap2Fix** mobile app for managing, tracking, and resolving complaints on the go

This architecture ensures users have a convenient web-based complaint submission system while staff members have powerful mobile tools for efficient complaint management.

## 📱 Web Application Features

### User Features
- **Complaint Submission**: Submit complaints via intuitive Next.js web interface
- **QR Code Scanning**: Quick location identification using QR codes
- **Photo Upload**: Attach photos to complaints for better documentation
- **Real-time Tracking**: Track complaint status (Pending, In Progress, Completed)
- **Complaint History**: View all submitted complaints
- **Before/After Photos**: See completion photos for resolved issues
- **User Authentication**: Secure login and signup with email verification
- **Profile Management**: Update personal information and settings
- **Password Management**: Reset and update password functionality

### Additional Pages
- **How to Use**: Step-by-step guide for users
- **Help & Support**: Quick assistance and FAQs
- **Privacy Policy**: Data protection and privacy information
- **Terms of Service**: Usage terms and conditions
- **Cookie Policy**: Cookie usage information
- **Our Team**: Meet the development team
- **Pricing**: Service pricing information

## 🏗️ Project Structure (Web Application)

This repository contains the **Snap2Fix** Next.js web application for user complaint submission and tracking. The React Native mobile application for staff management is maintained separately.

```
Snap2Fix-web/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   │
│   ├── auth/                    # Authentication Pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── update-password/
│   │       └── page.tsx
│   │
│   ├── submit/                  # Complaint Submission
│   │   └── page.tsx
│   ├── scan-qr/                 # QR Code Scanner
│   │   └── page.tsx
│   ├── success/                 # Success Confirmation
│   │   └── page.tsx
│   │
│   ├── track/                   # Complaint Tracking
│   │   ├── page.tsx
│   │   └── [id]/               # Individual Complaint View
│   │       └── page.tsx
│   │
│   ├── profile/                 # User Profile
│   │   └── page.tsx
│   ├── account-settings/        # Account Settings
│   │   └── page.tsx
│   │
│   ├── api/                     # API Routes
│   │   ├── submit/             # Submit Complaint API
│   │   │   └── route.ts
│   │   ├── complaint/          # Complaint Management
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── update-status/
│   │   │           └── route.ts
│   │   ├── profile/            # Profile API
│   │   │   └── route.ts
│   │   ├── set-password/       # Password Management
│   │   │   └── route.ts
│   │   └── webhooks/           # Webhook Handlers
│   │       └── status-update/
│   │           └── route.ts
│   │
│   └── (information)/           # Static Pages
│       ├── how-to-use/
│       ├── help-support/
│       ├── privacy-policy/
│       ├── terms-of-service/
│       ├── cookie-policy/
│       ├── our-team/
│       └── pricing/
│
├── components/                  # React Components
│   └── ui/                     # UI Components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── GroupedSelect.tsx
│       ├── Textarea.tsx
│       ├── FileUpload.tsx
│       ├── StatusBadge.tsx
│       └── Timeline.tsx
│
├── lib/                         # Utilities & Config
│   ├── supabase.ts             # Supabase Client
│   ├── auth.ts                 # Authentication Helpers
│   ├── email.ts                # Email Service
│   ├── types.ts                # TypeScript Types
│   ├── utils.ts                # Utility Functions
│   ├── validations.ts          # Form Validations
│   ├── complaintTypes.ts       # Complaint Categories
│   ├── departmentMapping.ts    # Department Config
│   ├── locations.ts            # Location Data
│   └── ThemeContext.tsx        # Theme Provider
│
├── database/                    # Database
│   └── database_migration.sql  # DB Schema
│
├── public/                      # Static Assets
│   └── animation/              # Animations
│
├── .env.example                # Environment Variables Template
├── next.config.ts              # Next.js Configuration
├── tailwind.config.ts          # Tailwind CSS Config
├── tsconfig.json               # TypeScript Config
└── vercel.json                 # Vercel Deployment Config
```

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: SMTP (Gmail)
- **AI Routing**: Google Gemini API (Free)
- **Deployment**: Vercel
- **QR Code**: QR Scanner Library



## 📱 Related Repositories

- **Mobile App**: [Snap2Fix Mobile](https://github.com/navedsayyed/Snap2Fix) - React Native app for staff


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Visit our [Our Team](https://snap2fix.vercel.app/our-team) page to meet the developers.

## 📞 Support

For support, email support@snap2fix.com or visit our [Help & Support](https://snap2fix.vercel.app/help-support) page.



date 29/06/2026
