import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowRightLeft,
  Package,
  ShoppingCart,
  Truck,
  PackagePlus,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import ChartCard from '../components/dashboard/ChartCard'
import DashboardFilters from '../components/dashboard/DashboardFilters'
import KpiCard from '../components/dashboard/KpiCard'
import { inventoryService } from '../services/inventoryService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const pieColors = ['#0f766e', '#0891b2', '#14b8a6', '#f59e0b', '#1d4ed8']

const initialFilters = {
  documentType: 'All',
  category: 'All',
  warehouse: 'All',
  status: 'All',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isManager = user?.role === 'Inventory Manager'

  return isManager ? <ManagerDashboard /> : <StaffDashboard />
}

/* ═══════════════════════════════════════════════════════════════
   INVENTORY MANAGER DASHBOARD
   Full KPIs, charts, category distribution, movement timeline
   ═══════════════════════════════════════════════════════════════ */
function ManagerDashboard() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState(initialFilters)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')
        const response = await inventoryService.getDashboard(filters)
        setData(response.data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [filters])

  if (loading) return <LoadingState label="Loading dashboard analytics..." />
  if (error) return <ErrorState message={error} />

  const { kpis, stockLevels, categoryDistribution, movementTimeline, warehouseComparison } = data

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-slate-900">
            Inventory Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time operational visibility across stock, movement, and warehouse activity.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Inventory Manager View
        </span>
      </div>

      <DashboardFilters
        filters={filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
      />

      {kpis.lowStockItems > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm">
          <p className="text-sm font-semibold">
            ⚠️ Alert: {kpis.lowStockItems} item(s) are below reorder threshold.
          </p>
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Receipts Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Receipts</h3>
          </div>
          <div className="p-6">
            <button
              onClick={() => navigate('/operations')}
              className="w-full rounded-lg bg-emerald-50 py-4 px-4 text-center text-emerald-700 hover:bg-emerald-100 transition"
            >
              <span className="block text-3xl font-bold">{kpis.pendingReceipts || 0}</span>
              <span className="block text-sm font-medium mt-1">to receive</span>
            </button>
            <div className="mt-6 flex justify-between text-sm">
              <div>
                <span className="block font-semibold text-slate-900">0</span>
                <span className="text-slate-500">Late</span>
              </div>
              <div className="text-right">
                <span className="block font-semibold text-slate-900">{kpis.pendingReceipts || 0}</span>
                <span className="text-slate-500">Operations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">Delivery Orders</h3>
          </div>
          <div className="p-6">
            <button
              onClick={() => navigate('/operations')}
              className="w-full rounded-lg bg-blue-50 py-4 px-4 text-center text-blue-700 hover:bg-blue-100 transition"
            >
              <span className="block text-3xl font-bold">{kpis.pendingDeliveries || 0}</span>
              <span className="block text-sm font-medium mt-1">to deliver</span>
            </button>
            <div className="mt-6 flex justify-between text-sm">
              <div>
                <span className="block font-semibold text-slate-900">0</span>
                <span className="text-slate-500">Late</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold text-slate-900">0</span>
                <span className="text-slate-500">Waiting</span>
              </div>
              <div className="text-right">
                <span className="block font-semibold text-slate-900">{kpis.pendingDeliveries || 0}</span>
                <span className="text-slate-500">Operations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WAREHOUSE STAFF DASHBOARD
   Task-oriented view: picking queue, transfers, counting tasks
   ═══════════════════════════════════════════════════════════════ */
function StaffDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const response = await inventoryService.getDashboard()
        setData(response.data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <LoadingState label="Loading your tasks..." />
  if (error) return <ErrorState message={error} />

  const kpis = data?.kpis || {}

  /* Quick-action cards for warehouse staff */
  const quickActions = [
    {
      title: 'Pick & Pack Deliveries',
      desc: 'Delivery orders awaiting picking or packing.',
      count: kpis.pendingDeliveries || 0,
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      action: () => navigate('/operations'),
    },
    {
      title:'Internal Transfers',
      desc: 'Move stock between warehouses, racks, and bins.',
      count: kpis.internalTransfers || 0,
      icon: ArrowRightLeft,
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      action: () => navigate('/operations'),
    },
    {
      title: 'Receive Incoming Goods',
      desc: 'Validate incoming receipts from suppliers.',
      count: kpis.pendingReceipts || 0,
      icon: PackagePlus,
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-700',
      action: () => navigate('/operations'),
    },
    {
      title: 'Stock Adjustments',
      desc: 'Correct mismatches from physical counts.',
      count: 0,
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      action: () => navigate('/operations'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-semibold text-slate-900">
          Welcome back, {user?.first_name || 'Staff'} 👋
        </h1>
        <p className="text-sm text-slate-500">
          Here's your warehouse task overview for today.
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          Warehouse Staff View
        </span>
      </div>

      {/* Pending Tasks Summary */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{kpis.pendingDeliveries || 0}</p>
            <p className="text-sm text-slate-300">Deliveries to Pick</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{kpis.internalTransfers || 0}</p>
            <p className="text-sm text-slate-300">Active Transfers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{kpis.pendingReceipts || 0}</p>
            <p className="text-sm text-slate-300">Receipts Waiting</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{kpis.totalProductsInStock || 0}</p>
            <p className="text-sm text-slate-300">Units in Stock</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickActions.map((qa) => {
          const Icon = qa.icon
          return (
            <button
              key={qa.title}
              onClick={qa.action}
              className={`group rounded-2xl border p-5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${qa.bgLight}`}
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-xl bg-gradient-to-br ${qa.color} p-2.5 text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                {qa.count > 0 && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${qa.textColor} bg-white/80 shadow-sm`}>
                    {qa.count} pending
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-slate-700 transition">
                {qa.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{qa.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Movement Chart (simplified for staff) */}
      {data?.movementTimeline && (
        <ChartCard title="This Week's Activity" subtitle="Incoming vs outgoing stock movements">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.movementTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="incoming" fill="#0f766e" radius={[4, 4, 0, 0]} name="In" />
                <Bar dataKey="outgoing" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  )
}
