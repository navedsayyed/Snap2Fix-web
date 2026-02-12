/**
 * Homepage
 * Landing page with navigation to submit and track complaints
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();

    // Listen for navigation events to recheck auth
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClick = () => {
    router.push('/scan-qr');
  };

  return (
    <div className="min-h-screen bg-[#121212] dotted-background">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
            <div className="flex items-center justify-between h-10">
              {/* Logo Section */}
              <Link href="/" className="flex items-center gap-2 group">
                <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-7 w-auto" />
              </Link>

              {/* Desktop Navigation - Center */}
              <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                <Link href="/track" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                  TRACK
                </Link>
                {user ? (
                  <Link href="/profile" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                    PROFILE
                  </Link>
                ) : (
                  <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                    LOGIN
                  </Link>
                )}
                <Link href="/our-team" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                  OUR TEAM
                </Link>
                <Link href="/how-to-use" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                  HOW TO USE
                </Link>
                <Link href="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide">
                  PRICING
                </Link>
              </nav>

              {/* CTA Button - Desktop */}
              <div className="hidden lg:block">
                <button
                  onClick={handleSubmitClick}
                  className="px-7 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30"
                >
                  SUBMIT COMPLAINT
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 mx-6">
            <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl px-6 py-8 space-y-6 animate-slide-in-down">
              <Link
                href="/track"
                className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TRACK
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  PROFILE
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  LOGIN
                </Link>
              )}
              <Link
                href="/our-team"
                className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                OUR TEAM
              </Link>
              <Link
                href="/how-to-use"
                className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOW TO USE
              </Link>
              <Link
                href="/pricing"
                className="block text-base font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PRICING
              </Link>
              <button
                onClick={() => {
                  handleSubmitClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-8 py-3 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30"
              >
                SUBMIT COMPLAINT
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="text-center mb-12 sm:mb-20 animate-fade-in px-2">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 sm:mb-7 leading-tight tracking-tight">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] via-[#00D4FF] to-[#0099CC]">Complaints</span>
            <br />
            <span className="text-3xl sm:text-5xl lg:text-6xl text-gray-300">Effortlessly</span>
          </h2>
          <p className="text-base sm:text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed font-light">
            Submit and track complaints about infrastructure, IT equipment, or facilities.
            <span className="block sm:inline mt-2 sm:mt-0"> </span>
            <span className="text-[#00BFFF] font-semibold">Real-time updates. Professional support.</span>
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 max-w-2xl sm:max-w-6xl mx-auto mb-12 sm:mb-20">
          {/* Submit Complaint Card */}
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl p-8 sm:p-12 border border-[#333333] hover:border-[#00BFFF]/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <svg width="36" height="36" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Submit Complaint</h3>
              <p className="text-[#B0B0B0] mb-8 leading-relaxed text-base">
                Report any facility issues including computers, projectors, AC, furniture, and electrical systems.
              </p>
              <Button
                size="lg"
                className="w-full transition-all duration-300 text-base font-semibold py-4"
                onClick={handleSubmitClick}
              >
                <span className="flex items-center justify-center gap-3">
                  Scan QR & Submit
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>

          {/* Track Complaint Card */}
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl p-8 sm:p-12 border border-[#333333] hover:border-[#0099CC]/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <svg width="36" height="36" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Track Status</h3>
              <p className="text-[#B0B0B0] mb-8 leading-relaxed text-base">
                Monitor real-time updates from submission to completion with instant notifications.
              </p>
              <Link href="/track" className="w-full">
                <Button size="lg" className="w-full transition-all duration-300 text-base font-semibold py-4">
                  <span className="flex items-center justify-center gap-3">
                    Track Now
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-2xl sm:max-w-6xl mx-auto">
          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="26" height="26" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Lightning Fast</h4>
            <p className="text-sm text-[#B0B0B0] leading-relaxed">Submit your complaints in under 60 seconds with our streamlined interface</p>
          </div>

          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="26" height="26" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Live Notifications</h4>
            <p className="text-sm text-[#B0B0B0] leading-relaxed">Receive instant email alerts when your complaint status updates</p>
          </div>

          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#FF9800]/40 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#FF6F00] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="26" height="26" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Quick Resolution</h4>
            <p className="text-sm text-[#B0B0B0] leading-relaxed">Most issues resolved within 24-48 hours by our dedicated team</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-[#0A0A0A] to-[#1A1A1A] border-t border-[#2A2A2A] mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col items-center justify-center text-center gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/main-logo.svg" alt="Snap2Fix Logo" className="w-10 h-10 object-contain" />
              <div>
                <h3 className="text-lg font-bold text-white">Snap2Fix</h3>
              </div>
            </div>

            <p className="text-[#808080] text-sm max-w-md">
              Professional complaint management system for efficient facility maintenance and support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#606060] pt-4 border-t border-[#2A2A2A] w-full">
              <span>© {new Date().getFullYear()} Snap2Fix System</span>
              <span className="hidden sm:inline">•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}