/**
 * Grouped Select Component
 * Dropdown with category grouping support
 */

import React from 'react';
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
    return (
        <div>
            <label className="block text-sm font-medium text-white mb-1.5">
                {label}
                {required && <span className="text-[#F44336] ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={cn(
                        'w-full px-4 py-2.5 pr-10 rounded-lg border transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#121212]',
                        'appearance-none bg-[#2C2C2C] text-white',
                        error
                            ? 'border-[#F44336] focus:border-[#F44336] focus:ring-[#F44336]/20'
                            : 'border-[#404040] focus:border-[#00BFFF] focus:ring-[#00BFFF]/20'
                    )}
                >
                    <option value="" className="bg-[#2C2C2C] text-white">Select {label.toLowerCase()}</option>
                    {groups.map((group) => (
                        <optgroup key={group.label} label={group.label} className="bg-[#2C2C2C] text-white">
                            {group.options.map((option) => (
                                <option key={option.value} value={option.value} className="bg-[#2C2C2C] text-white">
                                    {option.label}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B0B0B0]">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
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
