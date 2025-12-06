/**
 * Homepage
 * Landing page with navigation to submit and track complaints
 */

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">College Complaint System</h1>
                <p className="text-sm text-gray-500">Quick & Easy Issue Reporting</p>
              </div>
            </div>
            <Link href="/track">
              <Button variant="outline" size="sm">
                Track Complaint
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Report Issues <span className="text-[#4CAF50]">Instantly</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit complaints about infrastructure, IT equipment, or facilities directly from your browser.
            No app download required!
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Submit Complaint Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-[#4CAF50] transition-all duration-300 animate-slide-in-up">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg width="24" height="24" className="text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">File a Complaint</h3>
            <p className="text-gray-600 mb-6">
              Report issues with computers, projectors, AC, furniture, electrical systems, or any facility problem.
            </p>
            <Link href="/submit">
              <Button size="lg" className="w-full">
                Submit Complaint →
              </Button>
            </Link>
          </div>

          {/* Track Complaint Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-[#2196F3] transition-all duration-300 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg width="24" height="24" className="text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Status</h3>
            <p className="text-gray-600 mb-6">
              Check the real-time status of your complaint and see when it's assigned, in progress, or completed.
            </p>
            <Link href="/track">
              <Button variant="secondary" size="lg" className="w-full">
                Track Complaint →
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" className="text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Fast & Easy</h4>
            <p className="text-sm text-gray-600">Submit complaints in under 2 minutes with our simple form</p>
          </div>

          <div className="text-center p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" className="text-[#2196F3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Updates</h4>
            <p className="text-sm text-gray-600">Get notified when your complaint status changes</p>
          </div>

          <div className="text-center p-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" className="text-[#FF9800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">24-48 Hours</h4>
            <p className="text-sm text-gray-600">Expected response time for most complaints</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} College Complaint System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
