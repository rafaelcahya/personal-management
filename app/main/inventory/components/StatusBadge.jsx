export default function StatusBadge({ status }) {
  const isActive = status === 'active'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-slate-100 text-slate-500 border border-slate-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}
