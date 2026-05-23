// GET /api/running/v1/ai/insights → list insights
// Query params: ?type=&acknowledged=&limit=

export async function GET(_request) {
  // TODO: requireAuth
  // TODO: parse searchParams
  // TODO: query rt_ai_insights WHERE user_id = user.id AND status = 'completed' AND is_valid = true
  // TODO: filter by type dan acknowledged kalau ada
}
