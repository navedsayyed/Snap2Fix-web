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
    // ===== INFRASTRUCTURE (Civil Department) =====
    { label: 'Wall/Paint Damage', value: 'wall', category: 'Infrastructure' },
    { label: 'Ceiling Damage', value: 'ceiling', category: 'Infrastructure' },
    { label: 'Floor Damage', value: 'floor', category: 'Infrastructure' },
    { label: 'Window/Glass Repair', value: 'window', category: 'Infrastructure' },
    { label: 'Door Repair', value: 'door', category: 'Infrastructure' },
    { label: 'Furniture Repair', value: 'furniture', category: 'Infrastructure' },
    { label: 'Building Structure', value: 'structure', category: 'Infrastructure' },
    { label: 'Other Infrastructure', value: 'civil-other', category: 'Infrastructure', requiresCustomType: true },

    // ===== ELECTRICAL (Electrical Department) =====
    { label: 'Electrical Wiring', value: 'electrical', category: 'Electrical' },
    { label: 'Lighting Problem', value: 'lighting', category: 'Electrical' },
    { label: 'Power Outage', value: 'power', category: 'Electrical' },
    { label: 'Switch/Socket Issue', value: 'switch', category: 'Electrical' },
    { label: 'Fan Not Working', value: 'fan', category: 'Electrical' },
    { label: 'Electrical Safety', value: 'electrical-safety', category: 'Electrical' },
    { label: 'Other Electrical', value: 'electrical-other', category: 'Electrical', requiresCustomType: true },

    // ===== MECHANICAL (Mechanical Department) =====
    { label: 'Air Conditioning', value: 'ac', category: 'Mechanical' },
    { label: 'Heating System', value: 'heating', category: 'Mechanical' },
    { label: 'Plumbing/Water', value: 'plumbing', category: 'Mechanical' },
    { label: 'Drainage Problem', value: 'drainage', category: 'Mechanical' },
    { label: 'Ventilation', value: 'ventilation', category: 'Mechanical' },
    { label: 'Elevator/Lift', value: 'elevator', category: 'Mechanical' },
    { label: 'Other Mechanical', value: 'mechanical-other', category: 'Mechanical', requiresCustomType: true },

    // ===== IT/TECHNICAL (IT Department) =====
    { label: 'Computer/Desktop', value: 'computer', category: 'IT/Technical' },
    { label: 'Projector/Display', value: 'projector', category: 'IT/Technical' },
    { label: 'Internet/Network', value: 'network', category: 'IT/Technical' },
    { label: 'Lab Equipment', value: 'lab', category: 'IT/Technical' },
    { label: 'Software Issue', value: 'software', category: 'IT/Technical' },
    { label: 'Printer/Scanner', value: 'printer', category: 'IT/Technical' },
    { label: 'Teaching Equipment', value: 'teaching', category: 'IT/Technical' },
    { label: 'Other IT/Technical', value: 'it-other', category: 'IT/Technical', requiresCustomType: true },

    // ===== HOUSEKEEPING (Housekeeping Department) =====
    { label: 'Cleanliness', value: 'cleanliness', category: 'Housekeeping' },
    { label: 'Washroom/Toilet', value: 'washroom', category: 'Housekeeping' },
    { label: 'Garbage/Waste', value: 'garbage', category: 'Housekeeping' },
    { label: 'Pest Control', value: 'pest', category: 'Housekeeping' },
    { label: 'Garden/Lawn', value: 'garden', category: 'Housekeeping' },
    { label: 'General Maintenance', value: 'maintenance', category: 'Housekeeping' },
    { label: 'Other Housekeeping', value: 'housekeeping-other', category: 'Housekeeping', requiresCustomType: true },

    // ===== GENERAL OTHER =====
    { label: 'Security Issue', value: 'security', category: 'Other' },
    { label: 'Fire Safety', value: 'fire', category: 'Other' },
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
 * Get department from complaint type
 */
export function getDepartmentFromType(typeValue: string): string {
    const type = COMPLAINT_TYPES.find(t => t.value === typeValue);
    if (!type) return 'Administration';

    const categoryToDepartment: Record<string, string> = {
        'Infrastructure': 'Infrastructure',
        'Electrical': 'Infrastructure',
        'Mechanical': 'Infrastructure',
        'IT/Technical': 'IT Support',
        'Housekeeping': 'Infrastructure',
        'Other': 'Administration'
    };

    return categoryToDepartment[type.category] || 'Administration';
}
