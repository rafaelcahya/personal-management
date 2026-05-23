// GET /api/running/v1/user/profile → baca profil + biometric
// PATCH /api/running/v1/user/profile → update biometric

export async function GET() {
  // TODO: requireAuth
  // TODO: select dari rt_users WHERE id = user.id
}

export async function PATCH(_request) {
  // TODO: requireAuth
  // TODO: validate body (birth_date, height_cm, weight_kg, max_hr, resting_hr_baseline)
  // TODO: upsert rt_users
}
