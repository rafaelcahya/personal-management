import { NextResponse } from 'next/server'
import { deleteRoute } from '@/lib/services/running/routes/deleteRoute'
import { updateRoute } from '@/lib/services/running/routes/updateRoute'
import { routeIdSchema, updateRouteSchema } from '@/schemas/savedRoute'
import {
  authenticate,
  errorResponse,
  invalidIdResponse,
  readJsonBody,
} from '@/lib/utils/running/routeHandlers'

export async function PATCH(request, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = routeIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('route')

    const { body, response } = await readJsonBody(request)
    if (response) return response

    const result = updateRouteSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = await updateRoute(supabase, user.id, id.data, { name: result.data.name })
    if (!data) return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    return NextResponse.json({ data, message: 'Renamed' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'routes PATCH')
  }
}

export async function DELETE(_, { params }) {
  try {
    const { supabase, user } = await authenticate()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = routeIdSchema.safeParse((await params).id)
    if (!id.success) return invalidIdResponse('route')

    const deleted = await deleteRoute(supabase, user.id, id.data)
    if (!deleted) return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted' }, { status: 200 })
  } catch (err) {
    return errorResponse(err, 'routes DELETE')
  }
}
