import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().trim().min(1, 'Username cannot be empty').max(50, 'Username is too long'),
  nickname: z.string().trim().max(50, 'Nickname is too long'),
})

const avatarUrlSchema = z
  .string()
  .max(2048, 'Avatar URL is too long')
  .refine((value) => {
    if (value === '') return true
    try {
      return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
      return false
    }
  }, 'Avatar must be an http(s) URL')

// Body of PUT /api/user. null or '' on avatar clears it.
export const updateUserSchema = z
  .object({
    username: z.string().trim().min(1, 'Username cannot be empty').max(50, 'Username is too long'),
    nickname: z.string().trim().max(50, 'Nickname is too long'),
    avatar: avatarUrlSchema.nullable(),
  })
  .partial()
  .strict()
