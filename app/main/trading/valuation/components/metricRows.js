/**
 * Static row definitions for the analysis table — metric key, label, and
 * which data group in the API response (`fundamentals` | `monteCarlo` | `risk`)
 * supplies the value. RC Assessment label + signal per row/ticker come from
 * `assessments[rowKey]` in the API response (see lib/api/valuation.js).
 */
export const METRIC_SECTIONS = [
  {
    label: 'Fundamental Metrics',
    group: 'fundamentals',
    rows: [
      { key: 'pbv', label: 'PBV' },
      { key: 'per', label: 'PER' },
      { key: 'roe', label: 'ROE' },
      { key: 'der', label: 'DER' },
      { key: 'eps', label: 'EPS' },
      { key: 'graham', label: 'Graham Number' },
    ],
  },
  {
    label: 'Monte Carlo',
    group: 'monteCarlo',
    rows: [
      { key: 'price', label: 'Current Price' },
      { key: 'p10', label: 'P10 (Bear case)' },
      { key: 'p50', label: 'P50 (Base case)' },
      { key: 'p90', label: 'P90 (Bull case)' },
    ],
  },
  {
    label: 'Risk Metrics',
    group: 'risk',
    rows: [
      { key: 'sharpe1y', label: 'Sharpe 1Y' },
      { key: 'sharpe3y', label: 'Sharpe 3Y' },
      { key: 'sharpe5y', label: 'Sharpe 5Y' },
      { key: 'sortino1y', label: 'Sortino 1Y' },
      { key: 'sortino3y', label: 'Sortino 3Y' },
      { key: 'sortino5y', label: 'Sortino 5Y' },
      { key: 'calmar', label: 'Calmar Ratio' },
      { key: 'maxdd', label: 'Max Drawdown' },
    ],
  },
]
