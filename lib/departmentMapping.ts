/**
 * Department Assignment Logic
 * Determines which department should handle a complaint based on issue type
 */

import { IssueType, Department } from './types';

/**
 * Map issue types to departments - MATCHING React Native App
 */
const ISSUE_TO_DEPARTMENT: Record<string, Department> = {
    // ===== CIVIL DEPARTMENT (Infrastructure) =====
    'wall': 'Civil',
    'floor-ceiling': 'Civil',
    'furniture-door': 'Civil',
    'civil-other': 'Civil',
    
    // ===== ELECTRICAL DEPARTMENT =====
    'lighting': 'Electrical',
    'fan': 'Electrical',
    'switch': 'Electrical',
    'electrical-other': 'Electrical',
    
    // ===== MECHANICAL DEPARTMENT =====
    'ac': 'Mechanical',
    'plumbing': 'Mechanical',
    'drainage': 'Mechanical',
    'mechanical-other': 'Mechanical',
    
    // ===== IT DEPARTMENT =====
    'computer': 'IT',
    'projector': 'IT',
    'network': 'IT',
    'it-other': 'IT',
    
    // ===== HOUSEKEEPING DEPARTMENT =====
    'cleanliness': 'Housekeeping',
    'washroom': 'Housekeeping',
    'garbage': 'Housekeeping',
    'housekeeping-other': 'Housekeeping',
    
    // ===== GENERAL OTHER (AI Routing) =====
    'other': 'Administration', // AI determines actual department
};

/**
 * Get department based on issue type
 * @param issueType - Type of issue reported
 * @returns Department name
 */
export function getDepartmentByIssueType(issueType: string): Department {
    return ISSUE_TO_DEPARTMENT[issueType] || 'Administration';
}

/**
 * Get department based on floor (for QR code scans) - MATCHING React Native App
 * This is for ORIGIN tracking only
 * @param floor - Floor number
 * @returns Department name
 */
export function getDepartmentByFloor(floor: string): Department {
    const floorMapping: Record<string, Department> = {
        '1': 'Civil',
        '2': 'First Year',
        '3': 'IT',
        '4': 'Electrical',
        '5': 'Mechanical',
    };

    return floorMapping[floor] || 'Administration';
}

/**
 * Determine final department for complaint
 * Priority: Issue type department > Floor department > Location department
 * @param issueType - Type of issue
 * @param locationDepartment - Department from QR code location (if any)
 * @param floor - Floor name (fallback)
 * @returns Final department assignment
 */
export function determineDepartment(
    issueType: string,
    locationDepartment?: string,
    floor?: string
): Department {
    // 1. ALWAYS use issue type to determine department FIRST
    // Example: Computer -> IT Support, Electrical -> Infrastructure, etc.
    const issueDept = getDepartmentByIssueType(issueType);
    if (issueDept !== 'Administration') {
        return issueDept;
    }

    // 2. If issue type doesn't have specific department, use floor
    if (floor) {
        return getDepartmentByFloor(floor);
    }

    // 3. Use location department as fallback
    if (locationDepartment && isValidDepartment(locationDepartment)) {
        return locationDepartment as Department;
    }

    // 4. Final fallback
    return 'Administration';
}

/**
 * Check if a string is a valid department - MATCHING React Native App
 */
function isValidDepartment(dept: string): boolean {
    const validDepartments: Department[] = [
        'Civil',
        'Electrical',
        'Mechanical',
        'IT',
        'Housekeeping',
        'Administration'
    ];
    return validDepartments.includes(dept as Department);
}

/**
 * Get issue types for a specific department
 * @param department - Department name
 * @returns Array of issue types handled by that department
 */
export function getIssueTypesByDepartment(department: Department): string[] {
    return Object.entries(ISSUE_TO_DEPARTMENT)
        .filter(([_, dept]) => dept === department)
        .map(([issue, _]) => issue);
}
