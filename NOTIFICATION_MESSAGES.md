# 📱 Notification Message Guide

## Personalized Notification Messages

The system now sends **different notification messages** based on the recipient's role and responsibilities.

---

## 🎯 Message Types

### 1️⃣ **Technician Notification**
**Title:** 🔧 New Complaint Assigned  
**Body:** [Complaint type]: [Description preview]

**Who gets this:** All technicians in the department handling the complaint

**Example:**
```
Title: 🔧 New Complaint Assigned
Body: computer: Lab PC not working, screen shows no signal...
```

**When technician sees this:** "I have new work to do"

---

### 2️⃣ **Admin with BOTH Roles** (Floor Manager + Department Expert)
**Title:** 🔔 Complaint from Your Floor & Department  
**Body:** [Complaint type]: [Description preview]

**Who gets this:** Admin who manages BOTH the floor AND has expertise in the complaint type

**Example Scenarios:**
- **Floor 3 + Computer complaint** → IT Admin (manages Floor 3 AND handles computers)
- **Floor 4 + Fan complaint** → Electrical Admin (manages Floor 4 AND handles electrical)
- **Floor 5 + Plumbing** → Mechanical Admin (manages Floor 5 AND handles mechanical)

**Example:**
```
Title: 🔔 Complaint from Your Floor & Department
Body: computer: Lab PC not working, screen shows no signal...
```

**When admin sees this:** "This is on my floor AND my department handles it - I'm fully responsible"

---

### 3️⃣ **Floor Admin Only** (Monitoring)
**Title:** 👁️ Complaint from Your Floor  
**Body:** [Complaint type]: [Description preview]

**Who gets this:** Admin who manages the floor but does NOT have expertise to solve

**Example Scenarios:**
- **Floor 1 (Civil) + Computer complaint** → Civil Admin monitors
- **Floor 2 (First Year) + Electrical complaint** → First Year Admin monitors
- **Floor 3 (IT) + Plumbing complaint** → IT Admin monitors

**Example:**
```
Title: 👁️ Complaint from Your Floor
Body: computer: Lab PC not working, screen shows no signal...
```

**When admin sees this:** "This is happening on my floor, but another department will solve it"

---

### 4️⃣ **Department Admin Only** (Solver)
**Title:** 🛠️ Complaint for Your Department  
**Body:** [Complaint type]: [Description preview]

**Who gets this:** Admin with expertise to solve, but complaint is NOT on their floor

**Example Scenarios:**
- **Floor 1 + Computer complaint** → IT Admin (not their floor, but their expertise)
- **Floor 3 + Electrical complaint** → Electrical Admin (not their floor, but their expertise)
- **Floor 2 + Housekeeping** → Housekeeping Admin (no floor, but their expertise)

**Example:**
```
Title: 🛠️ Complaint for Your Department
Body: computer: Lab PC not working, screen shows no signal...
```

**When admin sees this:** "My department will handle this (not on my floor)"

---

## 📊 Complete Examples

### **Example 1: Computer complaint from Floor 3**

**Complaint Details:**
- Floor: 3 (IT department)
- Type: Computer (IT department)
- ➡️ Same department handles BOTH floor and type

**Notifications Sent:**

| Recipient | Title | Message Type |
|-----------|-------|--------------|
| **Mr. P.C. Patil** (IT Admin) | 🔔 Complaint from Your Floor & Department | MERGED |
| **Rajesh Kumar** (IT Technician) | 🔧 New Complaint Assigned | TECHNICIAN |
| **Amit Shah** (IT Technician) | 🔧 New Complaint Assigned | TECHNICIAN |

**Total:** 3 notifications (1 admin gets merged message, 2 technicians get work assignment)

---

### **Example 2: Computer complaint from Floor 1**

**Complaint Details:**
- Floor: 1 (Civil department)
- Type: Computer (IT department)
- ➡️ Different departments (Civil monitors, IT solves)

**Notifications Sent:**

| Recipient | Title | Message Type |
|-----------|-------|--------------|
| **Mr. A.G. Chaudhari** (Civil Admin) | 👁️ Complaint from Your Floor | MONITORING |
| **Mr. P.C. Patil** (IT Admin) | 🛠️ Complaint for Your Department | SOLVING |
| **Rajesh Kumar** (IT Technician) | 🔧 New Complaint Assigned | TECHNICIAN |
| **Amit Shah** (IT Technician) | 🔧 New Complaint Assigned | TECHNICIAN |

**Total:** 4 notifications (2 admins with different messages, 2 technicians)

---

### **Example 3: Fan complaint from Floor 4**

**Complaint Details:**
- Floor: 4 (Electrical department)
- Type: Fan (Electrical department)
- ➡️ Same department handles BOTH

**Notifications Sent:**

| Recipient | Title | Message Type |
|-----------|-------|--------------|
| **Mr. B.G. Dabhade** (Electrical Admin) | 🔔 Complaint from Your Floor & Department | MERGED |
| **Suresh Patil** (Electrical Technician) | 🔧 New Complaint Assigned | TECHNICIAN |

