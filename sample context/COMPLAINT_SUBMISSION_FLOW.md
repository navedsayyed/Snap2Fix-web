# User Complaint Submission - Data Flow Analysis

## Overview
This document provides a comprehensive analysis of what happens when a user submits a complaint in the application, including all data stored, notifications sent, and system outputs.

---

## 1. Complaint Data Stored in Database

When the user clicks "Submit Complaint," the following information is saved to the `complaints` table:

### Required Fields:
- **`user_id`** - The authenticated user's unique ID (UUID)
- **`title`** - Complaint title (or custom type + title if "Other" is selected)
- **`type`** - Original complaint type (e.g., "computer", "electrical", "civil")
- **`description`** - Detailed description of the problem
- **`location`** - Where the issue is located
- **`place`** - Specific place/room identifier
- **`status`** - Automatically set to `'in-progress'`
- **`created_at`** - Timestamp (auto-generated)

### Optional/Conditional Fields:
- **`department`** - Auto-determined from complaint type OR floor mapping
- **`complaint_type`** - Department name stored for HOD filtering
- **`floor`** - Floor number (if QR code was scanned)
- **`class`** - Class/room number (if provided)
- **`assigned_to`** - Initially `null` (set later by HOD/Admin)

---

## 2. Image Upload

After complaint creation, the system uploads the complaint photo:

- **Stored in:** Supabase Storage (complaint images bucket)
- **Database record in:** `complaint_images` table
  - `complaint_id` - Links to the complaint
  - `url` - Public URL to access the image
  - `storage_path` - Internal storage path
  - `created_at` - Upload timestamp

---

## 3. Notification Records Created

The system creates notification entries in the `notifications` table for multiple recipients.

### Recipients:
1. **Floor Department Admin** - Admin responsible for the floor where the complaint originated
2. **Complaint Type Department Admin** - Admin for the specific complaint type (e.g., IT admin for computer issues)
3. **All Technicians in Complaint Type Department** - Technicians who can handle that type of complaint

### Notification Data Stored:
```typescript
{
  user_id: [recipient_id],          // Who receives the notification
  complaint_id: [new_complaint_id],  // Which complaint
  type: 'complaint_created',         // Notification type
  title: "New Complaint",            // Notification title
  message: "[User] filed: [Title]",  // Notification message
  is_read: false,                    // Initially unread
  created_at: [timestamp]            // When created
}
```

---

## 4. Push Notifications Sent

The system triggers push notifications via Supabase Edge Function to:
- Send FCM (Firebase Cloud Messaging) notifications to recipient devices
- Recipients get real-time alerts even if app is closed
- Notifications include complaint details for quick access

---

## 5. Console Logging

The following is logged to console for debugging:

```typescript
// During complaint creation:
console.log('Creating complaint:', {
  type: complaintData.type,
  mappedDepartment: department,
});

// During notification routing:
console.log('📋 Notification routing:', {
  complaintType: payload.complaintType,
  typeDepartment: [mapped_dept],
  floorDepartment: [floor_dept],
});

console.log('📢 Sending notifications:', payload);
console.log(`📬 Found ${recipients.length} recipients`);
```

---

## 6. UI Feedback

- **Success Animation:** Green checkmark animation shown
- **Form Reset:** All fields cleared
- **Navigation:** User redirected to "Tasks" screen after 1.2 seconds
- **Error Handling:** Alert messages shown if:
  - Missing required fields (title, type, location, place, description)
  - Missing photo
  - Not authenticated
  - Database/upload errors
  - Image upload failures (warning shown, but complaint still created)

---

## 7. Return Value from `createComplaint`

```typescript
{
  data: {
    id: "generated_id",
    user_id: "user_uuid",
    title: "complaint_title",
    type: "complaint_type",
    description: "description",
    location: "location",
    place: "place",
    department: "auto_mapped_dept",
    complaint_type: "department_name",
    floor: "floor_number",
    class: "class_name",
    status: "in-progress",
    created_at: "2026-01-04T...",
    assigned_to: null,
    completed_at: null,
    completion_notes: null,
    completion_image_url: null,
    completion_image_path: null
  },
  error: null
}
```

---

## 8. Department Routing Logic

The system determines which department/admin to notify using a two-tier approach:

### Priority 1: Floor-based Routing (if QR code scanned)
- If user scanned a QR code, the floor number is captured
- Floor is mapped to a specific department using `getDepartmentFromFloor()`
- Example: Floor 1 → Civil Department

### Priority 2: Complaint Type Routing
- Complaint type is mapped to department using `getDepartmentFromComplaintType()`
- Mapping examples:
  - "computer" → IT Department
  - "electrical" → Electrical Department
  - "civil" → Civil Department
  - "plumbing" → Civil Department
  - "furniture" → Civil Department

### Dual Notification Strategy:
If a complaint has both floor and type information:
- **Floor department admin** is notified (responsible for that physical location)
- **Type department admin & technicians** are notified (have expertise to fix the issue)

Example: User on Floor 1 (Civil) files "Computer" complaint
- Civil Admin gets notified (floor responsibility)
- IT Admin gets notified (type expertise)
- IT Technicians get notified (can handle the work)

---

## 9. Validation Rules

Before submission, the system validates:

1. **Required Fields:** title, type, location, place, description must not be empty
2. **Image Required:** At least one photo must be attached
3. **Custom Type:** If "Other" is selected as type, a custom type description is required
4. **Authentication:** User must be logged in with valid session

---

## 10. Complete Submission Flow

```
User fills form → Validates → Creates complaint record → Uploads image → 
Creates notification records → Sends push notifications → Shows success → 
Resets form → Navigates to Tasks screen
```

### Step-by-Step Process:

1. **Validation Check**
   - Verify all required fields
   - Check image is attached
   - Verify user authentication

2. **Complaint Creation**
   - Insert complaint into database
   - Auto-assign department based on routing logic
   - Set status to "in-progress"

3. **Image Upload**
   - Upload photo to Supabase Storage
   - Create image record with URL and path

4. **Notification Distribution**
   - Query for relevant admins and technicians
   - Create notification records for each recipient
   - Trigger push notifications via Edge Function

5. **User Feedback**
   - Display success animation (1.2 seconds)
   - Reset all form fields
   - Navigate to Tasks screen

---

## Summary

### When a user submits a complaint, the system outputs:

✅ **1 complaint record** in `complaints` table  
✅ **1 image upload** to Supabase Storage  
✅ **1 image metadata record** in `complaint_images` table  
✅ **Multiple notification records** in `notifications` table (for admins & technicians)  
✅ **Push notifications** sent to all recipients via FCM  
✅ **Console logs** for debugging and tracking  
✅ **UI success feedback** to user  

### Data Visibility:

- **User:** Can view their complaint in "My Complaints" section
- **Floor Admin:** Sees complaint in their dashboard (floor responsibility)
- **Type Admin:** Sees complaint in their dashboard (expertise responsibility)
- **Technicians:** Can view unassigned complaints in their department
- **After Assignment:** Specific technician sees it in "My Tasks"

---

## Related Files

- **Submission Logic:** `src/screens/user/ComplaintForm.tsx` (line 301)
- **Database Functions:** `src/config/supabaseClient.ts` (line 165)
- **Notification Manager:** `src/services/notificationManager.ts`
- **Department Mapping:** `src/utils/departmentMapping.ts`
- **Database Schema:** `sql/create_notifications_table.sql`

---

**Last Updated:** January 4, 2026
