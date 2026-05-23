export default function ActivityDetailPage({ params }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Activity Detail</h1>
      <p className="text-slate-500 mt-1">Activity {params.id} — coming soon</p>
    </div>
  )
}
