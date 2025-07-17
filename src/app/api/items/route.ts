import { readItemData, writeItemData } from '@/lib/itemsDb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    const data = await readItemData()
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    await writeItemData(body)
    return NextResponse.json({ status: 'ok' })
}