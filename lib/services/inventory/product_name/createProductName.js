import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function createProductName(
  userId,
  productName,
  productNameStatus,
  note,
  deletedAt = null
) {
  const supabase = await createClient()

  const { data: existing, error: lookupError } = await supabase
    .from('product_name')
    .select('id')
    .eq('user_id', userId)
    .ilike('product_name', productName)
    .neq('product_name_status', 'deleted')
    .maybeSingle()

  if (lookupError) {
    console.error('[product-name/create] uniqueness check error:', lookupError)
    throw new Error(lookupError.message)
  }

  if (existing) {
    const err = new Error('Product name already exists')
    err.code = 'CONFLICT'
    throw err
  }

  const supabaseAdmin = createAdminClient()
  const insertData = {
    user_id: userId,
    product_name: productName,
    product_name_status: productNameStatus || 'active',
    note: note,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (productNameStatus === 'deleted') {
    insertData.deleted_at = deletedAt || new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin
    .from('product_name')
    .insert(insertData)
    .select('id, product_name, product_name_status, note, created_at, updated_at, deleted_at')
    .single()

  if (error) throw new Error(error.message)

  return data
}
