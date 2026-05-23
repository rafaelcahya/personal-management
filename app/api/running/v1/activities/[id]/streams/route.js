// GET /api/running/v1/activities/[id]/streams
// Query param: ?resolution=raw|1s|5s|10s|30s (default: 10s)

export async function GET(_request, { params: _params }) {
  // TODO: requireAuth
  // TODO: verify ownership via rt_activities
  // TODO: query rt_activity_streams WHERE activity_id = params.id
  // TODO: downsample sesuai resolution parameter
  // TODO: return { data, meta: { total_points, resolution } }
}
