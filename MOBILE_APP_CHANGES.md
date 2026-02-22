# 📱 Mobile App Changes - Manual Routing

**Quick Summary:** Add one function to your React Native app so super_admin can manually assign complaints to departments.

---

## 🎯 What You Need to Change

Your mobile app needs 1 simple change: Add a function that calls the API when super_admin selects a department.

---

## 📝 Step-by-Step Changes

### Step 1: Add This Function to Your App

Add this function to your department assignment screen (wherever the 5 department buttons are):

```javascript
// ============================================
// Manual Department Assignment Function
// ============================================
const assignDepartmentToComplaint = async (complaintId, selectedDepartment) => {
  try {
    console.log(`🔄 Assigning complaint ${complaintId} to ${selectedDepartment}...`);
    
    const response = await fetch(
      `https://snap2fix.vercel.app/api/complaint/${complaintId}/update-department`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: selectedDepartment
        })
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log('✅ Department assigned successfully!');
      console.log('✅ Notifications sent to floor admin, department admin, and technicians');
      
      // Show success message to user
      Alert.alert(
        'Success!',
        `Complaint assigned to ${selectedDepartment} department. Team notified.`,
        [{ text: 'OK' }]
      );
      
      // Navigate back or refresh list
      // navigation.goBack();
      
    } else {
      console.error('❌ Failed to assign department:', result.error);
      Alert.alert('Error', 'Failed to assign department. Please try again.');
    }

  } catch (error) {
    console.error('❌ Error assigning department:', error);
    Alert.alert('Error', 'Network error. Please check your connection.');
  }
};
```

---

### Step 2: Wire Your Department Buttons

Find your 5 department buttons and add `onPress` to call the function:

```javascript
// ============================================
// Department Selection Screen
// ============================================
import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';

function AssignDepartmentScreen({ route, navigation }) {
  const { complaintId } = route.params; // Get complaint ID from navigation

  // Paste the assignDepartmentToComplaint function here
  const assignDepartmentToComplaint = async (complaintId, selectedDepartment) => {
    // ... (function from Step 1)
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Assign to Department
      </Text>

      {/* Civil Department Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#3B82F6', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => assignDepartmentToComplaint(complaintId, 'Civil')}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          🏗️ Civil Department
        </Text>
      </TouchableOpacity>

      {/* Electrical Department Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#EF4444', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => assignDepartmentToComplaint(complaintId, 'Electrical')}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          ⚡ Electrical Department
        </Text>
      </TouchableOpacity>

      {/* Mechanical Department Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#F59E0B', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => assignDepartmentToComplaint(complaintId, 'Mechanical')}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          ⚙️ Mechanical Department
        </Text>
      </TouchableOpacity>

      {/* IT Department Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#8B5CF6', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => assignDepartmentToComplaint(complaintId, 'IT')}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          💻 IT Department
        </Text>
      </TouchableOpacity>

      {/* Housekeeping Department Button */}
      <TouchableOpacity
        style={{ backgroundColor: '#10B981', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={() => assignDepartmentToComplaint(complaintId, 'Housekeeping')}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          🧹 Housekeeping Department
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default AssignDepartmentScreen;
```

---

## 🔍 Important Notes

### Valid Department Names (must match exactly):
- `'Civil'`
- `'Electrical'`
- `'Mechanical'`
- `'IT'`
- `'Housekeeping'`

⚠️ **Case-sensitive!** Use exact capitalization.

---

## ✅ Testing

### Test Flow:
1. **Create a test complaint:**
   - Type: "Other"
   - Let AI analyze it

2. **Wait for AI:**
   - If AI is unsure → complaint_type = "Administration"
   - Super_admin gets notification: "⚠️ AI Needs Help"

3. **Super_admin opens app:**
   - Sees list of "Administration" complaints
   - Taps complaint to assign department
   - Opens "Assign Department" screen

4. **Super_admin selects department:**
   - Taps "Civil" button (or any department)
   - App calls API
   - Success alert appears

5. **Verify notifications sent:**
   - Floor admin gets: "👁️ Complaint Manually Routed on Your Floor"
   - Department admin gets: "📋 Complaint Manually Routed to Your Department"
   - Technicians get: "🔧 New Complaint Assigned by Admin"

---

## 🎨 If You Already Have UI

If you already have department selection UI, just add the function and call it:

```javascript
// Your existing button code:
<Button 
  title="Civil Department"
  onPress={() => {
    // Add this line:
    assignDepartmentToComplaint(complaintId, 'Civil');
  }}
/>
```

---

## 🚨 Common Issues

### Issue 1: "Network request failed"
**Solution:** Check your API URL is correct: `https://snap2fix.vercel.app`

### Issue 2: "Department is required"
**Solution:** Make sure you're passing exact department name: `'Civil'`, not `'civil'` or `'CIVIL'`

### Issue 3: "Complaint not found"
**Solution:** Verify `complaintId` is passed correctly to the screen

### Issue 4: Nothing happens when button pressed
**Solution:** Add `console.log(complaintId, selectedDepartment)` at start of function to debug

---

## 📊 What Happens After You Click

```
User clicks "Civil Department" button
    ↓
App calls: fetch('https://snap2fix.vercel.app/api/complaint/123/update-department')
    ↓
Backend updates database: complaint_type = 'Civil'
    ↓
Backend sends 3 types of notifications:
    ├─ Floor Admin (monitoring) → "👁️ Complaint on Your Floor"
    ├─ Civil Admin (solver) → "📋 Complaint in Your Department"  
    └─ Civil Technicians (workers) → "🔧 New Complaint Assigned"
    ↓
Success! Alert shows "Team notified"
```

---

## 🎯 Summary

**Only 2 things to add:**

1. ✅ Add `assignDepartmentToComplaint()` function
2. ✅ Call it when department button pressed: `onPress={() => assignDepartmentToComplaint(id, 'Civil')}`

**Backend is already done!** Just add these 2 things to your mobile app.

---

## 💡 Quick Copy-Paste

**For existing department selection code:**

```javascript
// 1. Add function at top of component
const assignDepartmentToComplaint = async (complaintId, selectedDepartment) => {
  const response = await fetch(
    `https://snap2fix.vercel.app/api/complaint/${complaintId}/update-department`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department: selectedDepartment })
    }
  );
  
  const result = await response.json();
  
  if (result.success) {
    Alert.alert('Success!', `Assigned to ${selectedDepartment} department`);
  } else {
    Alert.alert('Error', 'Failed to assign department');
  }
};

// 2. Wire to buttons
onPress={() => assignDepartmentToComplaint(complaintId, 'Civil')}
onPress={() => assignDepartmentToComplaint(complaintId, 'Electrical')}
onPress={() => assignDepartmentToComplaint(complaintId, 'Mechanical')}
onPress={() => assignDepartmentToComplaint(complaintId, 'IT')}
onPress={() => assignDepartmentToComplaint(complaintId, 'Housekeeping')}
```

**That's it! 🎉**
