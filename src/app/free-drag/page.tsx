'use client'

import { FreeDragExample } from "./FreeDragExample"

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
            <h1 className="text-3xl font-bold">Demo de Drag & Drop</h1>
            <FreeDragExample />
        </main>
    )
}