**Total:** 2 notifications (1 admin gets merged message, 1 technician)

---

### **Example 4: Housekeeping complaint from Floor 2**

**Complaint Details:**
- Floor: 2 (First Year department)
- Type: Cleanliness (Housekeeping department)
- ➡️ Different departments (First Year monitors, Housekeeping solves)

**Notifications Sent:**

| Recipient | Title | Message Type |
|-----------|-------|--------------|
| **Mr. Umakant Butkar** (First Year Admin) | 👁️ Complaint from Your Floor | MONITORING |
| **Mr. Vinayak Apsingkar** (Housekeeping Admin) | 🛠️ Complaint for Your Department | SOLVING |
| **Pradeep Sharma** (Housekeeping Technician) | 🔧 New Complaint Assigned | TECHNICIAN |

**Total:** 3 notifications (2 admins with different messages, 1 technician)

---

## 🔍 How It Works

### Step 1: System identifies recipients
```
Floor 3 + Computer complaint
├─ Floor Admin: IT Admin (manages Floor 3)
└─ Department Team: IT Admin + IT Technicians (handle computers)
```

### Step 2: Check for overlap
```
IT Admin appears in BOTH lists
├─ Is Floor Admin? ✅ Yes
└─ Is Department Admin? ✅ Yes
   → Send MERGED notification (both roles)
```

### Step 3: Send personalized messages
```
For each recipient:
├─ Is Technician? → "🔧 New Complaint Assigned"
├─ Is Admin with both roles? → "🔔 Complaint from Your Floor & Department"
├─ Is Floor Admin only? → "👁️ Complaint from Your Floor"
└─ Is Department Admin only? → "🛠️ Complaint for Your Department"
```

---

## 🎨 Message Icons Meaning

| Icon | Meaning | Role |
|------|---------|------|
| 🔧 | Work tool | Technician - You have work to do |
| 🔔 | Bell | Admin with both roles - Full responsibility |
| 👁️ | Eye | Floor admin - Monitoring only |
| 🛠️ | Wrench | Department admin - Solving responsibility |

---

## 💡 Why Different Messages?

### **Old System (Problem):**
Everyone got the same generic message:
```
📝 New Complaint Filed
computer: Lab PC not working...
```
- ❌ Not clear why they're receiving it
- ❌ Admin with both roles got duplicate notifications
- ❌ Technicians didn't know if it's assigned to them

### **New System (Solution):**
Personalized messages based on role:
```
Technician: "🔧 New Complaint Assigned" → "I need to work on this"
Floor Admin: "👁️ Complaint from Your Floor" → "I'm monitoring this"
Dept Admin: "🛠️ Complaint for Your Department" → "My team will solve this"
Both Roles: "🔔 Complaint from Your Floor & Department" → "I'm fully responsible"
```
- ✅ Clear why they're receiving it
- ✅ One notification for admins with both roles
- ✅ Technicians know it's a work assignment

---

## 📝 Testing Guide

### Test 1: Same Department (Merged Message)
```
Complaint: Floor 3 + Computer
Expected:
├─ IT Admin: "🔔 Complaint from Your Floor & Department"
└─ IT Technicians: "🔧 New Complaint Assigned"
```

### Test 2: Different Departments
```
Complaint: Floor 1 + Computer
Expected:
├─ Civil Admin: "👁️ Complaint from Your Floor"
├─ IT Admin: "🛠️ Complaint for Your Department"
└─ IT Technicians: "🔧 New Complaint Assigned"
```

### Test 3: No Floor Technicians
```
Complaint: Any Floor + Housekeeping
Expected:
├─ Floor Admin: "👁️ Complaint from Your Floor"
├─ Housekeeping Admin: "🛠️ Complaint for Your Department"
└─ Housekeeping Technicians: "🔧 New Complaint Assigned"
```

---

## 🔧 Implementation Details

**Location:** `app/api/submit/route.ts` → `sendPushNotifications()`

**Key Logic:**
```typescript
for (const userId of userIds) {
    const isFloorAdmin = floorAdminIds.has(userId);
    const isDepartmentAdmin = departmentAdminIds.has(userId);
    const isTechnician = technicianIds.has(userId);
    
    if (isTechnician) {
        title = '🔧 New Complaint Assigned';
    } else if (isFloorAdmin && isDepartmentAdmin) {
        title = '🔔 Complaint from Your Floor & Department';
    } else if (isFloorAdmin) {
        title = '👁️ Complaint from Your Floor';
    } else if (isDepartmentAdmin) {
        title = '🛠️ Complaint for Your Department';
    }
}
```

**Each user gets a personalized notification** - no more generic mass messages!

---

## ✅ Summary

✅ Technicians get clear work assignment messages  
✅ Admins with both roles get merged notification (no duplicates)  
✅ Floor admins know they're monitoring  
✅ Department admins know they're solving  
✅ Messages are role-specific and actionable
