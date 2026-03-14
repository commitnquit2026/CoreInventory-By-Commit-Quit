export const dashboardKPIs = {
  totalProductsInStock: 12480,
  lowStockItems: 37,
  pendingReceipts: 19,
  pendingDeliveries: 26,
  internalTransfers: 14,
}

export const stockLevels = [
  { name: 'Raw Material', value: 3200 },
  { name: 'Packaging', value: 1800 },
  { name: 'Electronics', value: 2600 },
  { name: 'Hardware', value: 1500 },
  { name: 'Finished Goods', value: 3380 },
]

export const categoryDistribution = [
  { name: 'Electronics', value: 34 },
  { name: 'Accessories', value: 23 },
  { name: 'Home Goods', value: 19 },
  { name: 'Office', value: 14 },
  { name: 'Other', value: 10 },
]

export const movementTimeline = [
  { period: 'Mon', incoming: 410, outgoing: 250 },
  { period: 'Tue', incoming: 340, outgoing: 290 },
  { period: 'Wed', incoming: 510, outgoing: 300 },
  { period: 'Thu', incoming: 430, outgoing: 280 },
  { period: 'Fri', incoming: 470, outgoing: 390 },
  { period: 'Sat', incoming: 330, outgoing: 260 },
  { period: 'Sun', incoming: 280, outgoing: 220 },
]

export const warehouseComparison = [
  { warehouse: 'North Hub', stock: 4200 },
  { warehouse: 'Central DC', stock: 3500 },
  { warehouse: 'East Point', stock: 2600 },
  { warehouse: 'South Hub', stock: 2180 },
]

export const products = [
  {
    id: 1,
    sku: 'CI-EL-001',
    name: 'Industrial Sensor A1',
    category: 'Electronics',
    reorderLevel: 120,
    warehouseStock: { 'North Hub': 150, 'Central DC': 90, 'East Point': 40 },
  },
  {
    id: 2,
    sku: 'CI-PK-110',
    name: 'Protective Packaging Roll',
    category: 'Packaging',
    reorderLevel: 200,
    warehouseStock: { 'North Hub': 230, 'Central DC': 180, 'South Hub': 70 },
  },
  {
    id: 3,
    sku: 'CI-HW-778',
    name: 'Steel Bracket Set',
    category: 'Hardware',
    reorderLevel: 90,
    warehouseStock: { 'Central DC': 60, 'East Point': 44, 'South Hub': 35 },
  },
  {
    id: 4,
    sku: 'CI-FG-234',
    name: 'Core Controller Unit',
    category: 'Finished Goods',
    reorderLevel: 50,
    warehouseStock: { 'North Hub': 80, 'Central DC': 54, 'East Point': 29 },
  },
]

export const warehouses = [
  {
    id: 'W-001',
    name: 'North Hub',
    manager: 'Maya Jordan',
    racks: [
      { code: 'A-01', product: 'Industrial Sensor A1', qty: 70 },
      { code: 'A-02', product: 'Core Controller Unit', qty: 40 },
      { code: 'B-04', product: 'Protective Packaging Roll', qty: 120 },
    ],
  },
  {
    id: 'W-002',
    name: 'Central DC',
    manager: 'Noah Brooks',
    racks: [
      { code: 'C-12', product: 'Steel Bracket Set', qty: 60 },
      { code: 'D-03', product: 'Industrial Sensor A1', qty: 90 },
      { code: 'E-01', product: 'Core Controller Unit', qty: 54 },
    ],
  },
]

export const ledgerEntries = [
  {
    id: 'L-9001',
    date: '2026-03-12T11:12:00.000Z',
    type: 'Receipt',
    document: 'RC-2201',
    sku: 'CI-EL-001',
    warehouse: 'North Hub',
    quantity: 120,
    status: 'Posted',
  },
  {
    id: 'L-9002',
    date: '2026-03-12T15:34:00.000Z',
    type: 'Delivery',
    document: 'DL-3317',
    sku: 'CI-FG-234',
    warehouse: 'Central DC',
    quantity: -28,
    status: 'Posted',
  },
  {
    id: 'L-9003',
    date: '2026-03-13T08:50:00.000Z',
    type: 'Transfer',
    document: 'TR-1055',
    sku: 'CI-HW-778',
    warehouse: 'East Point',
    quantity: -16,
    status: 'Completed',
  },
  {
    id: 'L-9004',
    date: '2026-03-13T09:40:00.000Z',
    type: 'Adjustment',
    document: 'AD-781',
    sku: 'CI-PK-110',
    warehouse: 'South Hub',
    quantity: 30,
    status: 'Approved',
  },
]
