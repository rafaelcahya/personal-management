import { z } from 'zod'

const linkEntrySchema = z.object({
  hyperlink: z.string().min(1, 'Hyperlink text is required'),
  link: z.string().url('Must be a valid URL'),
})

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  event_description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .or(z.literal('')),
  impact_direction: z.enum(['UP', 'DOWN'], {
    required_error: 'Please select an impact direction',
  }),
  event_date: z.date({
    required_error: 'Please select an event date',
  }),
  event_type: z
    .enum([
      'Earnings',
      'Central Bank',
      'Macro',
      'Corporate Action',
      'Geopolitical',
      'Personal',
      'Other',
    ])
    .nullable()
    .optional(),
  links: z.array(linkEntrySchema).min(1, 'At least 1 reference link is required'),
})
