/**
 * Single-cell error indicator for one ticker's sub-column. Rendered once per
 * category group (Value / RC Assessment / Signal) since compare-mode columns
 * are grouped by category rather than adjacent per ticker (spec section 3).
 * In single mode (1 ticker, no grouping) it still reads correctly as one row.
 */
export default function TickerErrorCells({ ticker, onRetry, className = '' }) {
  return (
    <td className={`px-3 py-3 text-center ${className}`}>
      <span className="text-xs text-slate-400">failed</span>
      <button
        type="button"
        onClick={() => onRetry(ticker)}
        aria-label={`Retry loading ${ticker} data`}
        className="ml-2 text-xs underline text-violet-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 rounded"
      >
        Retry
      </button>
    </td>
  )
}
