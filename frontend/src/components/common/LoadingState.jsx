export default function LoadingState({ label = 'Loading data...' }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
