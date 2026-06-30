/**
 * Pricing Page
 * Pricing information for Snap2Fix services
 */

'use client';

import Link from 'next/link';
import Pricing from '@/components/ui/pricing-component';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#121212] dotted-background">
            {/* Header */}
            <header className="sticky top-0 z-50 pt-4 pb-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3">
                        <div className="flex items-center h-10">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 text-white hover:text-gray-300 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-lg font-bold">Pricing</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pricing Component */}
            <Pricing />
        </div>
    );
}
