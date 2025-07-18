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
    DragStartEvent,
    DragEndEvent,
    DragOverlay,
} from '@dnd-kit/core'
import { ItemData } from './Item'
import { arrayMove } from '@dnd-kit/sortable'
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
    const [activeItem, setActiveItem] = useState<ItemData | null>(null)

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

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const activeId = String(active.id)
        const activeType = active.data.current?.type
        if (activeType === 'poolItem') {
            const item = poolItems.find((i) => i.id === activeId)
            setActiveItem(item || null)
        } else if (activeType === 'item') {
            const sourceColumn = active.data.current?.column as string | undefined
            const item = sourceColumn ? items[sourceColumn]?.find((i) => i.id === activeId) : null
            setActiveItem(item || null)
        } else {
            setActiveItem(null)
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!active || !over) return

        const activeId = String(active.id)
        const activeType = active.data.current?.type
        const sourceColumn = active.data.current?.column as string | undefined

        const targetColumn = (over.data.current?.column as string) || String(over.id)
        const isTargetPool = targetColumn === 'POOL'

        if (activeType === 'poolItem' && targetColumn && !isTargetPool) {
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
            isTargetPool
        ) {
            const dragged = items[sourceColumn].find((i) => i.id === activeId)
            if (!dragged) return

            setItems((prev) => ({
                ...prev,
                [sourceColumn]: prev[sourceColumn].filter((i) => i.id !== activeId),
            }))

            setPoolItems((prev) => [...prev, dragged])
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
        if (!active || !over) {
            setActiveItem(null)
            return
        }

        const activeId = String(active.id)
        const overId = String(over.id)
        const activeType = active.data.current?.type
        const sourceColumn = active.data.current?.column as string | undefined
        const targetColumn = (over.data.current?.column as string) || overId
        const overType = over.data.current?.type

        // Reorder columns
        if (!activeType) {
            const oldIndex = columns.findIndex((c) => c.id === activeId)
            const newIndex = columns.findIndex((c) => c.id === overId)
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setColumns((cols) => arrayMove(cols, oldIndex, newIndex))
            }
            setActiveItem(null)
            return
        }

        // Reorder items or move between columns
        if (activeType === 'item' && sourceColumn) {
            setItems((prev) => {
                const sourceItems = Array.from(prev[sourceColumn])
                const activeIndex = sourceItems.findIndex((i) => i.id === activeId)
                if (activeIndex === -1) return prev

                const newState = { ...prev }

                if (sourceColumn === targetColumn) {
                    const overIndex = sourceItems.findIndex((i) => i.id === overId)
                    if (overIndex !== -1 && activeIndex !== overIndex) {
                        newState[sourceColumn] = arrayMove(sourceItems, activeIndex, overIndex)
                    }
                } else {
                    const targetItems = Array.from(prev[targetColumn] || [])
                    const overIndex =
                        overType === 'item'
                            ? targetItems.findIndex((i) => i.id === overId)
                            : targetItems.length
                    const [moved] = sourceItems.splice(activeIndex, 1)
                    targetItems.splice(overIndex, 0, moved)
                    newState[sourceColumn] = sourceItems
                    newState[targetColumn] = targetItems
                }

                return newState
            })
        }

        // Reorder items in the pool
        if (activeType === 'poolItem' && targetColumn === 'POOL') {
            const oldIndex = poolItems.findIndex((i) => i.id === activeId)
            const newIndex = poolItems.findIndex((i) => i.id === overId)
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setPoolItems((items) => arrayMove(items, oldIndex, newIndex))
            }
        }

        setActiveItem(null)
    }

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
                <DragOverlay>
                    {activeItem ? (
                        <div
                            style={{
                                padding: '10px 12px',
                                background: '#ffffff',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            }}
                            className="text-sm"
                        >
                            {activeItem.name}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </BoardContext.Provider>
    )
}