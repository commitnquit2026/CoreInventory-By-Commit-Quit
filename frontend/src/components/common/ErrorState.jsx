export default function ErrorState({ message = 'Unable to load data right now.' }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700 shadow-sm">
      <p className="font-semibold">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}
