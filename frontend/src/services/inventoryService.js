import http from './http'
import {
  categoryDistribution,
  dashboardKPIs,
  ledgerEntries,
  movementTimeline,
  products,
  stockLevels,
  warehouseComparison,
  warehouses,
} from '../data/mockData'

function withMockFallback(apiCall, fallbackData) {
  return apiCall().catch(() => ({ data: fallbackData }))
}

export const inventoryService = {
  // ==================== DASHBOARD ====================
  getDashboard(filters) {
    return withMockFallback(
      () => http.get('/inventory/dashboard', { params: filters }),
      {
        kpis: dashboardKPIs,
        stockLevels,
        categoryDistribution,
        movementTimeline,
        warehouseComparison,
      },
    )
  },

  // ==================== PRODUCTS ====================
  getProducts(params) {
    return withMockFallback(() => http.get('/products', { params }), products)
  },

  createProduct(payload) {
    return withMockFallback(() => http.post('/products', payload), {
      id: Math.floor(Math.random() * 100000),
      ...payload,
    })
  },

  updateProduct(id, payload) {
    return withMockFallback(() => http.put(`/products/${id}`, payload), {
      id,
      ...payload,
    })
  },

  getProduct(id) {
    return http.get(`/products/${id}`)
  },

  // ==================== CATEGORIES ====================
  getCategories() {
    return withMockFallback(() => http.get('/products/categories'), [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Packaging' },
      { id: 3, name: 'Hardware' },
      { id: 4, name: 'Finished Goods' },
    ])
  },

  createCategory(payload) {
    return http.post('/products/categories', payload)
  },

  // ==================== WAREHOUSES ====================
  getWarehouses() {
    return withMockFallback(() => http.get('/warehouses'), warehouses)
  },

  createWarehouse(payload) {
    return http.post('/warehouses', payload)
  },

  updateWarehouse(id, payload) {
    return http.put(`/warehouses/${id}`, payload)
  },

  getWarehouse(id) {
    return http.get(`/warehouses/${id}`)
  },

  getWarehouseLocations(warehouseId) {
    return http.get(`/warehouses/${warehouseId}/locations`)
  },

  createLocation(warehouseId, payload) {
    return http.post(`/warehouses/${warehouseId}/locations`, payload)
  },

  // ==================== SUPPLIERS ====================
  getSuppliers(params) {
    return withMockFallback(() => http.get('/suppliers', { params }), [])
  },

  createSupplier(payload) {
    return http.post('/suppliers', payload)
  },

  // ==================== RECEIPTS ====================
  getReceipts(params) {
    return withMockFallback(() => http.get('/inventory/receipts', { params }), [])
  },

  createReceipt(payload) {
    return http.post('/inventory/receipts', payload)
  },

  getReceipt(id) {
    return http.get(`/inventory/receipts/${id}`)
  },

  addReceiptItem(receiptId, payload) {
    return http.post(`/inventory/receipts/${receiptId}/items`, payload)
  },

  validateReceipt(receiptId, payload) {
    return http.post(`/inventory/receipts/${receiptId}/validate`, payload)
  },

  // ==================== DELIVERIES ====================
  getDeliveries(params) {
    return withMockFallback(() => http.get('/inventory/deliveries', { params }), [])
  },

  createDelivery(payload) {
    return http.post('/inventory/deliveries', payload)
  },

  addDeliveryItem(deliveryId, payload) {
    return http.post(`/inventory/deliveries/${deliveryId}/items`, payload)
  },

  pickDelivery(deliveryId, payload) {
    return http.post(`/inventory/deliveries/${deliveryId}/pick`, payload)
  },

  packDelivery(deliveryId, payload) {
    return http.post(`/inventory/deliveries/${deliveryId}/pack`, payload)
  },

  validateDelivery(deliveryId, payload) {
    return http.post(`/inventory/deliveries/${deliveryId}/validate`, payload)
  },

  // ==================== TRANSFERS ====================
  getTransfers(params) {
    return withMockFallback(() => http.get('/inventory/transfers', { params }), [])
  },

  createTransfer(payload) {
    return http.post('/inventory/transfers', payload)
  },

  addTransferItem(transferId, payload) {
    return http.post(`/inventory/transfers/${transferId}/items`, payload)
  },

  startTransfer(transferId) {
    return http.post(`/inventory/transfers/${transferId}/start`)
  },

  completeTransfer(transferId) {
    return http.post(`/inventory/transfers/${transferId}/complete`)
  },

  // ==================== ADJUSTMENTS ====================
  getAdjustments(params) {
    return withMockFallback(() => http.get('/inventory/adjustments', { params }), [])
  },

  createAdjustment(payload) {
    return http.post('/inventory/adjustments', payload)
  },

  approveAdjustment(adjustmentId) {
    return http.post(`/inventory/adjustments/${adjustmentId}/approve`)
  },

  // ==================== STOCK LEDGER ====================
  getLedger(filters) {
    return withMockFallback(
      () => http.get('/inventory/ledger', { params: filters }),
      ledgerEntries,
    )
  },
}
