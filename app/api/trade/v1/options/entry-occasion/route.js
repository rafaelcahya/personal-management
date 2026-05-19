import { NextResponse } from 'next/server'
import { getEntryOccasionOptions } from '@/lib/services/trade/options/getEntryOccasionOptions'

export async function GET() {
  try {
    const options = await getEntryOccasionOptions()

    return NextResponse.json({ success: true, options }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/options/entry-occasion error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
