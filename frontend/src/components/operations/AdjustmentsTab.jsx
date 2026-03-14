import { useEffect, useState } from 'react'
import { Plus, Eye, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { inventoryService } from '../../services/inventoryService'

const statusColors = {
  Draft: 'bg-slate-100 text-slate-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
}

export default function AdjustmentsTab() {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [warehouses, setWarehouses] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    product_id: '', location_id: '', system_quantity: '', physical_quantity: '',
    reason: '', notes: '',
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [adjRes, whRes, prodRes] = await Promise.all([
        inventoryService.getAdjustments(),
        inventoryService.getWarehouses(),
        inventoryService.getProducts(),
      ])
      setAdjustments(adjRes.data?.data || adjRes.data || [])
      const whs = whRes.data?.data || whRes.data || []
      setWarehouses(whs)
      setProducts(prodRes.data?.data || prodRes.data || [])

      const locPromises = whs.map(w => inventoryService.getWarehouseLocations(w.id).catch(() => ({ data: { locations: [] } })))
      const locResults = await Promise.all(locPromises)
      const locs = []
      locResults.forEach((r, i) => {
        const ls = r.data?.locations || []
        ls.forEach(l => locs.push({ ...l, warehouse_name: whs[i]?.name || '' }))
      })
      setAllLocations(locs)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      setError('')
      await inventoryService.createAdjustment({
        product_id: Number(form.product_id),
        location_id: Number(form.location_id),
        system_quantity: Number(form.system_quantity),
        physical_quantity: Number(form.physical_quantity),
        reason: form.reason,
        notes: form.notes,
      })
      setSuccess('Adjustment created! Pending approval.')
      setShowCreate(false)
      setForm({ product_id: '', location_id: '', system_quantity: '', physical_quantity: '', reason: '', notes: '' })
      await loadData()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleApprove(id) {
    try {
      setError('')
      await inventoryService.approveAdjustment(id)
      setSuccess('Adjustment approved! Stock updated.')
      setShowDetail(null)
      await loadData()
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  const reasons = ['Cycle count variance', 'Damage', 'Theft', 'Spoilage', 'Data entry error', 'Other']

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Stock Adjustments</h2>
        <button onClick={() => { setShowCreate(true); setShowDetail(null) }} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200 hover:bg-brand-700 transition">
          <Plus className="h-4 w-4" /> New Adjustment
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900">Create Stock Adjustment</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Product *</span>
              <select value={form.product_id} onChange={e => setForm(p => ({...p, product_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name || p.sku}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Location *</span>
              <select value={form.location_id} onChange={e => setForm(p => ({...p, location_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select location</option>
                {allLocations.map(l => <option key={l.id} value={l.id}>{l.warehouse_name} — {l.rack_code}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>System Quantity (recorded) *</span>
              <input type="number" value={form.system_quantity} onChange={e => setForm(p => ({...p, system_quantity: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="Current system qty" required min="0" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Physical Quantity (counted) *</span>
              <input type="number" value={form.physical_quantity} onChange={e => setForm(p => ({...p, physical_quantity: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="Actual counted qty" required min="0" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Reason *</span>
              <select value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select reason</option>
                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Notes</span>
              <input value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="Optional notes" />
            </label>
          </div>
          {form.system_quantity && form.physical_quantity && (
            <div className={`rounded-xl p-3 text-sm font-medium ${Number(form.physical_quantity) - Number(form.system_quantity) >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Adjustment: {Number(form.physical_quantity) - Number(form.system_quantity) >= 0 ? '+' : ''}{Number(form.physical_quantity) - Number(form.system_quantity)} units
            </div>
          )}
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200">Submit Adjustment</button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {showDetail && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{showDetail.adjustment_number}</h3>
              <p className="text-sm text-slate-500">{showDetail.product} at {showDetail.location} • Reason: {showDetail.reason}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[showDetail.status] || 'bg-slate-100 text-slate-700'}`}>{showDetail.status}</span>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-slate-200"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-white p-3 border border-slate-200">
              <p className="text-slate-500">System Qty</p>
              <p className="text-lg font-bold text-slate-900">{showDetail.system_quantity}</p>
            </div>
            <div className="rounded-xl bg-white p-3 border border-slate-200">
              <p className="text-slate-500">Physical Qty</p>
              <p className="text-lg font-bold text-slate-900">{showDetail.physical_quantity}</p>
            </div>
            <div className={`rounded-xl p-3 border ${showDetail.adjustment_quantity >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-slate-500">Adjustment</p>
              <p className={`text-lg font-bold ${showDetail.adjustment_quantity >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {showDetail.adjustment_quantity >= 0 ? '+' : ''}{showDetail.adjustment_quantity}
              </p>
            </div>
          </div>
          {showDetail.status === 'Draft' && (
            <button onClick={() => handleApprove(showDetail.id)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition">
              <CheckCircle2 className="h-4 w-4" /> Approve & Apply
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Adjustment #</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Adjustment</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {adjustments.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No adjustments found.</td></tr>
            ) : adjustments.map((a, i) => (
              <tr key={a.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-900">{a.adjustment_number}</td>
                <td className="px-4 py-3 text-slate-600">{a.product}</td>
                <td className="px-4 py-3 text-slate-600">{a.location}</td>
                <td className="px-4 py-3"><span className={`font-semibold ${a.adjustment_quantity >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{a.adjustment_quantity >= 0 ? '+' : ''}{a.adjustment_quantity}</span></td>
                <td className="px-4 py-3 text-slate-600">{a.reason}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[a.status] || 'bg-slate-100 text-slate-700'}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => setShowDetail(a)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
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
