// GET /api/running/v1/activities → list, filter: ?from=&to=&type=&page=
// POST /api/running/v1/activities → manual entry

export async function GET(_request) {
  // TODO: requireAuth
  // TODO: parse searchParams (from, to, type, page, limit)
  // TODO: query rt_activities WHERE user_id = user.id + filters
  // TODO: return paginated list
}

export async function POST(_request) {
  // TODO: requireAuth
  // TODO: validate body
  // TODO: dedup check (fuzzy match ±5 menit / ±200m) → warning kalau ada potential duplicate
  // TODO: insert rt_activities (source: 'manual')
}
