const filterSets = {
  documentType: ['All', 'Receipt', 'Delivery', 'Transfer', 'Adjustment'],
  category: ['All', 'Electronics', 'Packaging', 'Hardware', 'Finished Goods'],
  warehouse: ['All', 'North Hub', 'Central DC', 'East Point', 'South Hub'],
  status: ['All', 'Pending', 'Posted', 'Completed', 'Approved'],
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function DashboardFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
      <SelectFilter
        label="Document Type"
        value={filters.documentType}
        options={filterSets.documentType}
        onChange={(value) => onChange('documentType', value)}
      />
      <SelectFilter
        label="Product Category"
        value={filters.category}
        options={filterSets.category}
        onChange={(value) => onChange('category', value)}
      />
      <SelectFilter
        label="Warehouse"
        value={filters.warehouse}
        options={filterSets.warehouse}
        onChange={(value) => onChange('warehouse', value)}
      />
      <SelectFilter
        label="Status"
        value={filters.status}
        options={filterSets.status}
        onChange={(value) => onChange('status', value)}
      />
    </div>
  )
}
