import { PUSH_LOG_RETENTION_DAYS } from '@/lib/constants/pushLog'
import { listPushDevices } from '@/lib/services/notifications/listPushDevices'

/**
 * Devices plus the latest push success and failure for the settings screen.
 * user_id is the caller's own id — the browser uses it to tell whose opt-in it holds.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - RLS-scoped client
 * @param {string} userId
 */
export async function getPushStatus(supabase, userId) {
  const [devices, successRes, failureRes, expiredRes] = await Promise.all([
    listPushDevices(supabase, userId),
    supabase
      .from('app_push_delivery_log')
      .select('source, created_at')
      .eq('user_id', userId)
      .eq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('app_push_delivery_log')
      .select('source, status, status_code, error, endpoint_hash, created_at')
      .eq('user_id', userId)
      .neq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // Per device, not per account: which endpoints were reported gone, whatever happened to the others.
    supabase
      .from('app_push_delivery_log')
      .select('endpoint_hash')
      .eq('user_id', userId)
      .eq('status', 'expired')
      .not('endpoint_hash', 'is', null)
      .gte(
        'created_at',
        new Date(Date.now() - PUSH_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      )
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  for (const res of [successRes, failureRes, expiredRes]) {
    if (res.error) throw new Error(res.error.message)
  }

  return {
    user_id: userId,
    devices,
    last_success: successRes.data ?? null,
    last_failure: failureRes.data ?? null,
    expired_endpoint_hashes: [...new Set((expiredRes.data ?? []).map((r) => r.endpoint_hash))],
  }
}
