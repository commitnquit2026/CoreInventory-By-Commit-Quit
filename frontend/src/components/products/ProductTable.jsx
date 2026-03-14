import { ArrowUpDown, Pencil } from 'lucide-react'
import { getStockStatus } from '../../utils/format'

function totalStock(warehouseStock) {
  return Object.values(warehouseStock).reduce((sum, qty) => sum + qty, 0)
}

export default function ProductTable({ products, onEdit, onSort, sortBy, sortDirection }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock per Warehouse</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onSort('stock')}
                  className="inline-flex items-center gap-1 font-semibold"
                >
                  Total Stock
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {sortBy === 'stock' && (
                    <span className="text-xs text-brand-600">{sortDirection}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => {
              const stock = totalStock(product.warehouseStock)
              const status = getStockStatus(stock, product.reorderLevel)
              return (
                <tr key={product.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-700">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-800">{product.name}</td>
                  <td className="px-4 py-3 text-slate-600">{product.category}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {Object.entries(product.warehouseStock)
                      .map(([warehouse, qty]) => `${warehouse}: ${qty}`)
                      .join(' | ')}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        status === 'Low'
                          ? 'bg-rose-100 text-rose-700'
                          : status === 'Watch'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
