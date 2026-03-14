# System Architecture & Data Flow Diagram

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    COREINVENTORY SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

TIER 1: USER INTERFACE (React)
┌──────────────────────────────────────────────────────────────┐
│  ReceiptsPage  │  DeliveriesPage  │  MoveHistoryPage │ Menu  │
└────────┬───────────────┬───────────────┬──────────────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
TIER 2: API SERVICES (JavaScript)
┌──────────────────────────────────────────────────────────────┐
│  receiptService  │  deliveryService  │  moveHistoryService   │
└────────┬──────────────┬────────────────┬──────────────────────┘
         │              │                │
         └──────────────┼────────────────┘
                        │
TIER 3: HTTP INTERCEPTOR
┌──────────────────────────────────────────────────────────────┐
│  Add Authorization Header  │  Handle 401 Errors  │  Retry   │
└────────┬───────────────────────────────────────────────────────┘
         │
TIER 4: REST API (Flask)
┌──────────────────────────────────────────────────────────────┐
│ POST   /api/v1/receipt              ← Create receipt         │
│ GET    /api/v1/receipt/{id}         ← Get receipt details    │
│ POST   /api/v1/receipt/{id}/ready   ← Mark ready (reserve)   │
│ POST   /api/v1/receipt/{id}/done    ← Mark done (increment)  │
│                                                              │
│ POST   /api/v1/delivery             ← Create delivery        │
│ GET    /api/v1/delivery/{id}        ← Get delivery details   │
│ POST   /api/v1/delivery/{id}/ready  ← Mark ready (reserve)   │
│ POST   /api/v1/delivery/{id}/done   ← Mark done (decrement)  │
│                                                              │
│ GET    /api/v1/move-history         ← List all moves         │
│ GET    /api/v1/move-history/product/{id} ← Moves by product │
└────────┬────────────────────────────────────────────────────────┘
         │
TIER 5: BUSINESS LOGIC (Python)
┌──────────────────────────────────────────────────────────────┐
│  • Validate status transitions                               │
│  • Check stock availability                                  │
│  • Reserve stock on Ready                                    │
│  • Increment/Decrement stock on Done                         │
│  • Create stock move audit entries                           │
│  • Handle errors and rollback transactions                   │
└────────┬──────────────────────────────────────────────────────┘
         │
TIER 6: DATABASE (MySQL)
┌──────────────────────────────────────────────────────────────┐
│  Receipts       → Receipt Items    ↘                         │
│  Deliveries     → Delivery Items   → Stock → Stock Moves     │
│  Products       ↘                  ↙                         │
│  Locations      → Warehouses                                 │
│  Users          → Suppliers                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Receipt Workflow Data Flow

```
USER CREATES RECEIPT
        │
        ↓
[ReceiptForm Component]
├─ warehouse_id: 1
├─ supplier_id: 5
└─ items: [
    { product_id: 1, location_id: 2, quantity: 100, unit_price: 50 }
  ]
        │
        ↓ receiptService.create()
[POST /api/v1/receipt]
        │
        ↓ Backend receives
[Create Receipt in Draft status]
├─ receipt_number: REC-20260314-ABC123XY
├─ status: Draft
├─ warehouse_id: 1
└─ total_items: 100, total_value: 5000
        │
        ↓ [Create Receipt Items]
├─ product_id: 1
├─ location_id: 2
└─ quantity: 100
        │
        ↓ Database INSERT
[receipts table] + [receipt_items table]
        │
        ↓ RESPONSE: { id: 1, receipt_number, status: Draft }
[UI shows Receipt Detail page with items]
        │
        ↓ USER CLICKS "MARK AS READY"
[POST /api/v1/receipt/1/ready]
        │
        ↓ Backend validates
├─ Check all items filled ✓
├─ Get stock (product 1, location 2)
└─ If not exists: create stock record
        │
        ↓ Reserve stock
[stock table]
├─ quantity: 0 → 0 (no change)
├─ reserved: 0 → 100 (now reserved)
└─ available: 0 - 0 = 0
        │
        ↓ Update receipt
[receipts table] status: Ready
        │
        ↓ RESPONSE: { status: Ready }
[UI shows "Mark as Done" button]
        │
        ↓ USER CLICKS "MARK AS DONE"
[POST /api/v1/receipt/1/done]
        │
        ↓ Backend processes
For item in receipt_items:
├─ Get stock (product 1, location 2)
├─ Increment: quantity 0 → 100
├─ Release reserved: reserved 100 → 0
│
├─ Create stock_move:
│  ├─ product_id: 1
│  ├─ from_location_id: NULL (external source)
│  ├─ to_location_id: 2
│  ├─ quantity: 100
│  ├─ move_type: Receipt
│  ├─ reference_id: 1 (receipt ID)
│  └─ created_by: user_id
│
└─ Update receipt: status Done
        │
        ↓ RESPONSE: { status: Done }
[UI shows "Receipt Completed"]
        │
        ↓ Verify in Move History
[GET /api/v1/move-history/product/1]
Response includes:
├─ move_type: Receipt
├─ from_location_id: NULL
├─ to_location_id: 2
├─ quantity: 100
└─ created_at: timestamp
```

