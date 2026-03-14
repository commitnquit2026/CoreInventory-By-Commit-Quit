import { useEffect, useState } from 'react'
import { Plus, CheckCircle2, Package, Eye, X } from 'lucide-react'
import { inventoryService } from '../../services/inventoryService'

const statusColors = {
  Draft: 'bg-slate-100 text-slate-700',
  Waiting: 'bg-amber-100 text-amber-700',
  Validated: 'bg-emerald-100 text-emerald-700',
  Canceled: 'bg-red-100 text-red-700',
}

export default function ReceiptsTab() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({ supplier_id: '', warehouse_id: '', notes: '' })
  const [itemForm, setItemForm] = useState({ product_id: '', quantity_expected: '', location_id: '', unit_price: '' })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [rcpRes, supRes, whRes, prodRes] = await Promise.all([
        inventoryService.getReceipts(),
        inventoryService.getSuppliers(),
        inventoryService.getWarehouses(),
        inventoryService.getProducts(),
      ])
      setReceipts(rcpRes.data?.data || rcpRes.data || [])
      setSuppliers(supRes.data?.data || supRes.data || [])
      setWarehouses(whRes.data?.data || whRes.data || [])
      setProducts(prodRes.data?.data || prodRes.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadLocations(warehouseId) {
    try {
      const res = await inventoryService.getWarehouseLocations(warehouseId)
      setLocations(res.data?.locations || [])
    } catch {
      setLocations([])
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      setError('')
      const res = await inventoryService.createReceipt(form)
      setSuccess('Receipt created! Add items to it below.')
      setShowCreate(false)
      setShowDetail(res.data?.data || res.data)
      await loadData()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleAddItem(e) {
    e.preventDefault()
    if (!showDetail) return
    try {
      setError('')
      await inventoryService.addReceiptItem(showDetail.id, {
        product_id: Number(itemForm.product_id),
        quantity_expected: Number(itemForm.quantity_expected),
        location_id: Number(itemForm.location_id),
        unit_price: itemForm.unit_price ? Number(itemForm.unit_price) : undefined,
      })
      setSuccess('Item added to receipt!')
      setItemForm({ product_id: '', quantity_expected: '', location_id: '', unit_price: '' })
      const res = await inventoryService.getReceipt(showDetail.id)
      setShowDetail(res.data?.data || res.data)
      await loadData()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleValidate() {
    if (!showDetail) return
    try {
      setError('')
      await inventoryService.validateReceipt(showDetail.id)
      setSuccess('Receipt validated! Stock has been increased.')
      setShowDetail(null)
      await loadData()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Receipts (Incoming Stock)</h2>
        <button onClick={() => { setShowCreate(true); setShowDetail(null) }} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200 hover:bg-brand-700 transition">
          <Plus className="h-4 w-4" /> New Receipt
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900">Create Receipt</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Supplier *</span>
              <select value={form.supplier_id} onChange={e => setForm(p => ({...p, supplier_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Warehouse *</span>
              <select value={form.warehouse_id} onChange={e => { setForm(p => ({...p, warehouse_id: e.target.value})); if (e.target.value) loadLocations(e.target.value) }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select warehouse</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 md:col-span-2">
              <span>Notes</span>
              <input value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="Optional notes" />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200">Create Receipt</button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Detail View with Add Items */}
      {showDetail && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{showDetail.receipt_number}</h3>
              <p className="text-sm text-slate-500">Supplier: {showDetail.supplier} • Warehouse: {showDetail.warehouse}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[showDetail.status] || 'bg-slate-100 text-slate-700'}`}>{showDetail.status}</span>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-slate-200"><X className="h-4 w-4" /></button>
            </div>
          </div>

          {showDetail.items?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-4">Product</th><th className="py-2 pr-4">SKU</th><th className="py-2 pr-4">Expected</th><th className="py-2 pr-4">Received</th><th className="py-2 pr-4">Location</th>
                </tr></thead>
                <tbody>
                  {showDetail.items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-900">{item.product}</td>
                      <td className="py-2 pr-4 text-slate-600">{item.sku}</td>
                      <td className="py-2 pr-4">{item.quantity_expected}</td>
                      <td className="py-2 pr-4">{item.quantity_received}</td>
                      <td className="py-2 pr-4">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showDetail.status === 'Draft' && (
            <>
              <form onSubmit={handleAddItem} className="grid gap-3 md:grid-cols-4 border-t border-slate-200 pt-4">
                <select value={itemForm.product_id} onChange={e => setItemForm(p => ({...p, product_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required>
                  <option value="">Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name || p.sku}</option>)}
                </select>
                <input type="number" value={itemForm.quantity_expected} onChange={e => setItemForm(p => ({...p, quantity_expected: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Qty Expected" required min="1" />
                <select value={itemForm.location_id} onChange={e => setItemForm(p => ({...p, location_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required>
                  <option value="">Location</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.rack_code}</option>)}
                </select>
                <button type="submit" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Add Item</button>
              </form>

              {showDetail.items?.length > 0 && (
                <button onClick={handleValidate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition">
                  <CheckCircle2 className="h-4 w-4" /> Validate & Receive Stock
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Receipts List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">From</th>
            <th className="px-4 py-3 font-medium">To</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Schedule date</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr></thead>
          <tbody>
            {receipts.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No receipts found. Create your first receipt to get started.</td></tr>
            ) : receipts.map((r, i) => (
              <tr key={r.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-900">{r.receipt_number}</td>
                <td className="px-4 py-3 text-slate-600">{r.supplier}</td>
                <td className="px-4 py-3 text-slate-600">{r.warehouse}</td>
                <td className="px-4 py-3 text-slate-600">{r.created_by || 'Azure Interior'}</td>
                <td className="px-4 py-3 text-slate-500">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status] || 'bg-slate-100 text-slate-700'}`}>{r.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={async () => { try { const res = await inventoryService.getReceipt(r.id); setShowDetail(res.data?.data || res.data); if (r.warehouse_id) await loadLocations(r.warehouse_id) } catch { setShowDetail(r) }}} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
