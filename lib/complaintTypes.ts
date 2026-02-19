/**
 * Complaint Types - Matching Mobile App Structure
 * Organized by department categories
 */

export interface ComplaintType {
    label: string;
    value: string;
    category: string;
    requiresCustomType?: boolean;
}

export const COMPLAINT_TYPES: ComplaintType[] = [
    // ===== INFRASTRUCTURE (Civil Department) - Top 3 + Other =====
    { label: 'Wall/Paint Damage', value: 'wall', category: 'Infrastructure' },
    { label: 'Floor/Ceiling Damage', value: 'floor-ceiling', category: 'Infrastructure' },
    { label: 'Furniture/Door Repair', value: 'furniture-door', category: 'Infrastructure' },
    { label: 'Other Infrastructure', value: 'civil-other', category: 'Infrastructure', requiresCustomType: true },

    // ===== ELECTRICAL - Top 3 + Other =====
    { label: 'Lighting Problem', value: 'lighting', category: 'Electrical' },
    { label: 'Fan Not Working', value: 'fan', category: 'Electrical' },
    { label: 'Switch/Socket Issue', value: 'switch', category: 'Electrical' },
    { label: 'Other Electrical', value: 'electrical-other', category: 'Electrical', requiresCustomType: true },

    // ===== MECHANICAL - Top 3 + Other =====
    { label: 'Air Conditioning', value: 'ac', category: 'Mechanical' },
    { label: 'Plumbing/Water', value: 'plumbing', category: 'Mechanical' },
    { label: 'Drainage Problem', value: 'drainage', category: 'Mechanical' },
    { label: 'Other Mechanical', value: 'mechanical-other', category: 'Mechanical', requiresCustomType: true },

    // ===== IT/TECHNICAL - Top 3 + Other =====
    { label: 'Computer/Desktop', value: 'computer', category: 'IT/Technical' },
    { label: 'Projector/Display', value: 'projector', category: 'IT/Technical' },
    { label: 'Internet/Network', value: 'network', category: 'IT/Technical' },
    { label: 'Other IT/Technical', value: 'it-other', category: 'IT/Technical', requiresCustomType: true },

    // ===== HOUSEKEEPING - Top 3 + Other =====
    { label: 'Cleanliness', value: 'cleanliness', category: 'Housekeeping' },
    { label: 'Washroom/Toilet', value: 'washroom', category: 'Housekeeping' },
    { label: 'Garbage/Waste', value: 'garbage', category: 'Housekeeping' },
    { label: 'Other Housekeeping', value: 'housekeeping-other', category: 'Housekeeping', requiresCustomType: true },

    // ===== GENERAL OTHER (AI Routing) =====
    { label: 'General Other', value: 'other', category: 'Other', requiresCustomType: true }
];

/**
 * Get complaint types grouped by category
 */
export function getComplaintTypesByCategory(): Record<string, ComplaintType[]> {
    const grouped: Record<string, ComplaintType[]> = {};

    COMPLAINT_TYPES.forEach(type => {
        if (!grouped[type.category]) {
            grouped[type.category] = [];
        }
        grouped[type.category].push(type);
    });

    return grouped;
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
    return Array.from(new Set(COMPLAINT_TYPES.map(t => t.category)));
}

/**
 * Get department from complaint type - MATCHING React Native App
 */
export function getDepartmentFromType(typeValue: string): string {
    const type = COMPLAINT_TYPES.find(t => t.value === typeValue);
    if (!type) return 'Administration';

    const categoryToDepartment: Record<string, string> = {
        'Infrastructure': 'Civil',
        'Electrical': 'Electrical',
        'Mechanical': 'Mechanical',
        'IT/Technical': 'IT',
        'Housekeeping': 'Housekeeping',
        'Other': 'Administration'
    };

    return categoryToDepartment[type.category] || 'Administration';
}
