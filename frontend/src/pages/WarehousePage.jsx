import { useEffect, useState } from 'react'
import { Warehouse } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import { inventoryService } from '../services/inventoryService'

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadWarehouses() {
      try {
        setLoading(true)
        setError('')
        const response = await inventoryService.getWarehouses()
        setWarehouses(response.data.data || response.data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadWarehouses()
  }, [])

  if (loading) return <LoadingState label="Loading warehouse structure..." />
  if (error) return <ErrorState message={error} />

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900">Warehouses</h1>
        <p className="text-sm text-slate-500">Browse locations, racks, and product quantities per bin.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {warehouses.map((warehouse) => (
          <article
            key={warehouse.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-xl bg-brand-50 p-2 text-brand-600">
                <Warehouse className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-semibold text-slate-900">{warehouse.name}</h2>
                <p className="text-sm text-slate-500">{warehouse.location}</p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Capacity:</span>
                <span className="text-sm font-semibold text-slate-900">{warehouse.capacity?.toLocaleString()} units</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Status:</span>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                  warehouse.is_active ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  <span className={`inline-block h-2 w-2 rounded-full ${
                    warehouse.is_active ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                  {warehouse.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