---

## 📊 Delivery Workflow Data Flow

```
USER CREATES DELIVERY
        │
        ↓
[DeliveryForm Component]
├─ warehouse_id: 1
└─ items: [
    { product_id: 1, location_id: 2, quantity: 25 }
  ]
        │
        ↓ deliveryService.create()
[POST /api/v1/delivery]
        │
        ↓ Backend receives
[Create Delivery in Draft status]
├─ delivery_number: DEL-20260314-XYZ789AB
├─ status: Draft
└─ total_items: 25
        │
        ↓ [Create Delivery Items]
├─ product_id: 1
├─ location_id: 2
└─ quantity: 25
        │
        ↓ RESPONSE: { id: 1, delivery_number, status: Draft }
[UI shows Delivery Detail page]
        │
        ↓ USER CLICKS "MARK AS WAITING"
[POST /api/v1/delivery/1/waiting]
        │
        ↓ Backend validates
For item in delivery_items:
├─ Get stock (product 1, location 2)
├─ Calculate available: quantity - reserved
│  └─ available: 100 - 0 = 100 ✓ (>= 25 needed)
└─ Status: Waiting
        │
        ↓ RESPONSE: { status: Waiting }
[UI shows "Mark as Ready" button]
        │
        ↓ USER CLICKS "MARK AS READY"
[POST /api/v1/delivery/1/ready]
        │
        ↓ Backend validates & reserves
For item in delivery_items:
├─ Get stock (product 1, location 2)
├─ available = quantity - reserved = 100 - 0 = 100
├─ Check: available >= 25? YES ✓
│
├─ Reserve: reserved 0 → 25
│  └─ New available: 100 - 25 = 75
│
└─ Update delivery: status Ready
        │
        ↓ RESPONSE: { status: Ready }
[UI shows "Mark as Done" button]
        │
        ↓ USER CLICKS "MARK AS DONE"
[POST /api/v1/delivery/1/done]
        │
        ↓ Backend processes
For item in delivery_items:
├─ Get stock (product 1, location 2)
├─ Check: quantity >= 25? YES ✓
│  └─ quantity: 100 >= 25
│
├─ Decrement: quantity 100 → 75
├─ Release reserved: reserved 25 → 0
│
├─ Create stock_move:
│  ├─ product_id: 1
│  ├─ from_location_id: 2 (warehouse location)
│  ├─ to_location_id: NULL (external destination)
│  ├─ quantity: 25
│  ├─ move_type: Delivery
│  ├─ reference_id: 1 (delivery ID)
│  └─ created_by: user_id
│
└─ Update delivery: status Done
        │
        ↓ RESPONSE: { status: Done }
[UI shows "Delivery Completed"]
        │
        ↓ Verify Move History
[GET /api/v1/move-history/location/2]
Response includes both moves:
├─ Receipt:  +100 units in (from NULL)
├─ Delivery: -25 units out (to NULL)
└─ Net: +75 units in location
```

---

## 💾 Stock State Transitions

```
INITIAL STATE (no stock)
┌────────────────────┐
│ quantity: 0        │
│ reserved: 0        │
│ available: 0       │
└────────────────────┘

AFTER RECEIPT MARKED READY (reserved)
┌────────────────────┐
│ quantity: 0        │
│ reserved: 100      │ ← Reserved for incoming
│ available: -100    │ ← (can't use, waiting)
└────────────────────┘

AFTER RECEIPT MARKED DONE (incremented)
┌────────────────────┐
│ quantity: 100      │ ← Stock increased
│ reserved: 0        │ ← Reservation released
│ available: 100     │ ← Ready to deliver
└────────────────────┘

AFTER DELIVERY MARKED READY (reserved)
┌────────────────────┐
│ quantity: 100      │
│ reserved: 25       │ ← Reserved for outgoing
│ available: 75      │ ← Can deliver this much
└────────────────────┘

AFTER DELIVERY MARKED DONE (decremented)
┌────────────────────┐
│ quantity: 75       │ ← Stock decreased
│ reserved: 0        │ ← Reservation released
│ available: 75      │ ← Remaining available
└────────────────────┘
```

---

## 🔄 Status Validation Matrix

| From State | To State | Validation | Action |
|-----------|----------|-----------|--------|
| Draft | Ready | All items filled | Reserve stock |
| Ready | Done | Status is Ready | Increment stock |
| Draft | Delete | Status is Draft | Delete record |
| Ready | Draft | Status is Ready | Unreserve stock |
| Done | (any) | BLOCKED | Read-only |
| | | | |
| Draft | Waiting | All items filled | Validate stock exists |
| Waiting | Ready | Stock available | Reserve stock |
| Ready | Done | Status is Ready | Decrement stock |
| Draft | Delete | Status is Draft | Delete record |
| Waiting | Draft | Status is Waiting | Unreserve stock |
| Done | (any) | BLOCKED | Read-only |

