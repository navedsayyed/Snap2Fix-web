/**
 * Contact Us Page
 * Page for users to reach out and contact the Snap2Fix team
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for contacting us! We will get back to you soon.');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#121212] dotted-background">
      {/* Header */}
      <header className="sticky top-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
            <div className="flex items-center justify-between h-10">
              <Link href="/" className="flex items-center gap-2">
                <img src="/snap2fix-logo.svg" alt="Snap2Fix" className="h-7 w-auto" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Get in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
              Touch
            </span>
          </h1>
          <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-6">
              <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/20 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00BFFF]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
              <a
                href="mailto:snap2fix.official@gmail.com"
                className="text-[#B0B0B0] hover:text-[#00BFFF] transition-colors break-all"
              >
                snap2fix.official@gmail.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-6">
              <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
              <a
                href="tel:+919356559922"
                className="text-[#B0B0B0] hover:text-[#4CAF50] transition-colors"
              >
                +91 9356559922
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-6">
              <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#DC2626]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Location</h3>
              <p className="text-[#B0B0B0]">
                Nashik, Maharashtra<br />
                India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-[#4CAF50]/10 border border-[#4CAF50]/30 rounded-xl text-[#4CAF50] text-sm">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder-[#606060] focus:border-[#00BFFF] focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder-[#606060] focus:border-[#00BFFF] focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder-[#606060] focus:border-[#00BFFF] focus:outline-none transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white focus:border-[#00BFFF] focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="complaint">Complaint Issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder-[#606060] focus:border-[#00BFFF] focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] disabled:from-[#4A0000] disabled:to-[#3A0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30 shadow-lg shadow-[#8B0000]/20 inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#808080] text-sm">
              © {new Date().getFullYear()} Snap2Fix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
