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
  Smartphone,
  Globe,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Zap,
  Clock,
  Shield,
  Users,
} from 'lucide-react';

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div data-reveal className="reveal-up text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Report Issues,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
                  Track Solutions
                </span>
              </h1>
              <p className="text-lg text-[#B0B0B0] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Snap2Fix makes facility management effortless. Submit complaints with QR codes, track progress in real-time, and get issues resolved faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            </div>

            {/* Hero Visual - Complaint Card */}
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

      {/* Stats Section */}
      <section className="border-y border-[#2A2A2A]/50 bg-gradient-to-b from-[#0A0A0A] to-[#121212] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                data-reveal 
                className="reveal-up text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
                  
                  <div className="relative bg-[#1A1A1A]/50 backdrop-blur-sm border border-white/5 rounded-xl px-5 py-5 group-hover:border-white/10 transition-all duration-300">
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={stat.duration}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                    <p className="text-[10px] sm:text-xs text-[#808080] group-hover:text-[#A0A0A0] uppercase tracking-widest font-medium transition-colors duration-300">
                      {stat.label}
                    </p>
                    
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
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

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="reveal-up text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-[#B0B0B0] max-w-2xl mx-auto">
              Three simple steps from problem to solution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                data-reveal
                className="reveal-up relative group"
              >
                <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6 hover:border-[#00BFFF]/30 transition-all duration-300">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 border border-[#00BFFF]/20 flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-[#00BFFF]" />
                  </div>
                  <div className="text-sm font-bold text-[#00BFFF] mb-2">STEP {step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-[#B0B0B0]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="reveal-up text-center mt-10">
            <Link
              href="/how-to-use"
              className="inline-flex items-center gap-2 text-[#00BFFF] hover:text-[#0099CC] font-medium transition-colors"
            >
              See the complete guide
              <ArrowRight className="w-4 h-4" />
            </Link>
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
