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
    const inputRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setPreview(null);
            setFileName(null);
            setFileSize(null);
            onChange(null);
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate file type
        if (!accept.split(',').includes(file.type)) {
            alert('Only JPEG and PNG images are allowed');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setFileName(file.name);
        setFileSize(file.size);
        onChange(file);
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
                                <p className="text-xs text-[#B0B0B0]">{fileSize && formatFileSize(fileSize)}</p>
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
