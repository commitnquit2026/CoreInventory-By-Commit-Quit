import { NavLink, useNavigate } from 'react-router-dom'
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  Package,
  ScrollText,
  Settings,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/*──────────────────────────────────────────────────────────────
  Role-specific navigation configuration
  ─────────────────────────────────────────────────────────────*/

const managerNav = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/operations', label: 'Operations', icon: ClipboardList },
      { to: '/warehouses', label: 'Warehouses', icon: Building2 },
      { to: '/suppliers', label: 'Suppliers', icon: Building2 },
      { to: '/ledger', label: 'Stock Ledger', icon: ScrollText },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const staffNav = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'My Tasks', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Warehouse Ops',
    items: [
      { to: '/operations', label: 'Operations', icon: ClipboardList },
      { to: '/warehouses', label: 'Warehouses', icon: Building2 },
      { to: '/ledger', label: 'Move History', icon: ScrollText },
    ],
  },
]

function getNavForRole(role) {
  if (role === 'Inventory Manager') return managerNav
  return staffNav // Warehouse Staff & others
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navSections = getNavForRole(user?.role)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  /* Role badge colour */
  const badgeClass =
    user?.role === 'Inventory Manager'
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-teal-100 text-teal-700'

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 shrink-0">
        <img src="/logo.png" alt="CoreInventory" className="h-10 w-10" />
        <div>
          <p className="font-heading text-lg font-semibold text-slate-900">CoreInventory</p>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
            Inventory Suite
          </p>
        </div>
      </div>

      {/* ─── Role Badge ─────────────────────────────────── */}
      <div className="px-6 pt-4 pb-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {user?.role || 'Staff'}
        </span>
      </div>

      {/* ─── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ─── Profile Footer ─────────────────────────────── */}
      <div className="border-t border-slate-200 p-4 shrink-0">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <User className="h-4 w-4" />
          {user?.first_name || user?.username || 'My Profile'}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
