'use client'

import React, { createContext, useContext, useState } from 'react'
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import { ItemData } from './Item'
import { v4 as uuidv4 } from 'uuid'

interface ColumnData {
    id: string
    name: string
}

interface BoardContextValue {
    columns: ColumnData[]
    items: Record<string, ItemData[]>
    poolItems: ItemData[]
    addColumn: (name: string) => void
    addPoolItem: (name: string) => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) {
        throw new Error('useBoard must be used within BoardProvider')
    }
    return context
}

export function BoardProvider({ children }: { children: React.ReactNode }) {
    const [columns, setColumns] = useState<ColumnData[]>([
        { id: 'A', name: 'Column A' },
        { id: 'B', name: 'Column B' },
        { id: 'C', name: 'Column C' },
    ])

    const [items, setItems] = useState<Record<string, ItemData[]>>({
        A: [
            { id: 'A0', name: 'A0' },
            { id: 'A1', name: 'A1' },
        ],
        B: [{ id: 'B0', name: 'B0' }],
        C: [],
    })

    const [poolItems, setPoolItems] = useState<ItemData[]>([])

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

    const addColumn = (name: string) => {
        const id = uuidv4()
        setColumns((cols) => [...cols, { id, name }])
        setItems((it) => ({ ...it, [id]: [] }))
    }

    const addPoolItem = (name: string) => {
        const item: ItemData = { id: uuidv4(), name }
        setPoolItems((prev) => [...prev, item])
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!active || !over) return

        const activeId = String(active.id)
        const activeType = active.data.current?.type
        const sourceColumn = active.data.current?.column as string | undefined

        const targetColumn = (over.data.current?.column as string) || String(over.id)

        if (activeType === 'poolItem' && targetColumn) {
            const dragged = poolItems.find((i) => i.id === activeId)
            if (!dragged) return

            setPoolItems((prev) => prev.filter((i) => i.id !== activeId))
            setItems((prev) => ({
                ...prev,
                [targetColumn]: [...(prev[targetColumn] || []), dragged],
            }))
            return
        }

        if (
            activeType === 'item' &&
            sourceColumn &&
            targetColumn &&
            sourceColumn !== targetColumn
        ) {
            const dragged = items[sourceColumn].find((i) => i.id === activeId)
            if (!dragged) return

            setItems((prev) => ({
                ...prev,
                [sourceColumn]: prev[sourceColumn].filter((i) => i.id !== activeId),
            }))

            setItems((prev) => ({
                ...prev,
                [targetColumn]: [...(prev[targetColumn] || []), dragged],
            }))
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = columns.findIndex((c) => c.id === active.id)
        const newIndex = columns.findIndex((c) => c.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            const newColumns = [...columns]
            const [moved] = newColumns.splice(oldIndex, 1)
            newColumns.splice(newIndex, 0, moved)
            setColumns(newColumns)
        }
    }

    return (
        <BoardContext.Provider value={{ columns, items, poolItems, addColumn, addPoolItem }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {children}
            </DndContext>
        </BoardContext.Provider>
    )
}
