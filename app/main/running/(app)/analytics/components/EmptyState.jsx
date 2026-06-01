export default function EmptyState({ message, details }) {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] gap-1 text-center px-4">
      <p className="text-sm text-slate-400">{message}</p>
      {details && <p className="text-xs text-slate-300">{details}</p>}
    </div>
  )
}
