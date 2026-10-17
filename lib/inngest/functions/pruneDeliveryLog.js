import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'

const RETENTION_DAYS = 30

export const pruneDeliveryLog = inngest.createFunction(
  { id: 'prune-push-delivery-log', retries: 1, triggers: [{ cron: '0 3 * * *' }] },
  async ({ step }) => {
    const deleted = await step.run('delete-old-rows', async () => {
      const supabase = createAdminClient()
      const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('push_delivery_log')
        .delete()
        .lt('created_at', cutoff)
        .select('id')
      if (error) throw new Error(error.message)
      return data.length
    })
    return { deleted }
  }
)
