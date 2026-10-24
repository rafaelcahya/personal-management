import { getTeBand, cleanTeMessage, fmtTe } from '../../../utils/garmin'

const SEGMENTS = 5

export default function TeMeter({ id, title, caption, value, message }) {
  const num = Number(value)
  const band = getTeBand(num)
  const text = cleanTeMessage(message) ?? band.meaning

  return (
    <div id={id} className="flex flex-col gap-1.5">
      <span className="text-xs text-slate-400">{caption}</span>
      <span className={`text-2xl font-semibold tabular-nums ${band.text}`}>{fmtTe(num)}</span>
      <div role="img" aria-label={`${title} ${fmtTe(num)} of 5, ${text}`} className="flex gap-1">
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const fill = Math.min(1, Math.max(0, num - i))
          return (
            <div key={i} className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${band.fill}`}
                style={{ width: `${fill * 100}%` }}
              />
            </div>
          )
        })}
      </div>
      <span className={`text-sm font-medium ${band.text}`}>{text}</span>
    </div>
  )
}
