import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.12),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.12),_transparent_35%)]" />
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className={`fixed inset-0 z-20 bg-slate-900/30 transition lg:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <main className="flex w-full flex-col lg:pl-0">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <section className="animate-rise px-4 py-5 md:px-6 lg:px-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
