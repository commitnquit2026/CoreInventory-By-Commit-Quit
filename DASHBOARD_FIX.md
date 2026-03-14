# Dashboard Loading Issue - Diagnostic & Fix

## Problem
Dashboard is unable to load data from the API endpoint.

## Root Causes to Check

1. **Backend Service Status**
   - Flask backend not running
   - API endpoint returning error
   - CORS issues

2. **Frontend Data Structure Mismatch**
   - API returns: `{ success: true, data: { kpis: {...}, ... } }`
   - Frontend expects: `response.data` to be the actual data object
   - Result: Trying to destructure `null` or nested object

3. **JWT Token Issues**
   - Token may be expired
   - Token validation failing

## Quick Fix

Update DashboardPage.jsx to handle both response structures:

```javascript
// Current (broken):
const response = await inventoryService.getDashboard(filters)
setData(response.data)  // This is the full response, not the data!

// Fixed:
const response = await inventoryService.getDashboard(filters)
setData(response.data.data)  // Get the actual data from response.data.data
```

OR add defensive checks:

```javascript
useEffect(() => {
  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')
      const response = await inventoryService.getDashboard(filters)
      // Handle both response structures
      const dashboardData = response?.data?.data || response?.data || response
      if (!dashboardData || !dashboardData.kpis) {
        throw new Error('Invalid response structure from dashboard API')
      }
      setData(dashboardData)
    } catch (loadError) {
      setError(loadError.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }
  loadDashboard()
}, [filters])
```

## Steps to Verify & Fix

1. **Check if backend is running**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test dashboard endpoint**
   ```bash
   # Login first
   TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"Test@123456"}' | jq -r '.token')
   
   # Then check dashboard
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/v1/inventory/dashboard
   ```

3. **Check browser console**
   - Open DevTools (F12)
   - Go to Network tab
   - Look for `/inventory/dashboard` request
   - Check response status and data

4. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Or clear browser cache completely

## Expected API Response Structure

```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalProductsInStock": 1234,
      "lowStockItems": 5,
      "pendingReceipts": 2,
      "pendingDeliveries": 3,
      "internalTransfers": 1
    },
    "stockLevels": [...],
    "categoryDistribution": [...],
    "movementTimeline": [...],
    "warehouseComparison": [...]
  }
}
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 422 Unprocessable Entity | Missing Category/Warehouse imports in backend |
| 401 Unauthorized | Invalid or expired JWT token |
| Network error | Backend not running |
| Blank dashboard | Data structure mismatch - check response format |
| "Cannot read properties" | Destructuring null - add null checks |

