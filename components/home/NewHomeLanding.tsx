'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  QrCode,
  Camera,
  BrainCircuit,
  Activity,
  ArrowRight,
  Check,
  Clock,
  Shield,
} from 'lucide-react';
import { N8nWorkflowBlock } from '@/components/ui/n8n-workflow-block-shadcnui';

// Animation hook for reveal on scroll
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = root.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}

// Animated Counter Component
function AnimatedCounter({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: { 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            const startTime = Date.now();
            const endValue = value;

            const animate = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentCount = Math.floor(easeOutQuart * endValue);
              
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(endValue);
              }
            };

            animate();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="text-2xl sm:text-3xl font-bold text-white mb-1.5 tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export function NewHomeLanding() {
  const revealRef = useReveal();

  const stats = [
    { value: 1200, suffix: '+', label: 'Issues Resolved', duration: 2000 },
    { value: 10, suffix: '', label: 'Workflow Steps', duration: 1500 },
    { value: 24, suffix: 'h', label: 'Avg. Response', prefix: '< ', duration: 1800 },
    { value: 100, suffix: '%', label: 'Free to Use', duration: 2000 },
  ];

  const features = [
    {
      icon: QrCode,
      title: 'QR Code Scanning',
      description: 'Instant location detection with QR codes for accurate complaint submission.',
    },
    {
      icon: Camera,
      title: 'Photo Evidence',
      description: 'Upload photos to provide visual context for faster issue resolution.',
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered Routing',
      description: 'Smart department assignment using Google Gemini AI technology.',
    },
    {
      icon: Activity,
      title: 'Real-time Tracking',
      description: 'Monitor your complaint status from submission to completion.',
    },
    {
      icon: Clock,
      title: 'Quick Resolution',
      description: 'Average response time under 24 hours for all complaints.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and handled with enterprise-level security.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Scan QR Code',
      description: 'Scan the QR code at your location to auto-fill details',
      icon: QrCode,
    },
    {
      number: '02',
      title: 'Describe Issue',
      description: 'Add description and photos of the problem',
      icon: Camera,
    },
    {
      number: '03',
      title: 'Track Progress',
      description: 'Monitor resolution status in real-time',
      icon: Activity,
    },
  ];

  return (
    <div ref={revealRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 pb-16 lg:pb-24">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#00BFFF]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#DC2626]/8 rounded-full blur-[120px]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
          <div className="text-center mb-12 sm:mb-20 animate-fade-in px-2">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 sm:mb-7 leading-tight tracking-tight flex flex-col items-center justify-center gap-2">
              <span className="flex items-center sm:items-baseline justify-center gap-3 sm:gap-6">
                Manage 
                <img 
                  src="/Complaints.svg" 
                  alt="Complaints" 
                  className="h-12 sm:h-16 lg:h-20 w-auto inline-block relative -translate-y-[0.05em] sm:translate-y-[0.25em] lg:translate-y-[0.35em]" 
                />
              </span>
              <span className="text-white mt-2">Effortlessly</span>
            </h2>
            <p className="text-base sm:text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed font-light">
              Submit and track complaints about infrastructure, IT equipment, or facilities.
              <span className="block sm:inline mt-2 sm:mt-0"> </span>
              <span className="text-[#00BFFF] font-semibold">Real-time updates. Professional support.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30 shadow-lg shadow-[#8B0000]/20 w-full max-w-xs sm:w-auto"
            >
              Reach Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#333333] w-full max-w-xs sm:w-auto"
            >
              Track Complaint
            </Link>
          </div>
        </main>
      </section>

      {/* Workflow Diagram Section */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-[95%] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="reveal-up text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              How{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
                Snap2Fix Works
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
              From complaint submission to resolution — see the complete workflow in action
            </p>
          </div>

          <div data-reveal className="reveal-up reveal-delay-1">
            {/* Workflow Container with proper aspect ratio */}
            <div className="relative w-full bg-gradient-to-br from-[#1E1E1E] to-[#141414] rounded-3xl border border-[#333333] shadow-2xl overflow-hidden">
              {/* Decorative glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#00BFFF]/10 via-transparent to-[#DC2626]/5 rounded-[2rem] blur-3xl pointer-events-none" />
              
              {/* Workflow block with increased height for better visibility */}
              <div className="relative w-full" style={{ height: '750px' }}>
                <N8nWorkflowBlock />
              </div>

              {/* Optional gradient overlay at edges for better visual containment */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1E1E1E] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141414] to-transparent" />
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1E1E1E] to-transparent" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#141414] to-transparent" />
              </div>
            </div>

            {/* Info text below diagram */}
            <p className="text-center text-sm text-[#808080] mt-6 px-4">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00BFFF] rounded-full animate-pulse" />
                Interactive workflow diagram — drag nodes to explore the complete system
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Original Hero Visual Section - Now as Feature Showcase */}
      <section className="pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div data-reveal className="reveal-up text-center lg:text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Report the issue,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
                  track the solution.
                </span>
              </h3>

              <p className="text-base sm:text-lg text-[#B0B0B0] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Snap2Fix makes facility complaints effortless — scan a QR code, upload a photo,
                and follow your issue from submission to resolution in real time.
              </p>
            </div>

            {/* Hero Visual */}
            <div data-reveal className="reveal-up reveal-delay-1 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#00BFFF]/20 via-transparent to-[#DC2626]/10 rounded-[2rem] blur-2xl" />
                
                <div className="relative bg-gradient-to-br from-[#1E1E1E] to-[#141414] rounded-3xl border border-[#333333] p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-[#808080] uppercase tracking-widest font-semibold mb-1">
                        Complaint Status
                      </p>
                      <p className="text-lg font-bold text-white">#SF-2847</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF9800]/15 text-[#FF9800] border border-[#FF9800]/30">
                      In Progress
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[16/10] border border-[#2A2A2A]">
                    <Image
                      src="/animation/4.webp"
                      alt="Complaint example"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />
                  </div>

                  <div className="space-y-3 mb-5">
                    {[
                      { label: 'Submitted', done: true },
                      { label: 'Assigned to Technician', done: true },
                      { label: 'Work in Progress', done: true, active: true },
                      { label: 'Completed', done: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors ${
                            item.done
                              ? item.active
                                ? 'bg-[#FF9800]/10 border-[#FF9800]'
                                : 'bg-[#4CAF50]/10 border-[#4CAF50]'
                              : 'bg-transparent border-[#404040]'
                          }`}
                        >
                          {item.done && (
                            <Check
                              className={`w-3.5 h-3.5 ${item.active ? 'text-[#FF9800]' : 'text-[#4CAF50]'}`}
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm ${item.active ? 'text-white font-medium' : item.done ? 'text-[#B0B0B0]' : 'text-[#606060]'}`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="reveal-up text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
                Manage Complaints
              </span>
            </h2>
            <p className="text-[#B0B0B0] max-w-2xl mx-auto">
              Powerful features designed to streamline facility management and improve response times
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                data-reveal
                className="reveal-up group bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 hover:border-[#00BFFF]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-[#00BFFF]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#B0B0B0] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-reveal
            className="reveal-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B0000] via-[#6B0000] to-[#4A0000] border border-[#A00000]/30 p-10 sm:p-14 text-center"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFFF]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Join hundreds of organizations using Snap2Fix to streamline their facility management
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#6B0000] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wide"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full transition-colors border border-white/20 uppercase tracking-wide"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
