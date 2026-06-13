import { z } from 'zod'

const linkEntrySchema = z.object({
  hyperlink: z.string().min(1, 'Hyperlink text is required'),
  link: z.string().url('Must be a valid URL'),
})

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(150, 'Title must not exceed 150 characters'),
  event_description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional()
    .or(z.literal('')),
  impact_direction: z.enum(['UP', 'DOWN'], {
    required_error: 'Please select an impact direction',
  }),
  actual_outcome: z.enum(['UP', 'DOWN']).nullable().optional(),
  event_date: z.date({
    required_error: 'Please select an event date',
  }),
  tags: z
    .array(z.string().max(30, 'Each tag must not exceed 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  links: z.array(linkEntrySchema).min(1, 'At least 1 reference link is required'),
})
