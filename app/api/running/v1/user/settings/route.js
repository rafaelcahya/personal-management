// GET /api/running/v1/user/settings
// PATCH /api/running/v1/user/settings

export async function GET() {
  // TODO: requireAuth
  // TODO: select dari rt_user_settings WHERE user_id = user.id
}

export async function PATCH(_request) {
  // TODO: requireAuth
  // TODO: validate body (hr_zones_method, threshold_hr, notify_*)
  // TODO: upsert rt_user_settings
}
