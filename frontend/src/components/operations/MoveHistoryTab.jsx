import { useEffect, useState } from 'react'
import { ScrollText, Filter } from 'lucide-react'
import { inventoryService } from '../../services/inventoryService'

const typeColors = {
  Receipt: 'bg-emerald-100 text-emerald-700',
  Delivery: 'bg-blue-100 text-blue-700',
  Transfer: 'bg-amber-100 text-amber-700',
  Adjustment: 'bg-purple-100 text-purple-700',
}

export default function MoveHistoryTab() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => { loadData() }, [filter])

  async function loadData() {
    try {
      setLoading(true)
      const params = {}
      if (filter !== 'All') params.operation_type = filter
      const res = await inventoryService.getLedger(params)
      setEntries(res.data?.data || res.data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Move History (Stock Ledger)</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none">
            <option value="All">All Types</option>
            <option value="Receipt">Receipts</option>
            <option value="Delivery">Deliveries</option>
            <option value="Transfer">Transfers</option>
            <option value="Adjustment">Adjustments</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Reference</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Change</th>
            <th className="px-4 py-3 font-medium">Old Qty</th>
            <th className="px-4 py-3 font-medium">New Qty</th>
            <th className="px-4 py-3 font-medium">By</th>
          </tr></thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                <ScrollText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                No stock movement entries found.
              </td></tr>
            ) : entries.map((entry, i) => {
              const qty = entry.quantity_change || entry.quantity || 0
              const isGreen = entry.operation_type === 'Receipt' || qty > 0
              const isRed = entry.operation_type === 'Delivery' || qty < 0
              const textColor = isGreen ? 'text-emerald-600' : isRed ? 'text-red-600' : 'text-slate-600'

              return (
                <tr key={entry.id || i} className={`border-b border-slate-100 hover:bg-slate-50 transition ${textColor}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {entry.created_at ? new Date(entry.created_at).toLocaleString() : (entry.date ? new Date(entry.date).toLocaleString() : '-')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[entry.operation_type || entry.type] || 'bg-slate-100 text-slate-700'} ${textColor}`}>
                      {entry.operation_type || entry.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{entry.reference_number || entry.document}</td>
                  <td className="px-4 py-3 font-medium">{entry.product}</td>
                  <td className="px-4 py-3">{entry.sku}</td>
                  <td className="px-4 py-3">{entry.source_location || entry.destination_location || entry.warehouse || '-'}</td>
                  <td className="px-4 py-3 font-bold">
                    {qty >= 0 ? '+' : ''}{qty}
                  </td>
                  <td className="px-4 py-3">{entry.old_quantity ?? '-'}</td>
                  <td className="px-4 py-3">{entry.new_quantity ?? '-'}</td>
                  <td className="px-4 py-3">{entry.created_by || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
