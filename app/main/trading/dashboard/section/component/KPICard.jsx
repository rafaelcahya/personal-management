import { Badge } from '@/components/base/Badge/Badge'

export default function KPICard({ icon, label, value, color, badge }) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-none',
    red: 'bg-red-50 text-red-600 border-none',
    blue: 'bg-blue-50 text-blue-600 border-none',
    violet: 'bg-violet-50 text-violet-600 border-none',
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="text-lg font-bold mb-1">{value}</p>
      {badge && (
        <Badge variant="secondary" className="text-xs">
          {badge}
        </Badge>
      )}
    </div>
  )
}
