/**
 * Core TypeScript interfaces for the Complaint Management System
 * Matches the Supabase database schema
 */

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Rejected';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type UserRole = 'user' | 'admin' | 'technician' | 'super_admin';
export type CreatedVia = 'app' | 'web';

/**
 * Complaint interface matching the database schema
 */
export interface Complaint {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  department: string;
  floor: string;
  room_number: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  image_url: string | null;
  proof_image: string | null;
  technician_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  
  // Web-specific fields
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  created_via: CreatedVia;
  tracking_token: string;
  
  // Additional timestamp fields
  assigned_at: string | null;
  started_at: string | null;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  department: string | null;
  fcm_token: string | null;
  created_at: string;
}

/**
 * Location interface for QR code mapping
 */
export interface Location {
  id: string;
  name: string;
  floor: string;
  building?: string;
  department: string;
  created_at?: string;
}

/**
 * Timeline event for tracking page
 */
export interface TimelineEvent {
  status: string;
  timestamp: string;
  description?: string;
  technician?: {
    name: string;
  };
}

/**
 * Form data for complaint submission
 */
export interface ComplaintFormData {
  name: string;
  email: string;
  phone?: string;
  floor: string;
  room_number: string;
  issue_type: string;
  priority: ComplaintPriority;
  description: string;
  photo?: File;
}

/**
 * API response for complaint submission
 */
export interface SubmitComplaintResponse {
  success: boolean;
  complaintId?: string;
  trackingUrl?: string;
  error?: string;
}

/**
 * API response for fetching complaint
 */
export interface GetComplaintResponse {
  success: boolean;
  complaint?: ComplaintWithDetails;
  error?: string;
}

/**
 * Complaint with additional details for display
 */
export interface ComplaintWithDetails extends Complaint {
  technician?: {
    name: string;
    email: string;
  };
  timeline: TimelineEvent[];
  completed_notes?: string | null;
}

/**
 * Issue type mapping
 */
export const ISSUE_TYPES = [
  'Computer',
  'Projector',
  'AC',
  'Furniture',
  'Electrical',
  'Network',
  'Plumbing',
  'Lighting',
  'Other'
] as const;

export type IssueType = typeof ISSUE_TYPES[number];

/**
 * Floor options
 */
export const FLOORS = [
  'Ground Floor',
  'First Floor',
  'Second Floor',
  'Third Floor'
] as const;

export type Floor = typeof FLOORS[number];

/**
 * Department types
 */
export const DEPARTMENTS = [
  'IT Support',
  'Infrastructure',
  'Academic',
  'Library Services',
  'Administration'
] as const;

export type Department = typeof DEPARTMENTS[number];
