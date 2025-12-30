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
      <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-lg flex items-center justify-center shadow-lg shadow-[#00BFFF]/30 transition-all duration-300 group-hover:shadow-[#00BFFF]/50 group-hover:scale-105">
                <svg width="22" height="22" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Version-3</h1>
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide">Efficient Complaint Management</p>
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
            <span className="text-xs sm:text-sm font-semibold text-[#00BFFF] bg-[#00BFFF]/10 px-4 py-2 rounded-full border border-[#00BFFF]/20">
              ✨ Fast & Reliable Issue Reporting
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Report Issues <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">Instantly</span>
          </h2>
          <p className="text-base sm:text-xl text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
            Submit complaints about infrastructure, IT equipment, or facilities directly from your browser.
            <span className="block sm:inline"> </span>
            <span className="text-[#00BFFF] font-medium">No app download required!</span>
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-2xl sm:max-w-5xl mx-auto mb-12 sm:mb-20">
          {/* Submit Complaint Card */}
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#252525] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-[#333333] hover:border-[#00BFFF]/50 transition-all duration-500 animate-slide-in-up hover:shadow-[#00BFFF]/20 hover:shadow-2xl hover:-translate-y-1">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="28" height="28" className="text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">File a Complaint</h3>
            <p className="text-[#A0A0A0] mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Report issues with computers, projectors, AC, furniture, electrical systems, or any facility problem.
            </p>
            <Link href="/submit">
              <Button size="lg" className="w-full group-hover:shadow-lg group-hover:shadow-[#00BFFF]/30 transition-shadow duration-300">
                <span className="flex items-center justify-center gap-2">
                  Submit Complaint
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>

          {/* Track Complaint Card */}
          <div className="group bg-gradient-to-br from-[#1E1E1E] to-[#252525] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-[#333333] hover:border-[#0099CC]/50 transition-all duration-500 animate-slide-in-up hover:shadow-[#0099CC]/20 hover:shadow-2xl hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#0099CC]/20 to-[#0099CC]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg width="28" height="28" className="text-[#0099CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Track Status</h3>
            <p className="text-[#A0A0A0] mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Check the real-time status of your complaint and see when it's assigned, in progress, or completed.
            </p>
            <Link href="/track">
              <Button size="lg" className="w-full group-hover:shadow-lg group-hover:shadow-[#0099CC]/30 transition-shadow duration-300">
                <span className="flex items-center justify-center gap-2">
                  Track Complaint
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-2xl sm:max-w-6xl mx-auto">
          <div className="text-center p-6 sm:p-8 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#00BFFF]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg width="24" height="24" className="text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Fast & Easy</h4>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">Submit complaints in under 2 minutes with our simple form</p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#00BFFF]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg width="24" height="24" className="text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Email Updates</h4>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">Get notified when your complaint status changes</p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] hover:border-[#00BFFF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#00BFFF]/10">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF9800]/20 to-[#FF9800]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <svg width="24" height="24" className="text-[#FF9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">24-48 Hours</h4>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">Expected response time for most complaints</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] border-t border-[#2A2A2A] mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
            <p className="text-center text-[#808080] text-sm">
              © {new Date().getFullYear()} College Complaint System. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#606060]">
              <span>Powered by</span>
              <span className="text-[#00BFFF] font-semibold">Version-3</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
