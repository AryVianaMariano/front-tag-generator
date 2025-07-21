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
    const [activeContainer, setActiveContainer] = useState<string | null>(null)

    const getContainer = (id: string): string | null => {
        if (poolItems.some((i) => i.id === id)) return 'POOL'
        for (const key of Object.keys(items)) {
            if (items[key].some((i) => i.id === id)) return key
        }
        return null
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor),
    )
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
        setActiveContainer(getContainer(activeId))
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
        const targetColumn = (over.data.current?.column as string) || String(over.id)

        if (!targetColumn) return

        if (activeContainer && activeContainer !== targetColumn) {
            const currentContainer = activeContainer
            const item =
                currentContainer === 'POOL'
                    ? poolItems.find((i) => i.id === activeId)
                    : items[currentContainer]?.find((i) => i.id === activeId)
            if (!item) return

            if (currentContainer === 'POOL') {
                setPoolItems((prev) => prev.filter((i) => i.id !== activeId))
            } else {
                setItems((prev) => ({
                    ...prev,
                    [currentContainer]: prev[currentContainer].filter((i) => i.id !== activeId),
                }))
            }

            if (targetColumn === 'POOL') {
                setPoolItems((prev) => [...prev, item])
            } else {
                setItems((prev) => ({
                    ...prev,
                    [targetColumn]: [...(prev[targetColumn] || []), item],
                }))
            }

            setActiveContainer(targetColumn)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!active || !over) {
            setActiveItem(null)
            setActiveContainer(null)
            return
        }

        const activeId = String(active.id)
        const overId = String(over.id)
        const activeType = active.data.current?.type
        const targetColumn = (over.data.current?.column as string) || overId

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
        if (activeType === 'item' && activeContainer) {
            if (activeContainer === targetColumn) {
                setItems((prev) => {
                    const sourceItems = Array.from(prev[targetColumn])
                    const activeIndex = sourceItems.findIndex((i) => i.id === activeId)
                    const overIndex = sourceItems.findIndex((i) => i.id === overId)
                    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
                        return prev
                    }
                    return {
                        ...prev,
                        [targetColumn]: arrayMove(sourceItems, activeIndex, overIndex),
                    }
                })
            }
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
        setActiveContainer(null)
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