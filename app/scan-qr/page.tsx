'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default function ScanQRPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const scannerRef = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        checkAuth();
        return () => {
            // Cleanup scanner on unmount
            stopScanner();
        };
    }, []);

    useEffect(() => {
        // Auto-start camera after loading is complete
        if (!loading) {
            startScanner();
        }
    }, [loading]);

    const checkAuth = async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const stopScanner = () => {
        if (scannerRef.current) {
            const tracks = scannerRef.current.getTracks();
            tracks.forEach((track: any) => track.stop());
            scannerRef.current = null;
        }
    };

    const startScanner = async () => {
        try {
            setScanning(true);
            setError('');

            // Request camera permission with high quality settings
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    aspectRatio: { ideal: 16/9 }
                } 
            });
            
            scannerRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                // Start scanning
                scanQRCode();
            }
        } catch (err: any) {
            setError('Unable to access camera. Please check permissions.');
            setScanning(false);
            console.error('Scanner error:', err);
        }
    };

    const scanQRCode = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const scanInterval = setInterval(async () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                try {
                    // Use jsQR library for scanning
                    const { default: jsQR } = await import('jsqr');
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        clearInterval(scanInterval);
                        stopScanner();

                        // Parse the URL and redirect
                        try {
                            const url = new URL(code.data);
                            const params = url.searchParams;
                            const redirectUrl = `/submit?${params.toString()}`;
                            router.push(redirectUrl);
                        } catch (err) {
                            router.push('/submit');
                        }
                    }
                } catch (err) {
                }
            }
        }, 100);
    };

    const skipQR = () => {
        router.push('/submit');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto"></div>
                    <p className="mt-4 text-[#B0B0B0]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center h-20">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-white hover:text-[#00BFFF] transition-colors duration-300 group"
                        >
                            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-semibold text-lg">Back</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Camera View - Full Screen */}
            <div className="fixed top-0 left-0 right-0 bottom-0 pt-20">
                {!scanning ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <div className="text-center">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-[#00BFFF] rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-2 border-4 border-[#0099CC] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                            </div>
                            <p className="text-white text-lg font-medium">Initializing Camera</p>
                            <p className="text-gray-400 text-sm mt-2">Please wait...</p>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full">
                        <video 
                            ref={videoRef} 
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Scanning Frame Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                            {/* Compulsory Step Notice */}
                            <div className="mb-6 bg-gradient-to-r from-[#00BFFF]/10 to-[#0099CC]/10 backdrop-blur-md px-6 py-2 rounded-full border border-[#00BFFF]/40">
                                <p className="text-white text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    QR Scanning is Compulsory
                                </p>
                            </div>

                            {/* Main Scanning Frame - Compact & Professional */}
                            <div className="relative">
                                <div className="w-64 h-64 relative">
                                    {/* Sleek Corner Brackets */}
                                    <div className="absolute -top-0.5 -left-0.5 w-14 h-14 border-t-[4px] border-l-[4px] border-[#00BFFF] rounded-tl-2xl" 
                                         style={{ filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))' }}>
                                    </div>
                                    <div className="absolute -top-0.5 -right-0.5 w-14 h-14 border-t-[4px] border-r-[4px] border-[#00BFFF] rounded-tr-2xl"
                                         style={{ filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))' }}>
                                    </div>
                                    <div className="absolute -bottom-0.5 -left-0.5 w-14 h-14 border-b-[4px] border-l-[4px] border-[#00BFFF] rounded-bl-2xl"
                                         style={{ filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))' }}>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-14 h-14 border-b-[4px] border-r-[4px] border-[#00BFFF] rounded-br-2xl"
                                         style={{ filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))' }}>
                                    </div>
                                    
                                    {/* Scanning Line */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent animate-scan-line" 
                                             style={{ filter: 'drop-shadow(0 0 4px rgba(0, 191, 255, 0.8))' }}>
                                        </div>
                                    </div>
                                    
                                    {/* Center Focus */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#00BFFF] rounded-full animate-ping opacity-75"></div>
                                        <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                
                                {/* Compact Status */}
                                <div className="mt-6 text-center">
                                    <div className="bg-black/80 backdrop-blur-md px-6 py-2.5 rounded-xl border border-[#00BFFF]/30 inline-flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        <div>
                                            <p className="text-white font-medium text-sm">Align QR Code</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="w-1.5 h-1.5 bg-[#00BFFF] rounded-full animate-pulse"></div>
                                                <p className="text-[#00BFFF] text-xs font-medium">Scanning...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Cancel Button - Professional */}
                            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10 px-4">
                                <button
                                    onClick={() => {
                                        stopScanner();
                                        router.push('/');
                                    }}
                                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 flex items-center gap-2 border border-red-500/50"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/95 p-6">
                        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-red-500/30 rounded-2xl p-8 max-w-md text-center shadow-2xl">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
                            <p className="text-red-400 mb-6">{error}</p>
                            
                            <div className="text-left space-y-4 mb-6">
                                <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Enable Camera Permission
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Grant camera access in your browser settings to scan QR codes
                                    </p>
                                </div>

                                <div className="text-center text-gray-500">— OR —</div>

                                <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        Use External QR Scanner
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        Scan the QR code using Google Lens, your phone's camera app, or any QR scanner
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    stopScanner();
                                    startScanner();
                                }}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg mb-3"
                            >
                                Try Again
                            </button>
                            
                            <button
                                onClick={() => router.push('/')}
                                className="w-full px-6 py-3 bg-[#2A2A2A] hover:bg-[#333333] text-white font-semibold rounded-xl transition-all duration-300"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                @keyframes scan-line {
                    0% {
                        top: 0%;
                    }
                    50% {
                        top: 100%;
                    }
                    100% {
                        top: 0%;
                    }
                }
                .animate-scan-line {
                    animation: scan-line 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
