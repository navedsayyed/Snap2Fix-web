/**
 * Homepage
 * Landing page with navigation to submit and track complaints
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/auth';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.log('Not logged in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-xl flex items-center justify-center shadow-lg shadow-[#00BFFF]/40 border border-[#00BFFF]/20">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Smart Maintenance</h1>
                <p className="text-[#00BFFF] text-xs sm:text-sm font-semibold hidden sm:block">Professional Issue Management</p>
              </div>
            </Link>

            {/* Navigation Section */}
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/track">
                <button className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 border border-transparent hover:border-white/10">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">Track</span>
                </button>
              </Link>
              
              {!loading && (
                user ? (
                  <Link href="/profile">
                    <button className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] rounded-lg transition-all duration-200 shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 hover:scale-[1.02]">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="hidden sm:inline">Profile</span>
                    </button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <button className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00A8E6] hover:to-[#0088BB] rounded-lg transition-all duration-200 shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 hover:scale-[1.02]">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden sm:inline">Login</span>
                    </button>
                  </Link>
                )
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        <div className="text-center mb-12 sm:mb-20 animate-fade-in px-2">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-bold text-[#00BFFF] bg-gradient-to-r from-[#00BFFF]/15 to-[#0099CC]/15 px-5 py-2.5 rounded-full border border-[#00BFFF]/30 shadow-lg shadow-[#00BFFF]/20 backdrop-blur-sm">
              ⚡ Fast & Professional Issue Reporting
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 sm:mb-7 leading-tight tracking-tight">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] via-[#00D4FF] to-[#0099CC] drop-shadow-[0_0_30px_rgba(0,191,255,0.3)]">Complaints</span>
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
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl shadow-2xl p-8 sm:p-12 border border-[#333333] hover:border-[#00BFFF]/50 transition-all duration-300 hover:shadow-[#00BFFF]/20 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#00BFFF]/40 group-hover:scale-105 transition-transform duration-300">
                <svg width="36" height="36" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Submit Complaint</h3>
              <p className="text-[#B0B0B0] mb-8 leading-relaxed text-base">
                Report any facility issues including computers, projectors, AC, furniture, and electrical systems.
              </p>
              <Link href="/submit" className="w-full">
                <Button size="lg" className="w-full group-hover:shadow-xl group-hover:shadow-[#00BFFF]/40 transition-all duration-300 text-base font-semibold py-4">
                  <span className="flex items-center justify-center gap-3">
                    Submit Now
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Track Complaint Card */}
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl shadow-2xl p-8 sm:p-12 border border-[#333333] hover:border-[#0099CC]/50 transition-all duration-300 hover:shadow-[#0099CC]/20 hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0099CC] to-[#007ACC] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#0099CC]/40 group-hover:scale-105 transition-transform duration-300">
                <svg width="36" height="36" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Track Status</h3>
              <p className="text-[#B0B0B0] mb-8 leading-relaxed text-base">
                Monitor real-time updates from submission to completion with instant notifications.
              </p>
              <Link href="/track" className="w-full">
                <Button size="lg" className="w-full group-hover:shadow-xl group-hover:shadow-[#0099CC]/40 transition-all duration-300 text-base font-semibold py-4">
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
          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#00BFFF]/10 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg shadow-[#00BFFF]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="26" height="26" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Lightning Fast</h4>
            <p className="text-sm text-[#B0B0B0] leading-relaxed">Submit your complaints in under 60 seconds with our streamlined interface</p>
          </div>

          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#00BFFF]/10 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg shadow-[#00BFFF]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="26" height="26" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Live Notifications</h4>
            <p className="text-sm text-[#B0B0B0] leading-relaxed">Receive instant email alerts when your complaint status updates</p>
          </div>

          <div className="group text-center p-7 sm:p-9 bg-gradient-to-br from-[#1A1A1A] to-[#1E1E1E] rounded-2xl border border-[#2A2A2A] hover:border-[#FF9800]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF9800]/10 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9800] to-[#FF6F00] rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg shadow-[#FF9800]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#0099CC] rounded-xl flex items-center justify-center shadow-lg shadow-[#00BFFF]/30">
                <svg width="20" height="20" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Smart Maintenance</h3>
              </div>
            </div>
            
            <p className="text-[#808080] text-sm max-w-md">
              Professional complaint management system for efficient facility maintenance and support.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#606060] pt-4 border-t border-[#2A2A2A] w-full">
              <span>© {new Date().getFullYear()} Smart Maintenance System</span>
              <span className="hidden sm:inline">•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
