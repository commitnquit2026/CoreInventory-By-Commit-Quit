import { useEffect, useState } from 'react'
import { inventoryService } from '../../services/inventoryService'

const initialState = {
  sku: '',
  name: '',
  category_id: '',
  unit_of_measure: 'Units',
  initial_stock: 0,
}

export default function ProductModal({ product, open, onClose, onSave }) {
  const [formState, setFormState] = useState(initialState)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (product) {
      setFormState({
        sku: product.sku || '',
        name: product.name || '',
        category_id: product.category_id || '',
        unit_of_measure: product.unit_of_measure || 'Units',
        initial_stock: product.initial_stock || 0,
      })
      return
    }
    setFormState(initialState)
  }, [product])

  async function loadCategories() {
    try {
      const res = await inventoryService.getCategories()
      setCategories(res.data?.data || [])
      // Set first category as default for new products
      if (!product && res.data?.data?.length > 0) {
        setFormState((s) => ({ ...s, category_id: res.data.data[0].id }))
      }
    } catch (e) {
      console.error('Failed to load categories:', e)
    }
  }

  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    onSave(formState)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <h3 className="font-heading text-xl font-semibold text-slate-900">
          {product ? 'Edit Product' : 'Add Product'}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            placeholder="SKU (e.g. ELECT-001)"
            value={formState.sku}
            onChange={(event) => setFormState((s) => ({ ...s, sku: event.target.value }))}
            required
          />
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            placeholder="Product name"
            value={formState.name}
            onChange={(event) => setFormState((s) => ({ ...s, name: event.target.value }))}
            required
          />
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            value={formState.category_id}
            onChange={(event) => setFormState((s) => ({ ...s, category_id: Number(event.target.value) }))}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            value={formState.unit_of_measure}
            onChange={(event) => setFormState((s) => ({ ...s, unit_of_measure: event.target.value }))}
            required
          >
            <option value="Units">Units</option>
            <option value="Pieces">Pieces</option>
            <option value="Boxes">Boxes</option>
            <option value="Kg">Kilograms</option>
            <option value="Liters">Liters</option>
            <option value="Meters">Meters</option>
          </select>
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            type="number"
            placeholder="Initial stock quantity"
            value={formState.initial_stock}
            onChange={(event) => setFormState((s) => ({ ...s, initial_stock: Number(event.target.value) }))}
            min="0"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  )
}
