'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function HelpSupportPage() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'How do I submit a complaint?',
      answer:
        'Open the Scan section, scan the QR code at the issue location, fill in the details, optionally attach a photo, and tap Submit.',
    },
    {
      id: 2,
      question: 'How can I track my complaint?',
      answer:
        'Go to the "My Complaints" section to see all submitted issues along with their status updates.',
    },
    {
      id: 3,
      question: 'What do complaint statuses mean?',
      answer:
        'Pending: Awaiting assignment. In Progress: Technician working. Completed: Issue resolved.',
    },
    {
      id: 4,
      question: 'How do I reset my password?',
      answer:
        'Use the "Forgot Password" option on the login screen or change it from Account Settings inside your profile.',
    },
    {
      id: 5,
      question: 'Can I edit or delete a complaint?',
      answer:
        'Submitted complaints cannot be deleted to maintain record integrity. Contact support if changes are required.',
    },
    {
      id: 6,
      question: 'Why am I not receiving notifications?',
      answer:
        'Ensure notifications are enabled in your device settings and that the app has permission to send alerts.',
    },
  ];

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

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
                <h1 className="text-xl font-bold text-white">Help & Support</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 lg:p-12">

          {/* Contact Support Section */}
          <div className="mt-6 sm:mt-8 lg:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
              Contact Support
            </h2>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">We're here to help you</p>

            <div className="space-y-3 sm:space-y-4">
              {/* Email Support Card */}
              <a
                href="mailto:snap2fix.official@gmail.com?subject=Snap2Fix Support Request"
                className="flex items-center gap-3 sm:gap-4 bg-[#2A2A2A] hover:bg-[#333333] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 border border-white/5 hover:border-[#00BFFF]/30 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00BFFF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00BFFF]/20 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    className="sm:w-6 sm:h-6"
                    fill="none"
                    stroke="#00BFFF"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Email Support</h3>
                  <p className="text-[#00BFFF] text-xs sm:text-sm truncate">snap2fix.official@gmail.com</p>
                </div>
              </a>

              {/* Phone Support Card */}
              <a
                href="tel:+919356559922"
                className="flex items-center gap-3 sm:gap-4 bg-[#2A2A2A] hover:bg-[#333333] rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 border border-white/5 hover:border-[#00BFFF]/30 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00BFFF]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00BFFF]/20 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    className="sm:w-6 sm:h-6"
                    fill="none"
                    stroke="#00BFFF"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">Phone Support</h3>
                  <p className="text-[#00BFFF] text-xs sm:text-sm">+91 9356559922</p>
                </div>
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-6 sm:mt-8 lg:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>

            <div className="bg-[#2A2A2A] rounded-xl sm:rounded-2xl overflow-hidden border border-white/5">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`${
                    index !== faqs.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center gap-2.5 sm:gap-3 p-4 sm:p-5 text-left hover:bg-[#333333] transition-colors"
                  >
                    <svg
                      width="18"
                      height="18"
                      className="sm:w-5 sm:h-5"
                      fill="none"
                      stroke="#00BFFF"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="flex-1 text-white font-medium text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#9CA3AF"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      className={`sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-200 ${
                        expandedFAQ === faq.id ? 'rotate-180' : ''
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4 pl-9 sm:px-5 sm:pb-5 sm:pl-12">
                      <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 sm:mt-8 lg:mt-12 bg-[#00BFFF]/5 border-l-4 border-[#00BFFF] rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">
              Snap2Fix
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Snap2Fix simplifies complaint management and improves operational
              efficiency within institutions. If you need further assistance,
              please contact our support team.
            </p>
          </div>
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
