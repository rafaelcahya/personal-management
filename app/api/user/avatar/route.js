import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'BAD_REQUEST', message: 'No file provided' },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage.from('avatar').upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatar').getPublicUrl(filePath)

    return NextResponse.json(
      { data: { path: filePath, url: data.publicUrl }, message: 'Avatar uploaded successfully' },
      { status: 201 }
    )
  } catch (err) {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err.message }, { status: 500 })
  }
}
