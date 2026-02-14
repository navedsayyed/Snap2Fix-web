'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
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
                <h1 className="text-xl font-bold text-white">Terms of Service</h1>
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

          <p className="text-gray-300 leading-relaxed mb-6">
            Welcome to Snap2Fix. These Terms of Service ("Terms") govern your access to and use of the Snap2Fix platform. By accessing or using the platform, you agree to be legally bound by these Terms.
          </p>

          {/* Section 1 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            1. Eligibility and Access
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            The platform is intended for authorized members of participating institutions and organizations. Access may be role-based, including Users, Technicians, Administrators, and Super Administrators.
          </p>

          {/* Section 2 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            2. Platform Purpose
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Snap2Fix enables users to submit complaints (including through QR-based location scanning), upload supporting information, and track issue resolution within their organization.
          </p>

          {/* Section 3 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            3. User Responsibilities
          </h2>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Provide accurate and truthful information</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Submit complaints in good faith</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Maintain confidentiality of account credentials</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Comply with institutional policies</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Use the platform only for legitimate reporting purposes</span>
            </li>
          </ul>

          {/* Section 4 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            4. Prohibited Activities
          </h2>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Submitting false, malicious, or misleading complaints</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Uploading inappropriate or unlawful content</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Attempting unauthorized access to the system</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Tampering with QR codes or system infrastructure</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-[#00BFFF] mt-1">•</span>
              <span>Disrupting or overloading the platform</span>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mb-6">
            Violations may result in suspension or permanent termination of access.
          </p>

          {/* Section 5 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            5. Content Ownership and License
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Users retain ownership of submitted content (including text and images). By submitting content, you grant us a limited license to use, process, and store such content for complaint management and operational purposes.
          </p>

          {/* Section 6 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            6. Service Availability
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            While we strive to maintain reliable service, we do not guarantee uninterrupted or error-free operation. Maintenance, updates, or technical issues may temporarily affect availability.
          </p>

          {/* Section 7 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            7. Data and Privacy
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Your use of the platform is also governed by our Privacy Policy, which outlines how we collect, use, and protect your information.
          </p>

          {/* Section 8 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            8. Intellectual Property
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            All platform software, branding, system architecture, and content are protected under applicable intellectual property laws.
          </p>

          {/* Section 9 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            To the fullest extent permitted by law, we shall not be liable for indirect, incidental, special, consequential, or punitive damages arising from use of the platform, including delays in complaint resolution.
          </p>

          {/* Section 10 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            10. Account Suspension and Termination
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            We reserve the right to suspend or terminate accounts that violate these Terms or misuse the system, without prior notice.
          </p>

          {/* Section 11 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            11. Modifications to Terms
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            These Terms may be updated periodically. Continued use of the platform after updates constitutes acceptance of the revised Terms.
          </p>

          {/* Section 12 */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            12. Governing Law
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            These Terms shall be governed in accordance with applicable local laws of the jurisdiction in which the organization operates.
          </p>

          {/* Contact */}
          <h2 className="text-2xl font-bold text-white mt-10 mb-4">
            13. Contact
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
