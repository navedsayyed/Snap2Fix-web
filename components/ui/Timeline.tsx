/**
 * Timeline Component
 * Displays a vertical timeline of complaint status changes
 */

import React from 'react';
import { TimelineEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

export interface TimelineProps {
    events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
    if (!events || events.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

            {/* Timeline events */}
            <div className="space-y-6">
                {events.map((event, index) => {
                    const isLast = index === events.length - 1;
                    const isCompleted = event.status === 'Completed';

                    return (
                        <div key={index} className="relative flex gap-4">
                            {/* Icon */}
                            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                ? 'bg-green-500'
                                : isLast
                                    ? 'bg-blue-500'
                                    : 'bg-gray-400'
                                }`}>
                                {isCompleted ? (
                                    <svg width="20" height="20" className="text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : isLast ? (
                                    <div className="w-3 h-3 bg-white rounded-full" />
                                ) : (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{event.status}</h4>
                                        {event.description && (
                                            <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                                        )}
                                        {event.technician && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                👤 {event.technician.name}
                                            </p>
                                        )}
                                    </div>
                                    <time className="text-sm text-gray-500 whitespace-nowrap">
                                        {formatDateTime(event.timestamp)}
                                    </time>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
