import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    status: 'alive',
    system: 'Eternum Oracle',
    timestamp: new Date().toISOString()
  })
}
