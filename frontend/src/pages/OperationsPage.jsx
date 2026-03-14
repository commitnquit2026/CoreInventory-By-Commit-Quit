import { useState } from 'react'
import { PackagePlus, Truck, RefreshCw, PackageCheck, ScrollText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ReceiptsTab from '../components/operations/ReceiptsTab'
import DeliveriesTab from '../components/operations/DeliveriesTab'
import TransfersTab from '../components/operations/TransfersTab'
import AdjustmentsTab from '../components/operations/AdjustmentsTab'
import MoveHistoryTab from '../components/operations/MoveHistoryTab'

/*──────────────────────────────────────────────────────────────
  Role-based tab configuration
  ─────────────────────────────────────────────────────────────*/

const managerTabs = [
  { key: 'receipts', label: 'Receipts', icon: PackagePlus },
  { key: 'deliveries', label: 'Deliveries', icon: Truck },
  { key: 'transfers', label: 'Transfers', icon: RefreshCw },
  { key: 'adjustments', label: 'Adjustments', icon: PackageCheck },
  { key: 'history', label: 'Move History', icon: ScrollText },
]

/* Staff: focus on picking/packing, transfers, counting */
const staffTabs = [
  { key: 'deliveries', label: 'Pick & Pack', icon: Truck },
  { key: 'transfers', label: 'Transfers', icon: RefreshCw },
  { key: 'adjustments', label: 'Stock Count', icon: PackageCheck },
  { key: 'history', label: 'Move History', icon: ScrollText },
]

export default function OperationsPage() {
  const { user } = useAuth()
  const isManager = user?.role === 'Inventory Manager'
  const tabs = isManager ? managerTabs : staffTabs
  const [active, setActive] = useState(tabs[0].key)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-slate-900">Operations</h1>
          <p className="text-sm text-slate-500">
            {isManager
              ? 'Execute inbound, outbound, transfer, and adjustment workflows.'
              : 'Perform warehouse tasks: picking, packing, transfers, and stock counts.'}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          isManager ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {user?.role || 'Staff'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                active === tab.key
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {active === 'receipts' && <ReceiptsTab />}
        {active === 'deliveries' && <DeliveriesTab />}
        {active === 'transfers' && <TransfersTab />}
        {active === 'adjustments' && <AdjustmentsTab />}
        {active === 'history' && <MoveHistoryTab />}
      </div>
    </div>
  )
}
