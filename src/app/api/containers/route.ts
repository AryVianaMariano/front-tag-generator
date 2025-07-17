import { readData, writeData } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const data = await readData()
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    await writeData(body)
    return NextResponse.json({ status: 'ok' })
}