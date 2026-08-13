import { buildSpec } from '@/lib/openapi/spec'

export const dynamic = 'force-dynamic'

export async function GET() {
  const spec = buildSpec()
  return Response.json(spec)
}
