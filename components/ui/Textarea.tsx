/**
 * Textarea Component
 * Multi-line text input with label and error handling
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helperText, showCharCount, id, maxLength, value, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const charCount = typeof value === 'string' ? value.length : 0;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-white mb-1.5"
                    >
                        {label}
                        {props.required && <span className="text-[#F44336] ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    maxLength={maxLength}
                    value={value}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-lg border border-[#404040] bg-[#2C2C2C] text-white',
                        'placeholder:text-[#B0B0B0]',
                        'focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent',
                        'disabled:bg-[#1E1E1E] disabled:cursor-not-allowed',
                        'transition-all duration-200',
                        'resize-y min-h-[100px]',
                        error && 'border-[#F44336] focus:ring-[#F44336]',
                        className
                    )}
                    {...props}
                />
                <div className="flex justify-between items-start mt-1.5">
                    <div className="flex-1">
                        {error && (
                            <p className="text-sm text-[#F44336] flex items-center gap-1">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p className="text-sm text-[#B0B0B0]">{helperText}</p>
                        )}
                    </div>
                    {showCharCount && maxLength && (
                        <p className="text-sm text-[#B0B0B0] ml-2">
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
