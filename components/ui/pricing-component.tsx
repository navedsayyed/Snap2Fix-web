'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "For individual users",
      features: [
        "Submit unlimited complaints",
        "Real-time tracking",
        "Email notifications",
        "QR code scanning"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Pro",
      price: isAnnual ? "₹10,999" : "₹999",
      description: "For small organizations",
      features: [
        "All free features",
        "Priority support",
        "Custom branding",
        "Advanced analytics",
        "Department routing",
        "API access"
      ],
      cta: "Upgrade to Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "All pro features",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "On-premise deployment",
        "24/7 phone support"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="bg-[#121212] min-h-screen dotted-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Simple,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
              Transparent
            </span>{' '}
            Pricing
          </h1>
          <p className="text-lg text-[#B0B0B0] mb-6">
            Choose the plan that works best for your organization
          </p>
          <div className="inline-flex items-center bg-[#1A1A1A] border border-white/10 rounded-full p-1">
            <button
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-[#808080] hover:text-white'
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
                isAnnual
                  ? 'bg-[#2A2A2A] text-white'
                  : 'text-[#808080] hover:text-white'
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.highlighted
                  ? 'border-[#00BFFF]/30 bg-[#1A1A1A] scale-[1.02] shadow-xl shadow-[#00BFFF]/10'
                  : 'border-white/10 bg-[#1A1A1A]/50 hover:border-white/20'
              } p-6 transition-all duration-300`}
            >
              {plan.highlighted && (
                <>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                      <div className="relative px-4 py-1.5 bg-[#00BFFF]/10 backdrop-blur-sm rounded-full border border-[#00BFFF]/30">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-1 h-1 rounded-full bg-[#00BFFF] animate-pulse" />
                          <span className="text-xs font-medium text-white">
                            Most Popular
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-medium text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm text-[#808080]">
                      per user/{isAnnual ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#B0B0B0] mt-4">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-[#4CAF50]" strokeWidth={3} />
                    <span className="text-sm text-[#B0B0B0]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="block">
                <button
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white hover:from-[#0099CC] hover:to-[#0088BB]'
                      : 'border border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
