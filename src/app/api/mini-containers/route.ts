import { readMiniData, writeMiniData } from '@/lib/miniDb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const data = await readMiniData()
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    await writeMiniData(body)
    return NextResponse.json({ status: 'ok' })
}