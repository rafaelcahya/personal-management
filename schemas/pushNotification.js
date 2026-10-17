import { z } from 'zod'
import { isAllowedPushEndpoint } from '@/lib/utils/pushEndpoint'
import { NOTIFICATION_TYPES } from '@/lib/constants/notificationTypes'

const pushEndpoint = z
  .url({ error: 'endpoint must be a valid URL' })
  .max(2048)
  .refine(isAllowedPushEndpoint, { error: 'endpoint is not a supported push service' })

export const pushSubscriptionSchema = z.object({
  endpoint: pushEndpoint,
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1, 'p256dh key is required').max(200),
    auth: z.string().min(1, 'auth key is required').max(100),
  }),
})

export const savePushDeviceSchema = z.object({ subscription: pushSubscriptionSchema })

export const pushTestSchema = z.object({ endpoint: pushEndpoint })

export const pushDeviceIdSchema = z.uuid({ error: 'Invalid device id' })

export const updatePreferenceSchema = z.object({
  type: z.enum(NOTIFICATION_TYPES, { error: 'Unknown notification type' }),
  push_enabled: z.boolean({ error: 'push_enabled must be true or false' }),
})
