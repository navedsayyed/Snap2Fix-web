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
                    
                    // Calculate new dimensions (max 1920x1920 for quality)
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 1920;
                    
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
                    
                    // Convert to blob with compression (0.85 quality is professional standard)
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
                            
                            console.log('Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
                            console.log('Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
                            console.log('Compression ratio:', ((1 - compressedFile.size / file.size) * 100).toFixed(0) + '%');
                            
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        0.85 // Professional quality setting
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

        // Validate file size (before compression)
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (!accept.split(',').includes(file.type)) {
            alert('Only JPEG and PNG images are allowed');
            return;
        }

        try {
            setIsCompressing(true);
            
            // Compress image automatically
            const compressedFile = await compressImage(file);
            
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border-2 border-[#333333] rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
                        <div className="w-16 h-16 border-4 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-lg font-bold text-white mb-2">Compressing Image...</h3>
                        <p className="text-sm text-[#B0B0B0]">Optimizing photo for faster upload</p>
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
                            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
                            isDragging
                                ? 'border-[#00BFFF] bg-[#2C2C2C]'
                                : error
                                    ? 'border-[#F44336] bg-[#2C2C2C]'
                                    : 'border-[#404040] hover:border-[#00BFFF] hover:bg-[#2C2C2C]'
                        )}
                    >
                        <svg
                            className="mx-auto h-12 w-12 text-[#B0B0B0]"
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
                        <p className="mt-2 text-sm text-[#B0B0B0]">
                            <span className="font-semibold text-[#00BFFF]">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-[#B0B0B0]">
                            PNG or JPEG (max {maxSize}MB)
                        </p>
                        <p className="mt-2 text-xs text-[#00BFFF]/80 flex items-center justify-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            Auto-compressed for faster upload
                        </p>
                    </div>
                    
                    {/* Camera Button */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                cameraRef.current?.click();
                            }}
                            className="w-full py-3 px-4 bg-gradient-to-r from-[#00BFFF] to-[#0099CC] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00BFFF]/20 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            Take Photo
                        </button>
                    </div>
                </>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-[#404040]"
                    />
                    <div className="mt-2 flex items-center justify-between bg-[#2C2C2C] p-3 rounded-lg border border-[#404040]">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <svg width="20" height="20" className="text-[#B0B0B0] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{fileName}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-[#B0B0B0]">{fileSize && formatFileSize(fileSize)}</p>
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded text-[10px] font-semibold text-[#00BFFF]">
                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
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
                            className="ml-2 p-1.5 rounded-full hover:bg-[#404040] transition-colors"
                        >
                            <svg width="20" height="20" className="text-[#B0B0B0] hover:text-white" fill="currentColor" viewBox="0 0 20 20">
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
        </div>
    );
};
