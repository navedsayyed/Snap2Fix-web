'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  QrCode,
  Camera,
  BrainCircuit,
  Activity,
  ArrowRight,
  CheckCircle2,
  Check,
  Smartphone,
  Globe,
  Zap,
} from 'lucide-react';
import { WorkflowDiagram } from '@/components/home/WorkflowDiagram';

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

const features = [
  {
    icon: QrCode,
    title: 'Scan & Go',
    description:
      'Scan location QR codes to auto-fill floor and room details. No typing, no mistakes.',
    accent: 'from-[#DC2626]/20 to-[#DC2626]/5',
    iconColor: 'text-[#DC2626]',
    border: 'border-[#DC2626]/20',
  },
  {
    icon: Camera,
    title: 'Photo Evidence',
    description:
      'Attach clear photos so technicians understand the issue before they arrive on site.',
    accent: 'from-[#00BFFF]/20 to-[#00BFFF]/5',
    iconColor: 'text-[#00BFFF]',
    border: 'border-[#00BFFF]/20',
  },
  {
    icon: BrainCircuit,
    title: 'AI Routing',
    description:
      'Google Gemini analyzes complaints and routes them to the right department automatically.',
    accent: 'from-[#A855F7]/20 to-[#A855F7]/5',
    iconColor: 'text-[#A855F7]',
    border: 'border-[#A855F7]/20',
  },
  {
    icon: Activity,
    title: 'Live Tracking',
    description:
      'Follow every status change — from submitted to assigned, in progress, and completed.',
    accent: 'from-[#4CAF50]/20 to-[#4CAF50]/5',
    iconColor: 'text-[#4CAF50]',
    border: 'border-[#4CAF50]/20',
  },
];

const steps = [
  {
    number: '01',
    title: 'Scan QR Code',
    description: 'Find the QR at your location and scan it to fill in details instantly.',
    image: '/animation/2.webp',
  },
  {
    number: '02',
    title: 'Submit Complaint',
    description: 'Describe the issue, upload a photo, and get your unique tracking ID.',
    image: '/animation/5.webp',
  },
  {
    number: '03',
    title: 'Track Progress',
    description: 'Watch technicians resolve your issue with real-time status updates.',
    image: '/animation/8.webp',
  },
];

const stats = [
  { value: 1200, suffix: '+', label: 'Issues Resolved', duration: 2000 },
  { value: 10, suffix: '', label: 'Workflow Steps', duration: 1500 },
  { value: 24, suffix: 'h', label: 'Avg. Response', prefix: '< ', duration: 1800 },
  { value: 100, suffix: '%', label: 'Free to Use', duration: 2000 },
];

// Animated counter component
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
              
              // Easing function for smooth animation
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

export function HomeLanding() {
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#00BFFF]/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#DC2626]/8 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-12 lg:pt-16 pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-reveal className="reveal-up text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Report the issue,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
                  track the solution.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#B0B0B0] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Snap2Fix makes facility complaints effortless — scan a QR code, upload a photo,
                and follow your issue from submission to resolution in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8B0000] to-[#6B0000] hover:from-[#A00000] hover:to-[#7B0000] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#A00000]/30 shadow-lg shadow-[#8B0000]/20"
                >
                  Reach Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white text-sm font-semibold rounded-full transition-all duration-300 uppercase tracking-wide border border-[#333333]"
                >
                  Track Complaint
                </Link>
              </div>
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
                      alt="Complaint photo example"
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

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2A2A2A]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0099CC] flex items-center justify-center text-white text-xs font-bold">
                      RK
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">Rahul Kumar</p>
                      <p className="text-xs text-[#808080]">Electrical Technician</p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -left-2 sm:-left-6 top-8 bg-[#1A1A1A]/90 backdrop-blur-md border border-[#333333] rounded-2xl px-4 py-3 shadow-xl animate-float">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#DC2626]" />
                    <span className="text-xs font-semibold text-white">QR Scanned</span>
                  </div>
                </div>
                <div className="absolute -right-2 sm:-right-6 bottom-16 bg-[#1A1A1A]/90 backdrop-blur-md border border-[#333333] rounded-2xl px-4 py-3 shadow-xl animate-float-delayed">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-[#A855F7]" />
                    <span className="text-xs font-semibold text-white">AI Routed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#2A2A2A]/50 bg-gradient-to-b from-[#0A0A0A] to-[#121212] relative overflow-hidden">
        {/* Subtle background pattern */}
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
                  {/* Animated gradient border effect */}
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
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div data-reveal className="reveal-up text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
              report & resolve
            </span>
          </h2>
          <p className="text-[#B0B0B0] max-w-2xl mx-auto">
            From QR scanning to AI-powered department routing — Snap2Fix handles the heavy lifting
            so your issues get fixed faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              data-reveal
              className={`reveal-up reveal-delay-${Math.min(i + 1, 4)} group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 border border-[#333333] hover:border-[#404040] transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#B0B0B0] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-transparent via-[#1A1A1A]/30 to-transparent py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-reveal className="reveal-up text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-[#B0B0B0] max-w-2xl mx-auto">
              Three simple steps from problem to solution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} data-reveal className={`reveal-up reveal-delay-${i + 1} relative group`}>
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden hover:border-[#00BFFF]/30 transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-5xl font-black text-white/10">
                      {step.number}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-[#B0B0B0] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="reveal-up text-center mt-10">
            <Link
              href="/how-to-use"
              className="inline-flex items-center gap-2 text-[#00BFFF] hover:text-[#0099CC] font-medium transition-colors"
            >
              See the full 10-step guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Complete workflow diagram - Hidden on mobile */}
      <div className="hidden md:block">
        <WorkflowDiagram />
      </div>

      {/* Web + App */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            data-reveal
            className="reveal-up bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-8 sm:p-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00BFFF]/20 to-[#00BFFF]/5 border border-[#00BFFF]/20 flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-[#00BFFF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Web Portal</h3>
            <p className="text-[#B0B0B0] leading-relaxed mb-6">
              This website is your public complaint portal. Submit issues, upload photos, and track
              status — no app download required.
            </p>
            <ul className="space-y-3">
              {['QR code scanning', 'Photo upload', 'Real-time tracking', 'Email notifications'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#B0B0B0]">
                    <CheckCircle2 className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div
            data-reveal
            className="reveal-up reveal-delay-1 bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-3xl border border-[#333333] p-8 sm:p-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DC2626]/20 to-[#DC2626]/5 border border-[#DC2626]/20 flex items-center justify-center mb-6">
              <Smartphone className="w-7 h-7 text-[#DC2626]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Mobile App</h3>
            <p className="text-[#B0B0B0] leading-relaxed mb-6">
              The Snap2Fix mobile app powers staff operations — admins assign work, technicians
              resolve issues, and super admins manage the entire system.
            </p>
            <ul className="space-y-3">
              {[
                'Admin & technician dashboards',
                'Push notifications',
                'Before/after photo proof',
                'Department routing',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#B0B0B0]">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div
          data-reveal
          className="reveal-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B0000] via-[#6B0000] to-[#4A0000] border border-[#A00000]/30 p-10 sm:p-14 text-center"
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFFF]/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to report an issue?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              It takes less than two minutes. Scan a QR code, describe the problem, and let our team
              handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/scan-qr"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#6B0000] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wide"
              >
                Submit Complaint
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/how-to-use"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full transition-colors border border-white/20 uppercase tracking-wide"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
