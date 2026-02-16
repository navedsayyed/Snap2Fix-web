'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CookiePolicyPage() {
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
                <h1 className="text-xl font-bold text-white">Cookie Policy</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12">
          <p className="text-sm text-gray-400 italic mb-8">
            Last Updated: February 14, 2026
          </p>

          {/* Introduction */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            This Cookie Policy explains how Snap2Fix ("we", "our", "us") uses cookies and similar tracking technologies when you access or use our web platform. By using our platform, you consent to the use of cookies as described in this policy.
          </p>

          {/* Section 1 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            1. What Are Cookies?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, improve functionality, and provide analytics about how users interact with the site.
          </p>

          {/* Section 2 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            2. Types of Cookies We Use
          </h2>

          <h3 className="text-base sm:text-lg font-semibold text-[#00BFFF] mt-4 sm:mt-6 mb-2 sm:mb-3">
            Essential Cookies
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            These cookies are necessary for the platform to function properly. They enable core features such as:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>User authentication and session management</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Security features and access control</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Basic site operations and navigation</span>
            </li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold text-[#00BFFF] mt-4 sm:mt-6 mb-2 sm:mb-3">
            Functional Cookies
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            These cookies enhance your experience by remembering your preferences:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Language and display settings</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>User interface customizations</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Previously submitted form data</span>
            </li>
          </ul>

          <h3 className="text-base sm:text-lg font-semibold text-[#00BFFF] mt-4 sm:mt-6 mb-2 sm:mb-3">
            Analytics Cookies
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            These cookies help us understand how users interact with the platform:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Page views and feature usage statistics</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Performance monitoring and error tracking</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>User behavior patterns for platform improvement</span>
            </li>
          </ul>

          {/* Section 3 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            3. Third-Party Cookies
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            We may use third-party services that set their own cookies to provide specific functionality, such as authentication providers, analytics tools, and cloud infrastructure services. These third parties have their own privacy and cookie policies.
          </p>

          {/* Section 4 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            4. How We Use Cookies
          </h2>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Maintain your logged-in session</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Remember your preferences and settings</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Analyze platform performance and usage patterns</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Ensure security and prevent fraud</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Improve user experience based on feedback</span>
            </li>
          </ul>

          {/* Section 5 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            5. Cookie Duration
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            We use both session and persistent cookies:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Session Cookies:</strong> Temporary cookies deleted when you close your browser</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</span>
            </li>
          </ul>

          {/* Section 6 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            6. Managing Cookies
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            You can control and manage cookies through your browser settings:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Delete existing cookies</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Block all or specific cookies</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Receive notifications when new cookies are set</span>
            </li>
          </ul>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            Please note that blocking essential cookies may affect the functionality of the platform, and some features may not work properly.
          </p>

          {/* Section 7 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            7. Browser-Specific Instructions
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            To manage cookies in popular browsers:
          </p>
          <ul className="space-y-2 mb-4 sm:mb-6">
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Google Chrome:</strong> Settings → Privacy and Security → Cookies</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Mozilla Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Safari:</strong> Preferences → Privacy → Manage Website Data</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span><strong className="text-white">Microsoft Edge:</strong> Settings → Privacy & Security → Cookies</span>
            </li>
          </ul>

          {/* Section 8 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            8. Do Not Track
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            Some browsers offer a "Do Not Track" (DNT) signal. Currently, there is no industry standard for responding to DNT signals. We do not track users across third-party websites for advertising purposes.
          </p>

          {/* Section 9 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            9. Updates to This Policy
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            We may update this Cookie Policy periodically to reflect changes in technology, legal requirements, or our practices. The "Last Updated" date at the top indicates when the policy was last revised.
          </p>

          {/* Section 10 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            10. Additional Information
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4 sm:mb-6">
            For more details about how we handle your data, please refer to our <Link href="/privacy-policy" className="text-[#00BFFF] hover:text-[#0099CC] transition-colors">Privacy Policy</Link>. This Cookie Policy should be read in conjunction with our Privacy Policy and Terms of Service.
          </p>

          {/* Contact */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-6 sm:mt-8 lg:mt-10 mb-3 sm:mb-4">
            11. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
            If you have questions about our use of cookies, please contact us at:
          </p>
          <a 
            href="mailto:snap2fix.official@gmail.com" 
            className="text-sm sm:text-base text-[#00BFFF] hover:text-[#0099CC] transition-colors"
          >
            Email: snap2fix.official@gmail.com
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-12 sm:mt-16 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2026 Snap2Fix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
