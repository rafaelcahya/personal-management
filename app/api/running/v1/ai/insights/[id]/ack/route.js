// PATCH /api/running/v1/ai/insights/[id]/ack → tandai insight sudah dibaca

export async function PATCH(_request, { params: _params }) {
  // TODO: requireAuth
  // TODO: verify ownership
  // TODO: update rt_ai_insights SET acknowledged = true WHERE id = params.id
}
