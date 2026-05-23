// POST /api/running/v1/ai/insights/generate → on-demand analysis
// Body: { activity_id, type: 'post_activity' }

export async function POST(_request) {
  // TODO: requireAuth
  // TODO: validate body
  // TODO: verify activity ownership
  // TODO: emit inngest event 'ai/generate-post-activity-insight'
  // TODO: return { queued: true, message: 'Analisis sedang diproses' }
}
