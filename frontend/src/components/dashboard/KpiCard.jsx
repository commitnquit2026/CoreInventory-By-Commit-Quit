import { formatNumber } from '../../utils/format'

export default function KpiCard({ title, value, trend, icon: Icon }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="font-heading text-2xl font-semibold text-slate-900">{formatNumber(value)}</p>
      <p className="mt-2 text-xs font-medium text-emerald-600">{trend}</p>
    </article>
  )
}