---

## 🎯 Error Scenarios & Handling

```
SCENARIO 1: Try to mark delivery as Ready without stock
┌──────────────────────────────────┐
│ POST /api/v1/delivery/1/ready    │
│ {                                │
│   available: 0,                  │
│   required: 25                   │
│ }                                │
└──────────────┬───────────────────┘
               │
               ↓ Backend validation
         Available (0) < Required (25)?
               │
               YES ✗
               │
               ↓ RETURN ERROR
         {
           success: false,
           message: "Insufficient stock. Available: 0, Required: 25",
           status: 400
         }
               │
               ↓ UI shows error message
         "Cannot mark ready - not enough stock"
               │
               ↓ Delivery stays in Waiting state
         (No changes made, transaction rolled back)
```

```
SCENARIO 2: Try to deliver more than available
┌──────────────────────────────────┐
│ POST /api/v1/delivery/1/done     │
│ {                                │
│   quantity: 100,                 │
│   available: 75                  │
│ }                                │
└──────────┬────────────────────────┘
           │
           ↓ Backend validation
    Quantity (100) <= Available (75)?
           │
           NO ✗
           │
           ↓ RETURN ERROR
    {
      success: false,
      message: "Insufficient stock. Available: 75, Required: 100",
      status: 400
    }
           │
           ↓ UI shows error message
    "Cannot complete - not enough stock"
           │
           ↓ Delivery stays in Ready state
    (No changes made, transaction rolled back)
```

```
SCENARIO 3: Concurrent operations on same stock
User A: Delivery 1 (qty: 50)  ┐
User B: Delivery 2 (qty: 50)  ├─ Both trying to reserve
Available Stock: 75            ┘

Timeline:
T1: User A marks Delivery 1 as Ready
    ├─ Check: available 75 >= 50? YES ✓
    ├─ Reserve: reserved 0 → 50
    └─ available: 75 - 50 = 25

T2: User B marks Delivery 2 as Ready
    ├─ Check: available 25 >= 50? NO ✗
    ├─ ERROR: "Insufficient stock"
    └─ No changes made

Result: ✓ Only Delivery 1 reserved
        ✓ Delivery 2 blocked
        ✓ Data consistency maintained
```

---

## 📈 Scale & Performance Considerations

### Indexes for Fast Queries
```
stock table:
├─ PRIMARY KEY (id)
├─ UNIQUE (product_id, location_id)  ← Fast lookups
└─ INDEX (product_id)                ← Fast filtering
   INDEX (location_id)               ← Fast filtering

stock_moves table:
├─ INDEX (product_id)                ← Get moves for product
├─ INDEX (created_at)                ← Get recent moves
├─ INDEX (move_type)                 ← Filter by type
└─ INDEX (reference_type, reference_id) ← Get moves for receipt/delivery
```

### Pagination
```
All list endpoints support:
├─ page: 1 (default)
├─ per_page: 10-100
└─ Returns: items, total, pages

Example:
GET /api/v1/move-history?page=2&per_page=20
```

### Filtering
```
Reduces data retrieved:
├─ GET /api/v1/receipt?status=Draft
├─ GET /api/v1/delivery?warehouse_id=1
├─ GET /api/v1/move-history?product_id=1&days=30
└─ Indexes make these fast
```

---

## ✅ Quality Assurance Checklist

- [x] No negative stock possible (constraint + validation)
- [x] No over-allocation possible (reserved stock tracking)
- [x] No data corruption (transactions + rollback)
- [x] No orphaned records (foreign key cascades)
- [x] Complete audit trail (stock_moves never deleted)
- [x] Fast queries (indexes on all keys)
- [x] Scalable design (pagination + filtering)
- [x] Error handling (try/catch + rollback)
- [x] Data validation (all inputs checked)
- [x] Status safety (strict transitions)

---

## 🎓 For Developers

When implementing UI components, follow this pattern:

```javascript
// 1. Load data
const [receipt, setReceipt] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  receiptService.get(id)
    .then(res => setReceipt(res.data))
    .catch(err => setError(err.message))
    .finally(() => setLoading(false))
}, [id])

// 2. Handle status transition
const handleMarkReady = async () => {
  try {
    setError('')
    const res = await receiptService.markReady(receipt.id)
    setReceipt({ ...receipt, status: 'Ready' })
    showSuccess('Receipt marked as Ready')
  } catch (err) {
    setError(err.message)  // "Insufficient stock" or other
  }
}

// 3. Render UI with status-appropriate actions
<div>
  {receipt.status === 'Draft' && (
    <button onClick={handleMarkReady}>Mark Ready</button>
  )}
  {receipt.status === 'Ready' && (
    <button onClick={handleMarkDone}>Mark Done</button>
  )}
  {receipt.status === 'Done' && (
    <p>Receipt completed</p>
  )}
</div>
```

