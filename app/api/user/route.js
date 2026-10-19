import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerUser } from '@/lib/supabase/getServerUser'
import { getRequestBearer } from '@/lib/auth/getRequestBearer'
import { updateUserMetadata } from '@/lib/services/user/updateUserMetadata'
import { updateUserSchema } from '@/schemas/user'

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

    // The JWT's user_metadata is frozen until the token refreshes, so a just-saved profile would
    // read back stale. Ask the Auth server for the current profile.
    const { user: fresh, error: freshError } = await getServerUser(supabase)
    if (freshError || !fresh) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
    const meta = fresh.user_metadata || {}
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

    let body
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Bad request', message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Bad request', message: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      )
    }
    const { username, nickname, avatar } = parsed.data

    // Store the profile on the Supabase Auth user so it's always tied to the logged-in
    // account; avatar is kept as a public URL under avatar_url (what the navbar reads).
    const metadata = {}
    if (username !== undefined) metadata.username = username
    if (nickname !== undefined) metadata.nickname = nickname
    if (avatar !== undefined) metadata.avatar_url = avatar

    const bearer = await getRequestBearer()
    if (bearer.status !== 'none') {
      try {
        await updateUserMetadata(bearer.token, metadata)
      } catch (err) {
        if (err?.status === 401 || err?.status === 403) {
          return NextResponse.json(
            { error: 'Unauthorized', message: 'Authentication required' },
            { status: 401 }
          )
        }
        throw err
      }
    } else {
      const { error } = await supabase.auth.updateUser({ data: metadata })
      if (error) throw error
    }

    return NextResponse.json({ data: { user: metadata }, message: 'User updated successfully' })
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
