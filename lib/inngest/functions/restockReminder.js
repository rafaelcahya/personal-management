import { inngest } from '@/lib/inngest/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { notify } from '@/lib/services/notifications/notify'
import { listUserIds } from '@/lib/services/notifications/listUserIds'
import { getRestockCandidates } from '@/lib/services/inventory/notifications/getRestockCandidates'
import { WIB_TIMEZONE } from '@/lib/utils/wib'

const productName = (p) => `${p.brand ?? ''} ${p.product ?? ''}`.trim() || 'A product'

export const restockReminder = inngest.createFunction(
  {
    id: 'restock-reminder',
    retries: 2,
    triggers: [{ cron: `TZ=${WIB_TIMEZONE} 0 9 * * *` }], // every day 09:00 WIB
  },
  async ({ step }) => {
    const userIds = await step.run('list-users', async () => listUserIds(createAdminClient()))

    let reminded = 0
    for (const userId of userIds) {
      // One step per user: a failure retries only that user, and notified products are
      // skipped on retry because the reminder row already exists.
      const count = await step.run(`restock-${userId}`, async () => {
        const admin = createAdminClient()
        const candidates = await getRestockCandidates(admin, userId)
        for (const p of candidates) {
          const name = productName(p)
          await notify(admin, {
            userId,
            type: 'restock_reminder',
            title: `Restock soon: ${name}`,
            message: `${name} will run out in about ${p.days_until_empty} days (${p.quantity} left). Plan a restock.`,
            data: {
              url: `/main/inventory/product-list/${p.id}`,
              productId: p.id,
              days_until_empty: p.days_until_empty,
            },
          })
        }
        return candidates.length
      })
      reminded += count
    }

    return { users: userIds.length, reminded }
  }
)
