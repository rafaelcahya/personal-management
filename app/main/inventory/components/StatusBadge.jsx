import { Badge } from '@/components/base/Badge/Badge'

export default function StatusBadge({ status }) {
  const isActive = status === 'active'
  return (
    <Badge
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700 '
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  )
}
