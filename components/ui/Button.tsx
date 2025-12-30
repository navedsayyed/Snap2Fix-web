/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] disabled:opacity-50 disabled:cursor-not-allowed';

        const variants = {
            primary: 'bg-[#00BFFF] text-white hover:shadow-lg focus:ring-[#00BFFF] shadow-sm',
            secondary: 'bg-[#1E90FF] text-white hover:shadow-lg focus:ring-[#1E90FF] shadow-sm',
            outline: 'border-2 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white focus:ring-[#00BFFF]',
            ghost: 'text-[#B0B0B0] hover:bg-[#2C2C2C] hover:text-white focus:ring-[#404040]',
            danger: 'bg-[#F44336] text-white hover:shadow-lg focus:ring-[#F44336] shadow-sm',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm gap-1.5',
            md: 'px-4 py-2.5 text-base gap-2',
            lg: 'px-6 py-3.5 text-lg gap-2.5',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    isLoading && 'cursor-wait',
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <svg
                        width="16"
                        height="16"
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
