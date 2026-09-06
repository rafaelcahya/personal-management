import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().trim().min(1, 'Username cannot be empty').max(50, 'Username is too long'),
  nickname: z.string().trim().max(50, 'Nickname is too long'),
})
