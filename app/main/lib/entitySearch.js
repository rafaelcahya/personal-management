import {
  Package,
  Activity,
  Trophy,
  Tag,
  Type,
  History,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
} from 'lucide-react'
import { fetchProductList } from '@/lib/api/product'
import { fetchProductBrand } from '@/lib/api/productBrand'
import { fetchProductName } from '@/lib/api/productName'
import { fetchProductHistory } from '@/lib/api/productHistory'
import { fetchActivities, fetchRaceLog, fetchSavedRoutes } from '@/lib/api/running'
import { fetchTradeList } from '@/lib/api/trade'
import { fetchEventList } from '@/lib/api/event'
import { getCurrencyHoldings } from '@/lib/api/currencyInvestments'

const ENTITY_LIMIT = 5

// The underlying list APIs don't forward an AbortSignal, so cancellation is handled by the
// caller via a stale-query guard. Each source is isolated so one failing endpoint doesn't
// blank the whole result set. `pick` extracts the row array since APIs disagree on shape.
async function safe(promise, map, pick = (res) => res?.data ?? []) {
  try {
    const res = await promise
    return pick(res)
      .map(map)
      .filter((row) => row.label)
  } catch {
    return []
  }
}

// Entities without a detail route deep-link into their list page with the search prefilled,
// so several rows sharing a name collapse to one destination.
function dedupeByLabel(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.label.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function listHref(base, term) {
  return `${base}?search=${encodeURIComponent(term)}`
}

// Matches the events/race pages: render dates as "06 Sep 2026", parsing yyyy-MM-dd as a
// local date so the day doesn't shift across timezones.
function formatDate(value) {
  if (!value) return ''
  const datePart = String(value).split('T')[0]
  const local = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
    ? new Date(...datePart.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))))
    : new Date(value)
  if (Number.isNaN(local.getTime())) return String(value)
  return local.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export async function searchEntities(query) {
  const q = query.trim()
  if (q.length < 2) return []

  // Currency holdings and saved routes have no server-side search, so fetch all and filter here.
  const qLower = q.toLowerCase()
  const matchesQuery = (item) => item.label?.toLowerCase().includes(qLower)

  const [products, brands, names, history, activities, races, trades, events, currency, routes] =
    await Promise.all([
      safe(fetchProductList({ search: q, limit: ENTITY_LIMIT }), (p) => ({
        id: `product-${p.id}`,
        label: p.product,
        sublabel: p.brand || 'Product',
        href: `/main/inventory/product-list/${p.id}`,
        icon: Package,
      })),
      safe(fetchProductBrand({ search: q, limit: ENTITY_LIMIT }), (b) => ({
        id: `brand-${b.id}`,
        label: b.brand,
        sublabel: 'Brand',
        href: listHref('/main/inventory/product-brand', b.brand),
        icon: Tag,
      })),
      safe(fetchProductName({ search: q, limit: ENTITY_LIMIT }), (n) => ({
        id: `name-${n.id}`,
        label: n.product_name,
        sublabel: 'Product name',
        href: listHref('/main/inventory/product-name', n.product_name),
        icon: Type,
      })),
      safe(fetchProductHistory({ search: q, limit: ENTITY_LIMIT }), (h) => ({
        id: `history-${h.id ?? h.product}`,
        label: h.product,
        sublabel: 'Stock history',
        href: listHref('/main/inventory/product-history', h.product),
        icon: History,
      })),
      safe(fetchActivities({ search: q, limit: ENTITY_LIMIT }), (a) => ({
        id: `activity-${a.id}`,
        label: a.name,
        sublabel: a.activity_type || 'Activity',
        href: `/main/running/activities/${a.id}`,
        icon: Activity,
      })),
      safe(fetchRaceLog({ search: q, limit: ENTITY_LIMIT }), (r) => ({
        id: `race-${r.id}`,
        label: r.title,
        sublabel: formatDate(r.race_date) || 'Race',
        href: `/main/running/race-log/${r.id}`,
        icon: Trophy,
      })),
      safe(
        fetchTradeList({ ticker: q, limit: ENTITY_LIMIT * 3 }),
        (t) => ({
          id: `trade-${t.id}`,
          label: t.ticker,
          sublabel: 'Trade',
          href: listHref('/main/trading/trade', t.ticker),
          icon: TrendingUp,
        }),
        (res) => res?.trades ?? []
      ),
      safe(
        fetchEventList({ search: q }),
        (e) => ({
          id: `event-${e.id}`,
          label: e.title,
          sublabel: formatDate(e.event_date) || 'Market event',
          href: `/main/trading/event/${e.id}`,
          icon: Calendar,
        }),
        (res) => res?.events ?? []
      ),
      safe(
        getCurrencyHoldings(),
        (h) => ({
          id: `currency-${h.id}`,
          label: h.currency,
          sublabel: 'Currency holding',
          href: `/main/trading/currency/holdings/${h.id}`,
          icon: DollarSign,
        }),
        (res) => res ?? []
      ),
      safe(
        fetchSavedRoutes(),
        (r) => ({
          id: `route-${r.id}`,
          label: r.name,
          sublabel: 'Running route',
          href: '/main/running/route-builder',
          icon: MapPin,
        }),
        (res) => res ?? []
      ),
    ])

  const groups = []
  const push = (module, items) => {
    const deduped = dedupeByLabel(items).slice(0, ENTITY_LIMIT)
    if (deduped.length) groups.push({ module, items: deduped })
  }
  push('Products', products)
  push('Brands', brands)
  push('Product Names', names)
  push('Stock History', history)
  push('Activities', activities)
  push('Races', races)
  push('Trades', trades)
  push('Market Events', events)
  push('Currency', currency.filter(matchesQuery))
  push('Routes', routes.filter(matchesQuery))
  return groups
}
