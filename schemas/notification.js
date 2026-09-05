import { z } from 'zod'

export const listNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['all', 'unread', 'read']).default('all'),
})

export const markNotificationReadSchema = z.object({
  id: z.coerce.number().int().positive(),
})
