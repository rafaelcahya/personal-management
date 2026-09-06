import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    const meta = user.user_metadata || {}
    const data = {
      id: user.id,
      username: meta.username ?? '',
      nickname: meta.nickname ?? meta.full_name ?? '',
      avatar: meta.avatar_url ?? '',
    }

    return NextResponse.json({ data: { user: data }, message: 'User fetched successfully' })
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
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

    const body = await req.json()
    const { username, nickname, avatar } = body

    // Store the profile on the Supabase Auth user so it's always tied to the logged-in
    // account; avatar is kept as a public URL under avatar_url (what the navbar reads).
    const metadata = {}
    if (username !== undefined) metadata.username = username
    if (nickname !== undefined) metadata.nickname = nickname
    if (avatar !== undefined) metadata.avatar_url = avatar

    const { error } = await supabase.auth.updateUser({ data: metadata })

    if (error) throw error

    return NextResponse.json({ data: { user: metadata }, message: 'User updated successfully' })
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
