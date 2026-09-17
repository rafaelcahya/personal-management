// Seed/cleanup helpers for notification tests. Notifications have no create API
// (they're produced by Inngest via the admin client), so the realtime bell tests
// insert rows directly with the service-role key, then clean them up.
//
// These hit PostgREST via raw fetch with explicit service-role headers rather
// than the shared supabase-js admin client: inside Cypress's bundled config
// context the supabase-js client does not resolve the `sb_secret_` key to
// service_role, so RLS blocks the insert. Raw fetch with the key in both
// `apikey` and `Authorization` headers reliably runs as service_role.

const REST = () => `${process.env.SUPABASE_URL}/rest/v1/notifications`
const authHeaders = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return { apikey: key, Authorization: `Bearer ${key}` }
}

export const notificationTasks = () => ({
  async seedNotification({
    userId,
    type = 'product_update',
    title = 'Cypress realtime seed',
    message = 'Seeded by Cypress for the realtime bell contract',
    data = null,
    is_read = false,
  }) {
    const res = await fetch(REST(), {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ user_id: userId, type, title, message, data, is_read }),
    })
    const text = await res.text()
    if (!res.ok)
      throw new Error(`seedNotification failed (${res.status}, userId=${userId}): ${text}`)
    return JSON.parse(text)[0]
  },

  async deleteNotification({ id }) {
    if (!id) return null
    const res = await fetch(`${REST()}?id=eq.${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`deleteNotification failed (${res.status}): ${await res.text()}`)
    return { success: true }
  },
})
