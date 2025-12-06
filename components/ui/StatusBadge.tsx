/**
 * StatusBadge Component
 * Displays complaint status with appropriate color coding
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ComplaintStatus } from '@/lib/types';

export interface StatusBadgeProps {
    status: ComplaintStatus;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
    const statusConfig: Record<ComplaintStatus, { label: string; className: string; icon: string }> = {
        'Pending': {
            label: 'Pending',
            className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: '⏳',
        },
        'Assigned': {
            label: 'Assigned',
            className: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: '👤',
        },
        'In Progress': {
            label: 'In Progress',
            className: 'bg-orange-100 text-orange-800 border-orange-200',
            icon: '🔧',
        },
        'Completed': {
            label: 'Completed',
            className: 'bg-green-100 text-green-800 border-green-200',
            icon: '✅',
        },
        'Rejected': {
            label: 'Rejected',
            className: 'bg-red-100 text-red-800 border-red-200',
            icon: '❌',
        },
    };

    const config = statusConfig[status] || statusConfig['Pending'];

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 font-semibold border rounded-full',
                config.className,
                sizes[size],
                className
            )}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
        </span>
    );
};
