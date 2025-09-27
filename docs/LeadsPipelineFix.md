# Leads Pipeline Stages Update Issue - Fix Guide

## 🚨 **Problem Description**
जब users leads को drag & drop करके different pipeline stages में move करते हैं, तो stages properly update नहीं हो रहे हैं। यह issue कई reasons से हो सकता है।

## 🔍 **Root Causes Identified**

### 1. **Missing API Call**
- `moveLead` function में API call commented out था
- Only local state update हो रहा था, backend में नहीं

### 2. **Incomplete Query Invalidation**
- `useUpdateLead` hook में सभी relevant queries invalidate नहीं हो रहे थे
- Leads data refresh नहीं हो रहा था

### 3. **Missing Response Handling**
- `updateLead` API function में response return नहीं हो रहा था
- Error handling incomplete था

## ✅ **Solutions Implemented**

### 1. **Fixed moveLead Function**
```javascript
const moveLead = useCallback(
    async (lead, toStageId, isMultiple = false) => {
        if (toStageId === "unknown") return;

        try {
            // Get stage name for logging
            const stageName = stages?.find((s) => s.id === toStageId)?.name || "Unknown Stage";
            
            // Create follow-up payload for stage change
            const payload = {
                type: "lead",
                target_id: lead.id,
                comment: `Stage changed to: ${stageName}`,
                stages: toStageId.toString(),
                text: "Stage Change",
            };

            // Add follow-up to track stage change
            if (toStageId !== "unknown") {
                await addFollowUp(payload);
            }

            // Update local state immediately for smooth UX
            setLeadsData((prevLeads) => {
                // ... state update logic
            });

            // Show success message
            toast.success(`Lead moved to ${stageName} successfully!`);

        } catch (error) {
            console.error('Error moving lead:', error);
            toast.error('Failed to move lead. Please try again.');
        }
    },
    [addFollowUp, stages, toast]
);
```

### 2. **Enhanced Query Invalidation**
```javascript
onSuccess: () => {
    toast.success("Lead updated!");
    queryClient.invalidateQueries({ queryKey: ["lead"] });
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
    queryClient.invalidateQueries({ queryKey: ["portalCalls"] });
    queryClient.invalidateQueries({ queryKey: ["phoneView"] });
},
```

### 3. **Fixed API Response Handling**
```javascript
export async function updateLead(id, payload) {
    const url = `${getApiUrl()}/properties/update_lead/${id}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update lead!");
        
        const responseData = await res.json();
        return responseData; // Now returning response
    } catch (err) {
        throw new Error(err.message);
    }
}
```

## 🔧 **How It Works Now**

### 1. **Drag & Drop Process**
1. User lead को drag करता है
2. `moveLead` function call होता है
3. API call होता है (follow-up create)
4. Local state update होता है
5. Success message show होता है
6. Data refresh होता है

### 2. **Data Flow**
```
Drag & Drop → moveLead() → API Call → State Update → UI Refresh → Data Sync
```

### 3. **Error Handling**
- API call fail होने पर error message show होता है
- Local state revert हो सकता है
- User को retry option मिलता है

## 📋 **Files Modified**

1. **`src/pages/leads/LeadBasedonStage.jsx`**
   - `moveLead` function fixed
   - API call uncommented
   - Error handling added
   - Toast notifications added

2. **`src/features/leads/useUpdateLead.js`**
   - Query invalidation enhanced
   - All relevant queries included

3. **`src/services/apiLeads.js`**
   - `updateLead` function response handling fixed

## 🧪 **Testing Steps**

### 1. **Basic Functionality**
- Lead को different stage में drag करें
- Check करें कि stage change हो रहा है
- Success message show हो रहा है

### 2. **Data Persistence**
- Page refresh करें
- Check करें कि stage change persist हो रहा है
- Database में update हो रहा है

### 3. **Error Scenarios**
- Network issue simulate करें
- Check करें कि error handling work कर रहा है
- User को proper feedback मिल रहा है

## 🚀 **Additional Improvements**

### 1. **Real-time Updates**
- WebSocket integration for live updates
- Optimistic updates for better UX

### 2. **Batch Operations**
- Multiple leads को एक साथ move करने का option
- Bulk stage updates

### 3. **Audit Trail**
- Stage change history tracking
- User activity logging

## ⚠️ **Important Notes**

1. **API Endpoints**: Ensure backend endpoints are working correctly
2. **Permissions**: Check user permissions for stage changes
3. **Validation**: Validate stage transitions (business rules)
4. **Performance**: Monitor API response times
5. **Error Logging**: Proper error logging for debugging

## 🔍 **Troubleshooting**

### If Issues Persist:

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests

2. **Verify API Endpoints**
   - Test API calls manually
   - Check response status codes

3. **Database Verification**
   - Check if data is being saved
   - Verify table structure

4. **User Permissions**
   - Ensure user has stage change permissions
   - Check role-based access

## 📞 **Support**

अगर कोई और issue है तो:
1. Browser console में error check करें
2. Network tab में API calls verify करें
3. Backend logs check करें
4. Database में data verify करें 