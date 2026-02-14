'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121212] dotted-background">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
            <div className="flex items-center justify-between h-10">
              {/* Back Button and Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-[#2C2C2C] rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 md:p-12">
          <p className="text-sm text-gray-400 italic mb-8">
            Last Updated: February 14, 2026
          </p>

          {/* Introduction */}
          <p className="text-gray-300 leading-relaxed mb-8">
            Welcome to Snap2Fix ("we", "our", "us"). Snap2Fix is a digital complaint and issue management platform designed to help institutions and organizations efficiently report, track, and resolve issues. By using our platform, you agree to this Privacy Policy.
          </p>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-lg font-semibold text-[#00BFFF] mt-6 mb-3">
            Account Information
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Full name</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Email address</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Phone number</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>User role (User, Technician, Admin, Super Admin)</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Organization affiliation</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[#00BFFF] mt-6 mb-3">
            Complaint Information
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Complaint category and description</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Uploaded photos (if provided)</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Location details via QR scan or manual selection</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Submission timestamps and status history</span>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-[#00BFFF] mt-6 mb-3">
            Technical Information
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Device and operating system details</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>App version</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>IP address and log data for security purposes</span>
            </li>
          </ul>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Process and manage complaints</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Assign issues to technicians</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Send notifications and updates</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Improve system performance and user experience</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Ensure security and prevent misuse</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Generate internal organizational reports</span>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mb-6">
            We do not use your personal data for advertising purposes.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We do not sell or rent your personal information. Your data may be shared only with:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Authorized technicians and administrators within your organization</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Platform service providers (database, hosting, notifications)</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Law enforcement authorities when required by law</span>
            </li>
          </ul>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            4. Data Storage and Security
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            We implement industry-standard security measures including encrypted data transmission (HTTPS), secure database infrastructure, and role-based access control. While we strive to protect your information, no system can guarantee absolute security.
          </p>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            5. Data Retention
          </h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>As long as your account remains active</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>As required by your organization's policies</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>As required by applicable laws</span>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mb-6">
            You may request deletion of your data, subject to verification and legal obligations.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            6. Notifications and Communications
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Snap2Fix may send push notifications, email updates, and in-app alerts related to complaint status and system updates. You can manage notification preferences within the app.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            7. Cookies and Tracking (Web Version)
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            For web users, we may use cookies and similar technologies to maintain sessions and improve performance. You can manage cookie settings in your browser.
          </p>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            8. User Rights
          </h2>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Access your personal data</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Correct inaccurate information</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Request deletion of your data</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Withdraw communication consent</span>
            </li>
          </ul>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            9. Children's Privacy
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from minors without proper authorization.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            10. Changes to This Policy
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            We may update this Privacy Policy periodically. Continued use of the platform after changes indicates acceptance of the revised policy.
          </p>

          {/* Contact */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            11. Contact Us
          </h2>
          <a 
            href="mailto:snap2fix.official@gmail.com" 
            className="text-[#00BFFF] hover:text-[#0099CC] transition-colors"
          >
            Email: snap2fix.official@gmail.com
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; 2026 Snap2Fix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
