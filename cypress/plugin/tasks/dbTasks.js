export const dbTasks = (supabaseAdmin) => ({
  async supabaseRawQuery({ table, select = '*', filters = {}, single = false }) {
    let query = supabaseAdmin.from(table).select(select)

    for (const [column, value] of Object.entries(filters)) {
      if (value === null) {
        query = query.is(column, null)
      } else {
        query = query.eq(column, value)
      }
    }

    if (single) query = query.single()

    const { data, error } = await query

    if (error) {
      if (error.code === 'PGRST116') return null
      throw new Error(`DB query failed: ${error.message}`)
    }

    return data
  },
})
