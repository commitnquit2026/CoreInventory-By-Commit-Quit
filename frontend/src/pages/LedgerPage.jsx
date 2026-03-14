import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { inventoryService } from '../services/inventoryService'
import { formatDate } from '../utils/format'

export default function LedgerPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    async function loadLedger() {
      try {
        setLoading(true)
        setError('')
        const response = await inventoryService.getLedger({
          type: typeFilter,
        })
        setEntries(response.data.data || response.data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadLedger()
  }, [typeFilter])

  const visibleEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const byType = typeFilter === 'All' || entry.operation_type === typeFilter
        return byType
      }),
    [entries, typeFilter],
  )

  const exportLogs = () => {
    const rows = [
      ['Date', 'Operation', 'Reference', 'Product', 'SKU', 'Location', 'Quantity Change'],
      ...visibleEntries.map((entry) => [
        formatDate(entry.created_at),
        entry.operation_type,
        entry.reference_number,
        entry.product,
        entry.sku,
        entry.destination_location || entry.source_location || 'N/A',
        String(entry.quantity_change),
      ]),
    ]
    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'stock-ledger.csv'
    link.click()
    URL.revokeObjectURL(href)
  }

  if (loading) return <LoadingState label="Loading stock ledger..." />
  if (error) return <ErrorState message={error} />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-slate-900">Stock Ledger</h1>
          <p className="text-sm text-slate-500">Timeline of stock movements with export-ready audit logs.</p>
        </div>
        <button
          type="button"
          onClick={exportLogs}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          <Download className="h-4 w-4" /> Export Logs
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        >
          <option>All</option>
          <option>Receipt</option>
          <option>Delivery</option>
          <option>Transfer</option>
          <option>Adjustment</option>
        </select>
        <p className="self-center text-sm text-slate-500">Entries: {visibleEntries.length}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
          <h3 className="font-heading text-base font-semibold text-slate-900">Timeline</h3>
          <ol className="mt-4 space-y-3 border-l-2 border-slate-200 pl-4">
            {visibleEntries.map((entry) => (
              <li key={entry.id} className="relative text-sm text-slate-600">
                <span className="absolute -left-[1.125rem] top-1 h-2.5 w-2.5 rounded-full bg-brand-500" />
                <p className="font-medium text-slate-800">{entry.operation_type} · {entry.reference_number}</p>
                <p>{formatDate(entry.created_at)}</p>
              </li>
            ))}
          </ol>
        </aside>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Operation</th>
                  <th className="px-3 py-2">Reference</th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Qty Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {visibleEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">{formatDate(entry.created_at)}</td>
                    <td className="px-3 py-2">{entry.operation_type}</td>
                    <td className="px-3 py-2">{entry.reference_number}</td>
                    <td className="px-3 py-2">{entry.product}</td>
                    <td className="px-3 py-2">{entry.sku}</td>
                    <td className="px-3 py-2">{entry.destination_location || entry.source_location || 'N/A'}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{entry.quantity_change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
