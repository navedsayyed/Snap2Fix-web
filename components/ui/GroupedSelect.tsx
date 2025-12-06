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
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={cn(
                        'w-full px-4 py-2.5 pr-10 rounded-lg border transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        'appearance-none bg-white',
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-[#4CAF50] focus:ring-green-100'
                    )}
                >
                    <option value="">Select {label.toLowerCase()}</option>
                    {groups.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                            {group.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
};
