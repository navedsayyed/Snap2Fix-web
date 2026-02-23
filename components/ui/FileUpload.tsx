/**
 * FileUpload Component
 * Image upload with preview and validation
 */

'use client';

import React, { useState, useRef } from 'react';
import { cn, formatFileSize } from '@/lib/utils';

export interface FileUploadProps {
    label?: string;
    error?: string;
    helperText?: string;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSize?: number; // in MB
    required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    label,
    error,
    helperText,
    onChange,
    accept = 'image/jpeg,image/jpg,image/png',
    maxSize = 5,
    required = false,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);

    // Professional image compression function
    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }
                    
                    // Calculate new dimensions
                    // For very large images (>10MB), use 1280px max for better compression
                    // For normal images, use 1920px max
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = file.size > 10 * 1024 * 1024 ? 1280 : 1920;
                    
                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw image with high quality
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Determine quality based on original file size
                    // Larger files get more aggressive compression
                    let quality = 0.85; // Default
                    if (file.size > 10 * 1024 * 1024) {
                        quality = 0.75; // Very large files
                    } else if (file.size > 5 * 1024 * 1024) {
                        quality = 0.80; // Large files
                    }
                    
                    // Convert to blob with compression
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Could not compress image'));
                                return;
                            }
                            
                            // Create new file from compressed blob
                            const compressedFile = new File(
                                [blob],
                                file.name.replace(/\.[^/.]+$/, '.jpg'),
                                { type: 'image/jpeg', lastModified: Date.now() }
                            );
                            
                            const originalMB = (file.size / 1024 / 1024).toFixed(2);
                            const compressedMB = (compressedFile.size / 1024 / 1024).toFixed(2);
                            const ratio = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
                            
                            console.log('📸 Image Compression:');
                            console.log(`   Original: ${originalMB} MB`);
                            console.log(`   Compressed: ${compressedMB} MB`);
                            console.log(`   Saved: ${ratio}% smaller`);
                            
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        quality
                    );
                };
                
                img.onerror = () => reject(new Error('Could not load image'));
            };
            
            reader.onerror = () => reject(new Error('Could not read file'));
        });
    };

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            setPreview(null);
            setFileName(null);
            setFileSize(null);
            onChange(null);
            return;
        }

        // Validate file type
        if (!accept.split(',').includes(file.type)) {
            alert('Only JPEG and PNG images are allowed');
            return;
        }

        // Allow large files (up to 50MB) since we'll compress them
        // This handles modern phone cameras that take 5-20MB photos
        if (file.size > 50 * 1024 * 1024) {
            alert('File is too large. Please choose a smaller image.');
            return;
        }

        try {
            setIsCompressing(true);
            
            // Compress image automatically
            const compressedFile = await compressImage(file);
            
            // Validate compressed size (should be much smaller now)
            if (compressedFile.size > maxSize * 1024 * 1024) {
                alert(`Compressed image is still too large (${(compressedFile.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${maxSize}MB.`);
                setIsCompressing(false);
                return;
            }
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(compressedFile);

            setFileName(compressedFile.name);
            setFileSize(compressedFile.size);
            onChange(compressedFile);
        } catch (error) {
            console.error('Image compression failed:', error);
            alert('Failed to compress image. Please try again.');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        handleFileChange(null);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-white mb-1.5">
                    {label}
                    {required && <span className="text-[#F44336] ml-1">*</span>}
                </label>
            )}

            {/* Image Compression Loading Overlay */}
            {isCompressing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border-2 border-[#333333] rounded-2xl p-5 sm:p-6 max-w-sm w-full text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Compressing Image...</h3>
                        <p className="text-xs sm:text-sm text-[#B0B0B0]">Optimizing photo for faster upload</p>
                    </div>
                </div>
            )}

            {!preview ? (
                <>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            'border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer transition-all duration-200',
                            isDragging
                                ? 'border-[#00BFFF] bg-[#2C2C2C]'
                                : error
                                    ? 'border-[#F44336] bg-[#2C2C2C]'
                                    : 'border-[#404040] hover:border-[#00BFFF] hover:bg-[#2C2C2C]'
                        )}
                    >
                        <svg
                            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#B0B0B0]"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="mt-2 text-xs sm:text-sm text-[#B0B0B0] px-2">
                            <span className="font-semibold text-[#00BFFF]">Click to upload</span>
                            <span className="hidden sm:inline"> or drag and drop</span>
                        </p>
                        <p className="mt-1 text-[10px] sm:text-xs text-[#B0B0B0]">
                            PNG or JPEG • Large photos auto-compressed
                        </p>
                        <p className="mt-2 text-[10px] sm:text-xs text-[#00BFFF]/80 flex items-center justify-center gap-1 px-2">
                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="text-center leading-tight">Optimized automatically for faster upload</span>
                        </p>
                    </div>
                    
                    {/* Camera Button */}
                    <div className="mt-3 sm:mt-4">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                cameraRef.current?.click();
                            }}
                            className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Take Photo
                        </button>
                    </div>
                </>
            ) : (
                <div className="relative">
                    <div 
                        onClick={() => setShowFullImage(true)}
                        className="relative group cursor-pointer"
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg border-2 border-[#404040] transition-all duration-200 group-hover:border-[#00BFFF]"
                        />
                        {/* View Full Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-sm sm:text-base font-semibold">View Full Image</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between bg-[#2C2C2C] p-2 sm:p-3 rounded-lg border border-[#404040]">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg width="18" height="18" className="sm:w-5 sm:h-5 text-[#B0B0B0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-white truncate">{fileName}</p>
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <p className="text-[10px] sm:text-xs text-[#B0B0B0]">{fileSize && formatFileSize(fileSize)}</p>
                                    <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[9px] sm:text-[10px] font-semibold text-[#00BFFF]">
                                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Optimized
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="ml-1 sm:ml-2 p-1 sm:p-1.5 rounded-full hover:bg-[#404040] transition-colors flex-shrink-0"
                        >
                            <svg width="18" height="18" className="sm:w-5 sm:h-5 text-[#B0B0B0] hover:text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
            />

            <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
            />

            {error && (
                <p className="mt-1.5 text-sm text-[#F44336] flex items-center gap-1">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-[#B0B0B0]">{helperText}</p>
            )}

            {/* Full Image Viewer Modal */}
            {showFullImage && preview && (
                <div 
                    className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setShowFullImage(false)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowFullImage(false)}
                            className="absolute -top-10 sm:-top-12 right-0 p-1.5 sm:p-2 text-white hover:text-[#00BFFF] transition-colors z-10"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Full Image */}
                        <img
                            src={preview}
                            alt="Full size preview"
                            className="w-full h-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Image Info Bar */}
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 rounded-b-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00BFFF] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold truncate">{fileName}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-300">{fileSize && formatFileSize(fileSize)}</p>
                                    </div>
                                </div>
                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#00BFFF]/20 border border-[#00BFFF]/50 rounded-full text-[10px] sm:text-xs font-semibold text-[#00BFFF] flex-shrink-0">
                                    Optimized
                                </span>
                            </div>
                        </div>

                        {/* Tap to close hint */}
                        <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                            <p className="text-white text-xs sm:text-sm">Tap anywhere to close</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
