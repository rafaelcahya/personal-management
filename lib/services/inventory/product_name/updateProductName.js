import { createClient } from '@/lib/supabase/server'

export async function updateProductName(id, payload, userId) {
  const supabase = await createClient()

  const { data: existing, error: lookupError } = await supabase
    .from('product_name')
    .select('id')
    .eq('user_id', userId)
    .ilike('product_name', payload.product_name)
    .neq('product_name_status', 'deleted')
    .neq('id', id)
    .maybeSingle()

  if (lookupError) {
    console.error('[product-name/update] uniqueness check error:', lookupError)
    throw new Error(lookupError.message)
  }

  if (existing) {
    const err = new Error('Product name already exists')
    err.code = 'CONFLICT'
    throw err
  }

  const updateData = {
    product_name: payload.product_name,
    product_name_status: payload.product_name_status,
    note: payload.note,
    updated_at: new Date().toISOString(),
  }

  if (payload.product_name_status === 'deleted') {
    updateData.deleted_at = payload.deleted_at || new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('product_name')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, product_name, product_name_status, note, created_at, updated_at, deleted_at')
    .single()

  if (error) {
    console.error('[product-name/update] update error:', error)
    throw new Error(error.message)
  }

  return data
}
