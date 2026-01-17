/**
 * Grouped Select Component
 * Custom modal dropdown with category grouping support
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectGroup {
    label: string;
    options: SelectOption[];
}

export interface GroupedSelectProps {
    label: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    helperText?: string;
    groups: SelectGroup[];
}

export const GroupedSelect: React.FC<GroupedSelectProps> = ({
    label,
    required = false,
    value,
    onChange,
    error,
    helperText,
    groups,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Find selected option label
    const selectedLabel = groups
        .flatMap(g => g.options)
        .find(opt => opt.value === value)?.label || `Select ${label.toLowerCase()}...`;

    const handleSelect = (optionValue: string) => {
        // Create synthetic event for onChange
        const syntheticEvent = {
            target: { value: optionValue, name: 'complaint_type' }
        } as React.ChangeEvent<HTMLSelectElement>;
        
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-white mb-2">
                {label}
                {required && <span className="text-[#00BFFF] ml-1">*</span>}
            </label>
            
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                    'w-full px-3.5 py-2.5 pr-10 rounded-lg border-2 transition-all duration-200 text-sm text-left',
                    'focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30',
                    'bg-[#2C2C2C] text-white font-medium',
                    'hover:border-[#00BFFF] hover:shadow-lg',
                    'shadow-sm relative',
                    error
                        ? 'border-[#F44336] focus:border-[#F44336]'
                        : 'border-[#404040] focus:border-[#00BFFF]'
                )}
            >
                <span className={value ? 'text-white' : 'text-gray-400'}>
                    {selectedLabel}
                </span>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="bg-[#00BFFF]/10 rounded-lg p-1">
                        <svg width="16" height="16" className="text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col border border-[#404040]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#00BFFF] to-[#0099CC] px-5 py-4 rounded-t-2xl">
                            <h3 className="text-white font-bold text-lg text-center">Select Complaint Type</h3>
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto flex-1">
                            {groups.map((group) => (
                                <div key={group.label}>
                                    {/* Category Header */}
                                    <div className="px-4 py-2.5 bg-[#2C2C2C] sticky top-0 z-10 border-b border-[#404040]/50">
                                        <p className="text-[#00BFFF] font-bold text-xs uppercase tracking-wider">
                                            {group.label}
                                        </p>
                                    </div>
                                    
                                    {/* Options */}
                                    <div className="bg-[#1E1E1E]">
                                        {group.options.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleSelect(option.value)}
                                                className={cn(
                                                    'w-full text-left px-4 py-3 text-sm font-medium transition-colors',
                                                    'hover:bg-[#2C2C2C] border-b border-[#2C2C2C]/50',
                                                    value === option.value 
                                                        ? 'bg-[#00BFFF]/10 text-[#00BFFF]' 
                                                        : 'text-white'
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {value === option.value && (
                                                        <svg className="w-5 h-5 text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <div className="p-4 border-t border-[#404040]">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-2.5 bg-[#2C2C2C] hover:bg-[#363636] text-[#00BFFF] font-semibold rounded-lg transition-colors border border-[#404040]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-[#F44336] flex items-center gap-2">
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
