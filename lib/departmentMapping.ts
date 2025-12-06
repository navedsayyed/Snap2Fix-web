/**
 * Department Assignment Logic
 * Determines which department should handle a complaint based on issue type
 */

import { IssueType, Department } from './types';

/**
 * Map issue types to departments
 */
const ISSUE_TO_DEPARTMENT: Record<string, Department> = {
    'Computer': 'IT Support',
    'Projector': 'IT Support',
    'Network': 'IT Support',
    'AC': 'Infrastructure',
    'Furniture': 'Infrastructure',
    'Electrical': 'Infrastructure',
    'Plumbing': 'Infrastructure',
    'Lighting': 'Infrastructure',
    'Other': 'Administration',
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
 * Get department based on floor (for QR code scans)
 * This is a fallback when location doesn't specify department
 * @param floor - Floor name
 * @returns Department name
 */
export function getDepartmentByFloor(floor: string): Department {
    // Default floor-based routing (can be customized)
    const floorMapping: Record<string, Department> = {
        'Ground Floor': 'Administration',
        'First Floor': 'IT Support',
        'Second Floor': 'IT Support',
        'Third Floor': 'Academic',
    };

    return floorMapping[floor] || 'Administration';
}

/**
 * Determine final department for complaint
 * Priority: Location department > Issue type department > Floor department
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
    // 1. If location has a department (from QR code), use it
    if (locationDepartment && isValidDepartment(locationDepartment)) {
        return locationDepartment as Department;
    }

    // 2. Otherwise, use issue type to determine department
    const issueDept = getDepartmentByIssueType(issueType);
    if (issueDept !== 'Administration') {
        return issueDept;
    }

    // 3. Fallback to floor-based routing
    if (floor) {
        return getDepartmentByFloor(floor);
    }

    // 4. Final fallback
    return 'Administration';
}

/**
 * Check if a string is a valid department
 */
function isValidDepartment(dept: string): boolean {
    const validDepartments: Department[] = [
        'IT Support',
        'Infrastructure',
        'Academic',
        'Library Services',
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
