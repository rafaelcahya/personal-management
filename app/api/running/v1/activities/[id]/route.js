// GET /api/running/v1/activities/[id] → detail lengkap
// PATCH /api/running/v1/activities/[id] → edit notes, type, RPE
// DELETE /api/running/v1/activities/[id]

export async function GET(_request, { params: _params }) {
  // TODO: requireAuth
  // TODO: select rt_activities + rt_activity_splits WHERE id = params.id AND user_id = user.id
}

export async function PATCH(_request, { params: _params }) {
  // TODO: requireAuth
  // TODO: validate body (notes, activity_type, perceived_exertion only — tidak boleh edit core metrics)
  // TODO: update rt_activities
}

export async function DELETE(_request, { params: _params }) {
  // TODO: requireAuth
  // TODO: verify ownership
  // TODO: delete rt_activities (cascade ke streams + splits)
}
