'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { ItemData } from '@/app/components/sortable-multiple'

interface LibraryContextValue {
    items: ItemData[]
    addItem: (item: ItemData) => void
    createItem: (name: string) => void
    removeItem: (id: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ItemData[]>([])

    const addItem = (item: ItemData) => {
        setItems((prev) => [...prev, item])
    }

    const createItem = (name: string) => {
        addItem({ id: uuidv4(), name })
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <LibraryContext.Provider value={{ items, addItem, createItem, removeItem }}>
            {children}
        </LibraryContext.Provider>
    )
}

export function useLibrary() {
    const ctx = useContext(LibraryContext)
    if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
    return ctx
}