import { NextResponse } from 'next/server'
import { getSellReasonOptions } from '@/lib/services/trade/options/getSellReasonOptions'

export async function GET() {
  try {
    const options = await getSellReasonOptions()

    return NextResponse.json({ success: true, options }, { status: 200 })
  } catch (err) {
    console.error('GET /api/trade/v1/options/sell-reason error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
