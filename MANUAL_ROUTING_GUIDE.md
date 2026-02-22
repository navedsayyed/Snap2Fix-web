# Manual Routing Notification System

This system sends notifications when a super_admin manually routes a complaint from "Administration" to a specific department (Civil, Electrical, Mechanical, IT, or Housekeeping).

## 📱 What Gets Notified

When complaint_type changes from `Administration` → `Civil/Electrical/etc`:

1. **Floor Admin** (if floor exists) - "👁️ Complaint Manually Routed on Your Floor"
2. **Department Admin** - "📋 Complaint Manually Routed to Your Department"  
3. **Technicians** - "🔧 New Complaint Assigned by Admin"

---

## 🔧 Implementation Options

### Option 1: API Endpoint (RECOMMENDED) ✅

Use this when updating complaint_type from your mobile app.

**Endpoint:** `PATCH /api/complaint/[id]/update-department`

**Request:**
```json
{
  "department": "IT"
}
```

**Example (Mobile App):**
```javascript
// When super_admin selects department from dropdown
const updateDepartment = async (complaintId, selectedDepartment) => {
  const response = await fetch(`${API_URL}/api/complaint/${complaintId}/update-department`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      department: selectedDepartment  // 'Civil', 'Electrical', 'IT', etc.
    })
  });
  
  const result = await response.json();
  if (result.success) {
    console.log('✅ Department updated and notifications sent!');
  }
};
```

**What it does:**
1. Updates `complaint_type` in database
2. Sends notifications to floor admin
3. Sends notifications to department admin + technicians
4. Returns success response

---

### Option 2: Database Webhook (AUTOMATIC) 🔔

Use this if you update `complaint_type` directly in the database (via Supabase dashboard, SQL, or direct app updates).

**Setup Steps:**

1. **Enable Supabase Webhook:**
   - Go to Supabase Dashboard → Database → Webhooks
   - Click "Create a new webhook"
   - Configure:
     ```
     Name: manual-routing-notification
     Table: complaints
     Events: UPDATE
     Type: HTTP Request
     Method: POST
     URL: https://your-domain.vercel.app/api/webhooks/manual-route
     HTTP Headers: 
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer your-webhook-secret-here"
     }
     ```

2. **Add Condition Filter:**
   In the webhook settings, add this condition to only trigger on manual routing:
   ```sql
   (OLD.complaint_type IS DISTINCT FROM NEW.complaint_type) 
   AND (OLD.complaint_type IN ('Administration', 'AI_PENDING'))
   AND NEW.complaint_type NOT IN ('Administration', 'AI_PENDING')
   ```

3. **Set Environment Variable:**
   Add to your `.env` file:
   ```
   WEBHOOK_SECRET=your-secure-random-string-here
   ```

**What it does:**
- Automatically detects when `complaint_type` changes
- Triggers webhook to `/api/webhooks/manual-route`
- Sends same notifications as Option 1

---

### Option 3: Database Trigger (ADVANCED) ⚙️

Use this if neither Option 1 nor 2 work for your setup.

**Setup:**
```sql
-- Run this SQL in Supabase SQL Editor
-- See: database/manual_routing_webhook.sql for full code

CREATE EXTENSION IF NOT EXISTS pg_net;

-- Then run the trigger creation code from the file
```

> ⚠️ **Note:** Requires `pg_net` extension and may not be available on all Supabase plans.

---

## 🎯 Recommended Flow

**For Mobile App Development:**
```
User submits "other" complaint
    ↓
AI analyzes (shows "AI Analyzing..." in UI)
    ↓
AI returns low confidence → complaint_type = "Administration"
    ↓
super_admin gets notification
    ↓
super_admin opens app, sees "ASSIGN TO DEPARTMENT" screen
    ↓
super_admin selects department (Civil/Electrical/etc)
    ↓
App calls: PATCH /api/complaint/[id]/update-department
    ↓
✅ Notifications sent to:
   - Floor admin (monitoring)
   - Department admin (solving)
   - Technicians (working)
```

---

## 📊 Notification Flow Comparison

| Scenario | Floor Admin | Department Admin | Technicians | Super Admin |
|----------|-------------|------------------|-------------|-------------|
| Normal complaint (Computer, Electrical, etc) | ✅ Notified | ✅ Notified | ✅ Notified | ❌ Not notified |
| AI_PENDING (analyzing) | ❌ Not notified | ❌ Not notified | ❌ Not notified | ❌ Not notified |
| AI High Confidence | ✅ Notified | ✅ Notified | ✅ Notified | ❌ Not notified |
| AI Low Confidence → Administration | ❌ Not notified | ❌ Not notified | ❌ Not notified | ✅ Notified |
| **Manual Routing (super_admin)** | ✅ Notified | ✅ Notified | ✅ Notified | ❌ Not notified |

---

## 🔍 Testing

Test the manual routing notification:

1. **Create test complaint:**
   ```sql
   -- In Supabase SQL Editor
   UPDATE complaints 
   SET complaint_type = 'Administration' 
   WHERE id = 'your-test-complaint-id';
   ```

2. **Trigger manual routing:**
   - **Option 1:** Call API endpoint with Postman/curl
   - **Option 2:** Update directly in Supabase and let webhook trigger
   
3. **Check logs:**
   - Vercel logs should show notification activity
   - Mobile app should receive push notifications

---

## 📝 Files Created

- ✅ `app/api/complaint/[id]/update-department/route.ts` - API endpoint
- ✅ `app/api/webhooks/manual-route/route.ts` - Webhook handler
- ✅ `database/manual_routing_webhook.sql` - Database trigger setup
- ✅ `MANUAL_ROUTING_GUIDE.md` - This guide

---

## 💡 Quick Start

**From your mobile app:**
```javascript
// After super_admin selects department
await fetch(`${API_URL}/api/complaint/${complaintId}/update-department`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ department: 'IT' })
});
```

That's it! Notifications will be sent automatically. 🎉
