// BoardContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
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
    const [columns, setColumns] = useState<ColumnData[]>([{
        id: 'A', name: 'Column A'
    }, {
        id: 'B', name: 'Column B'
    }, {
        id: 'C', name: 'Column C'
    }])

    const [items, setItems] = useState<Record<string, ItemData[]>>({
        A: [
            { id: 'A0', name: 'A0' },
            { id: 'A1', name: 'A1' },
        ],
        B: [
            { id: 'B0', name: 'B0' }
        ],
        C: []
    })

    const [poolItems, setPoolItems] = useState<ItemData[]>([])

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor),
    )

    const getContainer = (id: string): string | null => {
        if (id === 'POOL' || poolItems.some((i) => i.id === id)) return 'POOL'
        if (id in items) return id
        for (const key in items) {
            if (items[key].some((i) => i.id === id)) return key
        }
        return null
    }

    const addColumn = (name: string) => {
        const id = uuidv4()
        setColumns(prev => [...prev, { id, name }])
        setItems(prev => ({ ...prev, [id]: [] }))
    }

    const addPoolItem = (name: string) => {
        const newItem: ItemData = { id: uuidv4(), name }
        setPoolItems(prev => [...prev, newItem])
    }

    const handleDragStart = (_event: DragStartEvent) => {}

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!active || !over) return

        const activeId = String(active.id)
        const overId = String(over.id)

        const activeContainer = getContainer(activeId)
        const overContainer = getContainer(overId)

        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        const activeItem =
            activeContainer === 'POOL'
                ? poolItems.find(i => i.id === activeId)
                : items[activeContainer]?.find(i => i.id === activeId)

        if (!activeItem) return

        if (activeContainer === 'POOL') {
            setPoolItems(prev => prev.filter(i => i.id !== activeId))
        } else {
            setItems(prev => ({
                ...prev,
                [activeContainer]: prev[activeContainer].filter(i => i.id !== activeId)
            }))
        }

        if (overContainer === 'POOL') {
            setPoolItems(prev => [...prev, activeItem])
        } else {
            setItems(prev => ({
                ...prev,
                [overContainer]: [...prev[overContainer], activeItem]
            }))
        }
    }

    const handleDragEnd = (_event: DragEndEvent) => {}

    return (
        <BoardContext.Provider value={{ columns, items, poolItems, addColumn, addPoolItem }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {children}
            </DndContext>
        </BoardContext.Provider>
    )
}
