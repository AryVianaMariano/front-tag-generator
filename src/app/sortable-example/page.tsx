'use client'

import React from 'react'
import { Example } from '../components/sortable-multiple'
import { AppRightSidebar } from '../components/AppRightSidebar'

export default function SortableExamplePage() {
    return (
        <main className="flex relative min-h-screen flex-col items-center justify-start p-24 gap-8">
            <h1 className="text-4xl font-bold">Sortable Multiple List</h1>

            <Example />
            <AppRightSidebar />

        </main>
    )
}