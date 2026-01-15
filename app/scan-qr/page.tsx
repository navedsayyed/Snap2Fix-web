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

            // Request camera permission
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
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
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#1A1A1A]">
            {/* Header */}
            <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16">
                        <Link href="/" className="flex items-center gap-2 text-[#B0B0B0] hover:text-[#00BFFF] transition-colors duration-300 group">
                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] via-[#0099CC] to-[#007ACC] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00BFFF]/40">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                        Scan QR Code
                    </h1>
                    <p className="text-[#B0B0B0] text-lg">
                        Scan the location QR code to auto-fill location details
                    </p>
                </div>

                {/* Scanner Container */}
                <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-[#404040]/50 rounded-2xl shadow-2xl p-6 mb-6">
                    {!scanning ? (
                        <div className="text-center py-12">
                            <div className="w-32 h-32 border-4 border-dashed border-[#00BFFF]/30 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-16 h-16 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <button
                                onClick={startScanner}
                                className="w-full px-8 py-4 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] hover:from-[#00BFFF]/90 hover:to-[#0099CC]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#00BFFF]/30 hover:shadow-[#00BFFF]/50 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Start Camera Scan
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <video 
                                ref={videoRef} 
                                className="w-full rounded-xl"
                                playsInline
                                muted
                            />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-4 border-[#00BFFF] rounded-2xl shadow-lg shadow-[#00BFFF]/50"></div>
                            </div>
                            <p className="text-center text-[#B0B0B0] mt-4 text-sm">
                                Position the QR code within the frame
                            </p>
                            <button
                                onClick={() => {
                                    stopScanner();
                                    setScanning(false);
                                }}
                                className="w-full mt-4 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-300"
                            >
                                Stop Scanning
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-[#2C2C2C]/50 border border-[#404040]/30 rounded-xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#00BFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Instructions
                    </h3>
                    <ul className="space-y-2 text-[#B0B0B0] text-sm">
                        <li className="flex items-start gap-2">
                            <span className="text-[#00BFFF] mt-1">•</span>
                            <span>Click "Start Camera Scan" to activate your device camera</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#00BFFF] mt-1">•</span>
                            <span>Point your camera at the location QR code</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#00BFFF] mt-1">•</span>
                            <span>The location details will be automatically filled in the form</span>
                        </li>
                    </ul>
                </div>

                {/* Skip Option */}
                <button
                    onClick={skipQR}
                    className="w-full px-6 py-3 bg-transparent border-2 border-[#404040] hover:border-[#00BFFF]/50 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-[#2C2C2C]"
                >
                    Skip QR Scan - Enter Location Manually
                </button>
            </main>
        </div>
    );
}
