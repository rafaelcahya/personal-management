export default function SectionGroupRow({ label, tickerCount }) {
  return (
    <tr>
      <td
        colSpan={1 + tickerCount * 3}
        className="px-4 py-2 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100"
      >
        {label}
      </td>
    </tr>
  )
}
