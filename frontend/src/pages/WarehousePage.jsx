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
        setWarehouses(response.data)
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
                <p className="text-sm text-slate-500">Manager: {warehouse.manager}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Rack</th>
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {warehouse.racks.map((rack) => (
                    <tr key={`${warehouse.id}-${rack.code}`}>
                      <td className="px-3 py-2 font-medium text-slate-700">{rack.code}</td>
                      <td className="px-3 py-2 text-slate-600">{rack.product}</td>
                      <td className="px-3 py-2 text-slate-800">{rack.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
