import { z } from 'zod'

export const editStockEntrySchema = z.object({
  quantity_added: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative'),
  purchase_date: z.date({ required_error: 'Purchase date is required' }),
  note: z.string().optional(),
})
