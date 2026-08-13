import { z } from 'zod'

const NODE_TYPES = ['category', 'ticker']

export const createNodeSchema = z
  .object({
    parent_id: z.string().uuid('Invalid parent node ID').nullable().optional(),
    node_type: z.enum(NODE_TYPES, {
      errorMap: () => ({ message: 'node_type must be category or ticker' }),
    }),
    name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
    nominal: z
      .number({ invalid_type_error: 'Nominal must be a number' })
      .positive('Nominal must be a positive number')
      .nullable()
      .optional(),
    notes: z.string().max(500, 'Notes must not exceed 500 characters').nullable().optional(),
    sort_order: z.number().int().min(0).optional().default(0),
    uninvested_cash_category_id: z.string().uuid('Invalid category ID').nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.node_type === 'ticker' && data.nominal == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nominal is required for ticker nodes',
        path: ['nominal'],
      })
    }
    if (data.node_type === 'category' && data.nominal != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category nodes must not have a nominal',
        path: ['nominal'],
      })
    }
    if (data.node_type === 'category' && data.notes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category nodes must not have notes',
        path: ['notes'],
      })
    }
  })

export const updateNodeSchema = z
  .object({
    id: z.string().uuid('Invalid node ID'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must not exceed 100 characters')
      .optional(),
    node_type: z
      .enum(NODE_TYPES, {
        errorMap: () => ({ message: 'node_type must be category or ticker' }),
      })
      .optional(),
    nominal: z
      .number({ invalid_type_error: 'Nominal must be a number' })
      .positive('Nominal must be a positive number')
      .nullable()
      .optional(),
    notes: z.string().max(500, 'Notes must not exceed 500 characters').nullable().optional(),
    uninvested_cash_category_id: z.string().uuid('Invalid category ID').nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.node_type === 'category' && data.nominal != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category nodes cannot have a nominal value',
        path: ['nominal'],
      })
    }
    if (data.node_type === 'category' && data.notes != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Category nodes cannot have notes',
        path: ['notes'],
      })
    }
  })

export const deleteNodeQuerySchema = z.object({
  id: z.string().uuid('Invalid node ID'),
})

export const moveNodeSchema = z.object({
  id: z.string().uuid('Invalid node ID'),
  new_parent_id: z.string().uuid('Invalid parent node ID').nullable(),
  sort_order: z.number().int().min(0).optional().default(0),
})

export const updateUninvestedCashSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .nonnegative('Amount cannot be negative'),
})

export const createCashCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  nominal: z
    .number({ invalid_type_error: 'Nominal must be a number' })
    .nonnegative('Nominal cannot be negative'),
  sort_order: z.number().int().min(0).optional().default(0),
})

export const updateCashCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  nominal: z
    .number({ invalid_type_error: 'Nominal must be a number' })
    .nonnegative('Nominal cannot be negative')
    .optional(),
})

export const deleteCashCategoryQuerySchema = z.object({
  id: z.string().uuid('Invalid category ID'),
})

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

export const updateHighlightsSchema = z.object({
  highlights: z.record(
    z.string().uuid('Invalid node ID'),
    z.string().regex(HEX_COLOR_REGEX, 'Invalid hex color')
  ),
})
