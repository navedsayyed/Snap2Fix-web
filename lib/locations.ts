/**
 * Location Mapping for QR Code System
 * Maps location IDs to their details (floor, department, etc.)
 */

import { Location } from './types';

export const LOCATIONS: Record<string, Location> = {
    // Ground Floor
    'reception': {
        id: 'reception',
        name: 'Reception',
        floor: 'Ground Floor',
        building: 'Main Building',
        department: 'Administration'
    },
    'library': {
        id: 'library',
        name: 'Library',
        floor: 'Ground Floor',
        building: 'Main Building',
        department: 'Library Services'
    },
    'canteen': {
        id: 'canteen',
        name: 'Canteen',
        floor: 'Ground Floor',
        building: 'Main Building',
        department: 'Infrastructure'
    },
    'auditorium': {
        id: 'auditorium',
        name: 'Auditorium',
        floor: 'Ground Floor',
        building: 'Main Building',
        department: 'Administration'
    },

    // First Floor
    'lab-101': {
        id: 'lab-101',
        name: 'Lab 101',
        floor: 'First Floor',
        building: 'Main Building',
        department: 'IT Support'
    },
    'lab-102': {
        id: 'lab-102',
        name: 'Lab 102',
        floor: 'First Floor',
        building: 'Main Building',
        department: 'IT Support'
    },
    'classroom-101': {
        id: 'classroom-101',
        name: 'Classroom 101',
        floor: 'First Floor',
        building: 'Main Building',
        department: 'Academic'
    },
    'classroom-102': {
        id: 'classroom-102',
        name: 'Classroom 102',
        floor: 'First Floor',
        building: 'Main Building',
        department: 'Academic'
    },

    // Second Floor
    'lab-201': {
        id: 'lab-201',
        name: 'Lab 201',
        floor: 'Second Floor',
        building: 'Main Building',
        department: 'IT Support'
    },
    'lab-202': {
        id: 'lab-202',
        name: 'Lab 202',
        floor: 'Second Floor',
        building: 'Main Building',
        department: 'IT Support'
    },
    'classroom-201': {
        id: 'classroom-201',
        name: 'Classroom 201',
        floor: 'Second Floor',
        building: 'Main Building',
        department: 'Academic'
    },
    'classroom-202': {
        id: 'classroom-202',
        name: 'Classroom 202',
        floor: 'Second Floor',
        building: 'Main Building',
        department: 'Academic'
    },

    // Third Floor
    'lab-301': {
        id: 'lab-301',
        name: 'Lab 301',
        floor: 'Third Floor',
        building: 'Main Building',
        department: 'IT Support'
    },
    'classroom-301': {
        id: 'classroom-301',
        name: 'Classroom 301',
        floor: 'Third Floor',
        building: 'Main Building',
        department: 'Academic'
    },
    'staff-room': {
        id: 'staff-room',
        name: 'Staff Room',
        floor: 'Third Floor',
        building: 'Main Building',
        department: 'Administration'
    },
};

/**
 * Get location details by ID
 * @param id - Location ID from QR code
 * @returns Location object or null if not found
 */
export function getLocationById(id: string): Location | null {
    return LOCATIONS[id] || null;
}

/**
 * Get all available locations
 * @returns Array of all locations
 */
export function getAllLocations(): Location[] {
    return Object.values(LOCATIONS);
}

/**
 * Get locations by floor
 * @param floor - Floor name
 * @returns Array of locations on that floor
 */
export function getLocationsByFloor(floor: string): Location[] {
    return Object.values(LOCATIONS).filter(loc => loc.floor === floor);
}

/**
 * Get locations by department
 * @param department - Department name
 * @returns Array of locations in that department
 */
export function getLocationsByDepartment(department: string): Location[] {
    return Object.values(LOCATIONS).filter(loc => loc.department === department);
}
