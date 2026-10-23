import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { PUSH_LOG_RETENTION_DAYS } from '@/lib/constants/pushLog'

export const pruneDeliveryLog = inngest.createFunction(
  { id: 'prune-push-delivery-log', retries: 1, triggers: [{ cron: '0 3 * * *' }] },
  async ({ step }) => {
    const deleted = await step.run('delete-old-rows', async () => {
      const supabase = createAdminClient()
      const cutoff = new Date(
        Date.now() - PUSH_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000
      ).toISOString()
      const { data, error } = await supabase
        .from('app_push_delivery_log')
        .delete()
        .lt('created_at', cutoff)
        .select('id')
      if (error) throw new Error(error.message)
      return data.length
    })
    return { deleted }
  }
)
