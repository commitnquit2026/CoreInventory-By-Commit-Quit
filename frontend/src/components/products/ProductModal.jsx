import { useEffect, useState } from 'react'

const initialState = {
  sku: '',
  name: '',
  category: 'Electronics',
  reorderLevel: 0,
  warehouseStock: {
    'North Hub': 0,
    'Central DC': 0,
    'East Point': 0,
  },
}

export default function ProductModal({ product, open, onClose, onSave }) {
  const [formState, setFormState] = useState(initialState)

  useEffect(() => {
    if (product) {
      setFormState(product)
      return
    }
    setFormState(initialState)
  }, [product])

  if (!open) return null

  const onWarehouseChange = (warehouse, value) => {
    setFormState((current) => ({
      ...current,
      warehouseStock: {
        ...current.warehouseStock,
        [warehouse]: Number(value),
      },
    }))
  }

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
            placeholder="SKU"
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
            value={formState.category}
            onChange={(event) => setFormState((s) => ({ ...s, category: event.target.value }))}
          >
            <option>Electronics</option>
            <option>Packaging</option>
            <option>Hardware</option>
            <option>Finished Goods</option>
          </select>
          <input
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
            type="number"
            placeholder="Reorder level"
            value={formState.reorderLevel}
            onChange={(event) =>
              setFormState((s) => ({ ...s, reorderLevel: Number(event.target.value) }))
            }
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {Object.entries(formState.warehouseStock).map(([warehouse, qty]) => (
            <label key={warehouse} className="flex flex-col gap-1 text-sm text-slate-600">
              {warehouse}
              <input
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
                type="number"
                value={qty}
                onChange={(event) => onWarehouseChange(warehouse, event.target.value)}
              />
            </label>
          ))}
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
