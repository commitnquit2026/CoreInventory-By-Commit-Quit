import { useEffect, useState } from 'react'
import { Search, List, Grid3x3, Download } from 'lucide-react'

export default function MoveHistoryPage() {
  const [moves, setMoves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [filterProduct, setFilterProduct] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [products, setProducts] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    loadMoveHistory()
    loadProducts()
    loadLocations()
  }, [])

  async function loadMoveHistory() {
    try {
      setLoading(true)
      // Mock data
      setMoves([
        {
          id: 1,
          sku: 'SKU001',
          date: '2026-05-01',
          operation: 'Stock Inward',
          from_location: 'Vendor',
          to_location: 'Location A',
          quantity: 10,
          status: 'Ready',
          reference_type: 'Receipt',
          reference_id: 'RCP001',
        },
        {
          id: 2,
          sku: 'SKU002',
          date: '2026-05-01',
          operation: 'Stock Inward',
          from_location: 'Vendor',
          to_location: 'Location B',
          quantity: 5,
          status: 'Ready',
          reference_type: 'Receipt',
          reference_id: 'RCP002',
        },
        {
          id: 3,
          sku: 'SKU003',
          date: '2026-05-20',
          operation: 'WMS to Stock',
          from_location: 'Location A',
          to_location: 'Location B',
          quantity: 3,
          status: 'Ready',
          reference_type: 'Transfer',
          reference_id: 'TRF001',
        },
        {
          id: 4,
          sku: 'SKU001',
          date: '2026-05-15',
          operation: 'Stock Outbound',
          from_location: 'Location A',
          to_location: 'Customer',
          quantity: 2,
          status: 'Ready',
          reference_type: 'Delivery',
          reference_id: 'DEL001',
        },
      ])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadProducts() {
    try {
      setProducts([
        { id: 1, name: 'Desk', sku: 'SKU001' },
        { id: 2, name: 'Chair', sku: 'SKU002' },
        { id: 3, name: 'Table', sku: 'SKU003' },
      ])
    } catch (e) {
      console.error(e)
    }
  }

  async function loadLocations() {
    try {
      setLocations([
        { id: 1, name: 'Location A', warehouse_id: 1 },
        { id: 2, name: 'Location B', warehouse_id: 1 },
        { id: 3, name: 'Location C', warehouse_id: 2 },
      ])
    } catch (e) {
      console.error(e)
    }
  }

  function filteredMoves() {
    return moves.filter(move => {
      if (filterProduct && move.sku !== filterProduct) return false
      if (filterLocation && move.to_location !== filterLocation) return false
      return true
    })
  }

  function exportData() {
    const csv = [
      ['SKU', 'Date', 'Operation', 'From', 'To', 'Quantity', 'Status', 'Reference'],
      ...filteredMoves().map(m => [
        m.sku,
        m.date,
        m.operation,
        m.from_location,
        m.to_location,
        m.quantity,
        m.status,
        `${m.reference_type}:${m.reference_id}`,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `move-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  const displayMoves = filteredMoves()

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900">Move History</h1>
        <p className="text-sm text-slate-500">Complete log of all inventory transactions and movements.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-medium">Filters</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product (SKU)</label>
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All products</option>
              {[...new Set(moves.map(m => m.sku))].map(sku => (
                <option key={sku} value={sku}>{sku}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Location</label>
            <select
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All locations</option>
              {[...new Set(moves.map(m => m.to_location))].map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setFilterProduct('')
                setFilterLocation('')
              }}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              onClick={exportData}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Showing {displayMoves.length} moves</div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-600'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-600'}`}
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3">SKU</th>
                <th className="text-left py-3 px-3">Date</th>
                <th className="text-left py-3 px-3">Operation</th>
                <th className="text-left py-3 px-3">From</th>
                <th className="text-left py-3 px-3">To</th>
                <th className="text-center py-3 px-3">Qty</th>
                <th className="text-left py-3 px-3">Reference</th>
                <th className="text-left py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayMoves.map(move => (
                <tr key={move.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium">{move.sku}</td>
                  <td className="py-3 px-3">{move.date}</td>
                  <td className="py-3 px-3">{move.operation}</td>
                  <td className="py-3 px-3 text-xs text-slate-600">{move.from_location}</td>
                  <td className="py-3 px-3 text-xs text-slate-600">{move.to_location}</td>
                  <td className="py-3 px-3 text-center">{move.quantity}</td>
                  <td className="py-3 px-3 text-xs">
                    <span className="rounded bg-slate-100 px-2 py-1">
                      {move.reference_type}: {move.reference_id}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      move.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {move.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayMoves.map(move => (
            <div key={move.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{move.sku}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    move.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {move.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{move.operation}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div><strong>Date:</strong> {move.date}</div>
                  <div><strong>From:</strong> {move.from_location}</div>
                  <div><strong>To:</strong> {move.to_location}</div>
                  <div><strong>Qty:</strong> {move.quantity}</div>
                  <div><strong>Ref:</strong> {move.reference_type} {move.reference_id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayMoves.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          No moves found matching your filters.
        </div>
      )}
    </div>
  )
}
