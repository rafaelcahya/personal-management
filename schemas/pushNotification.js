import { z } from 'zod'
import { isAllowedPushEndpoint } from '@/lib/utils/pushEndpoint'

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

// subscription is null when the user turns push off
export const savePushSubscriptionSchema = z.object({
  subscription: pushSubscriptionSchema.nullable().optional(),
})

export const pushTestSchema = z.object({ endpoint: pushEndpoint })
