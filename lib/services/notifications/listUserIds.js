const PER_PAGE = 1000

/**
 * Every user id, for scheduled jobs that notify everyone. Uses the Auth admin API because
 * not every user has a row in a module table (Inventory and Trading have none of their own).
 * @param {import('@supabase/supabase-js').SupabaseClient} admin - admin client
 * @returns {Promise<string[]>}
 */
export async function listUserIds(admin) {
  const ids = []
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PER_PAGE })
    if (error) throw new Error(error.message)
    ids.push(...data.users.map((u) => u.id))
    if (data.users.length < PER_PAGE) break
  }
  return ids
}
