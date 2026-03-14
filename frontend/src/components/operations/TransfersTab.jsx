import { useEffect, useState } from 'react'
import { Plus, Eye, X, ArrowRightLeft, Play, CheckCircle2 } from 'lucide-react'
import { inventoryService } from '../../services/inventoryService'

const statusColors = {
  Draft: 'bg-slate-100 text-slate-700',
  'In Transit': 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Canceled: 'bg-red-100 text-red-700',
}

export default function TransfersTab() {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [warehouses, setWarehouses] = useState([])
  const [allLocations, setAllLocations] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({ source_location_id: '', destination_location_id: '', notes: '' })
  const [itemForm, setItemForm] = useState({ product_id: '', quantity: '' })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [trfRes, whRes, prodRes] = await Promise.all([
        inventoryService.getTransfers(),
        inventoryService.getWarehouses(),
        inventoryService.getProducts(),
      ])
      setTransfers(trfRes.data?.data || trfRes.data || [])
      const whs = whRes.data?.data || whRes.data || []
      setWarehouses(whs)
      setProducts(prodRes.data?.data || prodRes.data || [])

      // Load all locations
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
      const res = await inventoryService.createTransfer({
        source_location_id: Number(form.source_location_id),
        destination_location_id: Number(form.destination_location_id),
        notes: form.notes,
      })
      setSuccess('Transfer created!')
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
      await inventoryService.addTransferItem(showDetail.id, {
        product_id: Number(itemForm.product_id),
        quantity: Number(itemForm.quantity),
      })
      setSuccess('Item added to transfer!')
      setItemForm({ product_id: '', quantity: '' })
      await loadData()
      const trfRes = await inventoryService.getTransfers()
      const updated = (trfRes.data?.data || trfRes.data || []).find(t => t.id === showDetail.id)
      if (updated) setShowDetail(updated)
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    }
  }

  async function handleAction(action) {
    if (!showDetail) return
    try {
      setError('')
      if (action === 'start') {
        await inventoryService.startTransfer(showDetail.id)
        setSuccess('Transfer started - In Transit!')
      } else if (action === 'complete') {
        await inventoryService.completeTransfer(showDetail.id)
        setSuccess('Transfer completed! Stock moved between locations.')
      }
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
        <h2 className="text-lg font-semibold text-slate-900">Internal Transfers</h2>
        <button onClick={() => { setShowCreate(true); setShowDetail(null) }} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200 hover:bg-brand-700 transition">
          <Plus className="h-4 w-4" /> New Transfer
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900">Create Internal Transfer</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Source Location *</span>
              <select value={form.source_location_id} onChange={e => setForm(p => ({...p, source_location_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select source</option>
                {allLocations.map(l => <option key={l.id} value={l.id}>{l.warehouse_name} — {l.rack_code}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span>Destination Location *</span>
              <select value={form.destination_location_id} onChange={e => setForm(p => ({...p, destination_location_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" required>
                <option value="">Select destination</option>
                {allLocations.filter(l => String(l.id) !== form.source_location_id).map(l => <option key={l.id} value={l.id}>{l.warehouse_name} — {l.rack_code}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600 md:col-span-2">
              <span>Notes</span>
              <input value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none" placeholder="Optional notes" />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200">Create Transfer</button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {showDetail && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">{showDetail.transfer_number}</h3>
              <p className="text-sm text-slate-500">{showDetail.source_location} → {showDetail.destination_location}</p>
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
                  <th className="py-2 pr-4">Product</th><th className="py-2 pr-4">SKU</th><th className="py-2 pr-4">Quantity</th>
                </tr></thead>
                <tbody>
                  {showDetail.items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2 pr-4 text-slate-900">{item.product}</td>
                      <td className="py-2 pr-4 text-slate-600">{item.sku}</td>
                      <td className="py-2 pr-4">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showDetail.status === 'Draft' && (
            <form onSubmit={handleAddItem} className="grid gap-3 md:grid-cols-3 border-t border-slate-200 pt-4">
              <select value={itemForm.product_id} onChange={e => setItemForm(p => ({...p, product_id: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" required>
                <option value="">Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name || p.sku}</option>)}
              </select>
              <input type="number" value={itemForm.quantity} onChange={e => setItemForm(p => ({...p, quantity: e.target.value}))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Quantity" required min="1" />
              <button type="submit" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Add Item</button>
            </form>
          )}

          <div className="flex gap-2 border-t border-slate-200 pt-4">
            {showDetail.status === 'Draft' && showDetail.items?.length > 0 && (
              <button onClick={() => handleAction('start')} className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition"><Play className="h-4 w-4" /> Start Transfer</button>
            )}
            {showDetail.status === 'In Transit' && (
              <button onClick={() => handleAction('complete')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"><CheckCircle2 className="h-4 w-4" /> Complete Transfer</button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Transfer #</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Destination</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No transfers found.</td></tr>
            ) : transfers.map((t, i) => (
              <tr key={t.id || i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-900">{t.transfer_number}</td>
                <td className="px-4 py-3 text-slate-600">{t.source_location}</td>
                <td className="px-4 py-3 text-slate-600">{t.destination_location}</td>
                <td className="px-4 py-3 text-slate-600">{t.items?.length || 0}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[t.status] || 'bg-slate-100 text-slate-700'}`}>{t.status}</span></td>
                <td className="px-4 py-3 text-slate-500">{t.created_at ? new Date(t.created_at).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setShowDetail(t)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
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
