import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import ProductModal from '../components/products/ProductModal'
import ProductTable from '../components/products/ProductTable'
import { inventoryService } from '../services/inventoryService'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('stock')
  const [sortDirection, setSortDirection] = useState('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')
        const response = await inventoryService.getProducts({ search, category })
        setProducts(response.data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [search, category])

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category
      return matchesSearch && matchesCategory
    })

    const sorted = [...filtered]
    if (sortBy === 'stock') {
      sorted.sort((a, b) => {
        const stockA = Object.values(a.warehouseStock).reduce((sum, qty) => sum + qty, 0)
        const stockB = Object.values(b.warehouseStock).reduce((sum, qty) => sum + qty, 0)
        return sortDirection === 'asc' ? stockA - stockB : stockB - stockA
      })
    }

    return sorted
  }, [products, search, category, sortBy, sortDirection])

  const saveProduct = async (payload) => {
    try {
      if (editingProduct) {
        const response = await inventoryService.updateProduct(editingProduct.id, payload)
        setProducts((current) =>
          current.map((item) => (item.id === editingProduct.id ? response.data : item)),
        )
      } else {
        const response = await inventoryService.createProduct(payload)
        setProducts((current) => [response.data, ...current])
      }
      setModalOpen(false)
      setEditingProduct(null)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  if (loading) return <LoadingState label="Loading products..." />
  if (error) return <ErrorState message={error} />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">Search SKUs, monitor stock, and maintain product records.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null)
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-200"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          placeholder="Search SKU or product"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
        >
          <option>All</option>
          <option>Electronics</option>
          <option>Packaging</option>
          <option>Hardware</option>
          <option>Finished Goods</option>
        </select>
        <p className="self-center text-sm text-slate-500">Total visible products: {visibleProducts.length}</p>
      </div>

      <ProductTable
        products={visibleProducts}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={(field) => {
          setSortBy(field)
          setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
        }}
        onEdit={(product) => {
          setEditingProduct(product)
          setModalOpen(true)
        }}
      />

      <ProductModal
        open={modalOpen}
        product={editingProduct}
        onClose={() => {
          setModalOpen(false)
          setEditingProduct(null)
        }}
        onSave={saveProduct}
      />
    </div>
  )
}
