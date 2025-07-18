'use client'

import React from 'react'
import { Example } from '../components/sortable-multiple'
import { AppRightSidebar } from '../components/AppRightSidebar'

export default function SortableExamplePage() {
    return (
        <main className="relative flex min-h-screen gap-8 p-24">
            <div className="flex flex-1 flex-col items-center gap-8">
                <h1 className="text-4xl font-bold">Sortable Multiple List</h1>
                <Example />
            </div>
            <AppRightSidebar />
        </main>
    )
}