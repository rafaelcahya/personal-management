import { createAdminClient } from '@/lib/supabase/admin'

/** Removes the stored key and cached token. Metrics already linked to activities stay. */
export async function deleteGarminConnection(userId) {
  const admin = createAdminClient()
  const { error } = await admin.from('rt_garmin_credentials').delete().eq('user_id', userId)
  if (error) throw new Error(error.message)
}
