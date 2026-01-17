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
            <label className="block text-sm font-semibold text-white mb-2">
                {label}
                {required && <span className="text-[#00BFFF] ml-1">*</span>}
            </label>
            <div className="relative group">
                <select
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={cn(
                        'w-full px-3.5 py-2.5 pr-10 rounded-lg border-2 transition-all duration-200 text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30',
                        'appearance-none bg-[#2C2C2C] text-white font-medium',
                        'hover:border-[#00BFFF] hover:shadow-lg cursor-pointer',
                        'shadow-sm',
                        error
                            ? 'border-[#F44336] focus:border-[#F44336]'
                            : 'border-[#404040] focus:border-[#00BFFF]'
                    )}
                    style={{
                        backgroundImage: 'none',
                        backgroundColor: '#2C2C2C',
                        color: 'white',
                        maxHeight: '350px'
                    }}
                >
                    <option value="" className="bg-[#2C2C2C] text-gray-400 font-normal py-2">
                        Select {label.toLowerCase()}...
                    </option>
                    {groups.map((group) => (
                        <optgroup 
                            key={group.label} 
                            label={`━━━ ${group.label} ━━━`}
                            className="bg-[#1E1E1E] text-[#00BFFF] font-bold"
                            style={{
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                letterSpacing: '0.05em',
                                padding: '8px 6px 6px 6px',
                                marginTop: '2px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {group.options.map((option) => (
                                <option 
                                    key={option.value} 
                                    value={option.value} 
                                    className="bg-[#2C2C2C] text-white font-normal"
                                    style={{
                                        paddingLeft: '16px',
                                        paddingTop: '6px',
                                        paddingBottom: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <div className="bg-[#00BFFF]/10 rounded-lg p-1 group-hover:bg-[#00BFFF]/20 transition-colors">
                        <svg width="16" height="16" className="text-[#00BFFF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
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
