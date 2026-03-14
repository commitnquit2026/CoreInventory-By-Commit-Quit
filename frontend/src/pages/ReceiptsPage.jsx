import { useEffect, useState } from 'react'
import { Plus, Printer, Check, X, Edit2, Trash2 } from 'lucide-react'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])

  const [form, setForm] = useState({
    warehouse_id: '',
    receive_from: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    responsible_user_id: '', // Will auto-fill with current user
    items: [],
  })

  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: '',
    location_id: '',
  })

  useEffect(() => {
    loadReceipts()
    loadProducts()
    loadWarehouses()
  }, [])

  async function loadReceipts() {
    try {
      setLoading(true)
      // Mock data for now
      setReceipts([
        {
          id: 1,
          receipt_id: 'RCP001',
          warehouse_id: 1,
          receive_from: 'Supplier A',
          scheduled_date: '2026-03-15',
          status: 'Draft',
          items: [
            { product_id: 1, product_name: 'Desk', quantity: 10, location_id: 1 },
          ],
        },
        {
          id: 2,
          receipt_id: 'RCP002',
          warehouse_id: 1,
          receive_from: 'Supplier B',
          scheduled_date: '2026-03-16',
          status: 'Ready',
          items: [
            { product_id: 2, product_name: 'Chair', quantity: 20, location_id: 1 },
          ],
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

  async function loadWarehouses() {
    try {
      setWarehouses([
        { id: 1, name: 'Main Warehouse', short_code: 'MW' },
        { id: 2, name: 'Secondary Warehouse', short_code: 'SW' },
      ])
    } catch (e) {
      console.error(e)
    }
  }

  function addItem() {
    if (!newItem.product_id || !newItem.quantity || !newItem.location_id) {
      setError('Please fill all product fields')
      return
    }
    const product = products.find(p => p.id === parseInt(newItem.product_id))
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product_id: parseInt(newItem.product_id),
          product_name: product?.name,
          quantity: parseInt(newItem.quantity),
          location_id: parseInt(newItem.location_id),
        },
      ],
    })
    setNewItem({ product_id: '', quantity: '', location_id: '' })
    setError('')
  }

  function removeItem(index) {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    })
  }

  async function handleSaveReceipt() {
    if (!form.warehouse_id || !form.receive_from || !form.scheduled_date) {
      setError('Please fill all required fields')
      return
    }
    if (form.items.length === 0) {
      setError('Please add at least one product')
      return
    }

    try {
      setError('')
      // Mock API call
      const newReceipt = {
        id: receipts.length + 1,
        receipt_id: `RCP${String(receipts.length + 1).padStart(3, '0')}`,
        ...form,
        status: 'Draft',
      }
      setReceipts([...receipts, newReceipt])
      setSuccess('Receipt created successfully!')
      setShowForm(false)
      setForm({
        warehouse_id: '',
        receive_from: '',
        scheduled_date: new Date().toISOString().split('T')[0],
        responsible_user_id: '',
        items: [],
      })
    } catch (e) {
      setError(e.message)
    }
  }

  async function updateStatus(receiptId, newStatus) {
    try {
      setReceipts(
        receipts.map(r =>
          r.id === receiptId ? { ...r, status: newStatus } : r
        )
      )
      setSuccess(`Receipt status updated to ${newStatus}`)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" /></div>

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900">Receipts</h1>
        <p className="text-sm text-slate-500">Manage product receipts and inbound stock.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus size={16} /> New Receipt
        </button>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">New Receipt</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Warehouse *</label>
              <select
                value={form.warehouse_id}
                onChange={e => setForm({ ...form, warehouse_id: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receive From *</label>
              <input
                type="text"
                placeholder="Supplier name"
                value={form.receive_from}
                onChange={e => setForm({ ...form, receive_from: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Date *</label>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold mb-3">Products</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <select
                value={newItem.product_id}
                onChange={e => setNewItem({ ...newItem, product_id: e.target.value })}
                className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
              >
                <option value="">Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
                className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Location ID"
                value={newItem.location_id}
                onChange={e => setNewItem({ ...newItem, location_id: e.target.value })}
                className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
              />
              <button
                onClick={addItem}
                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Add
              </button>
            </div>

            {form.items.length > 0 && (
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                    <span className="text-sm">{item.product_name} × {item.quantity}</span>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false)
                setForm({
                  warehouse_id: '',
                  receive_from: '',
                  scheduled_date: new Date().toISOString().split('T')[0],
                  responsible_user_id: '',
                  items: [],
                })
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReceipt}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Create Receipt
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Receipts List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3">Receipt ID</th>
                <th className="text-left py-2 px-3">From</th>
                <th className="text-left py-2 px-3">Scheduled</th>
                <th className="text-left py-2 px-3">Items</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(receipt => (
                <tr key={receipt.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium">{receipt.receipt_id}</td>
                  <td className="py-3 px-3">{receipt.receive_from}</td>
                  <td className="py-3 px-3">{receipt.scheduled_date}</td>
                  <td className="py-3 px-3">{receipt.items.length}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      receipt.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                      receipt.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {receipt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 flex gap-1">
                    {receipt.status === 'Draft' && (
                      <>
                        <button
                          onClick={() => updateStatus(receipt.id, 'Ready')}
                          className="text-blue-600 hover:text-blue-700"
                          title="Move to Ready"
                        >
                          <Check size={14} />
                        </button>
                      </>
                    )}
                    {receipt.status === 'Ready' && (
                      <button
                        onClick={() => updateStatus(receipt.id, 'Done')}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="Complete"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button className="text-slate-600 hover:text-slate-700">
                      <Printer size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
