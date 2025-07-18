'use client'

import React from 'react'
import {
    DndContext,
    closestCenter,
    DragOverEvent,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Column } from './Column'
import { Item, ItemData } from './Item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'

const defaultStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start', // <-- importante para altura independente
    gap: 20,
    overflowX: 'auto',
}


export interface ExampleProps {
    style?: React.CSSProperties
}

export function Example({ style = defaultStyles }: ExampleProps) {
    const [columns, setColumns] = React.useState<{
        id: string
        name: string
        width?: number
    }[]>([
        { id: 'A', name: 'Column A', width: 220 },
        { id: 'B', name: 'Column B', width: 250 },
        { id: 'C', name: 'Column C', width: 180 },
    ])

    const [items, setItems] = React.useState<Record<string, ItemData[]>>({
        library: [],
        A: [
            { id: 'A0', name: 'A0' },
            { id: 'A1', name: 'A1' },
            { id: 'A2', name: 'A2' },
        ],
        B: [
            { id: 'B0', name: 'B0' },
            { id: 'B1', name: 'B1' },
        ],
        C: [],
    })

    const [columnName, setColumnName] = React.useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )

    const addColumn = (name: string) => {
        const id = uuidv4()
        setColumns((cols) => [...cols, { id, name, width: 200 }])
        setItems((it) => ({ ...it, [id]: [] }))
    }

    const addLibraryItem = (name: string) => {
        setItems((current) => ({
            ...current,
            library: [...(current['library'] || []), { id: uuidv4(), name }],
        }))
    }

    const handleColumnSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!columnName.trim()) return
        addColumn(columnName.trim())
        setColumnName('')
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!active || !over) return

        const activeId = active.id
        const overId = over.id

        const sourceCol = Object.keys(items).find((colId) =>
            items[colId].some((i) => i.id === activeId)
        )
        const targetCol = over?.data?.current?.column || overId

        if (!sourceCol || !targetCol || sourceCol === targetCol) return

        const draggedItem = items[sourceCol].find((i) => i.id === activeId)
        if (!draggedItem) return

        setItems((prev) => {
            const sourceItems = prev[sourceCol].filter((i) => i.id !== activeId)
            const targetItems = [...prev[targetCol], draggedItem]
            return {
                ...prev,
                [sourceCol]: sourceItems,
                [targetCol]: targetItems,
            }
        })
    }

    const handleDragEnd = (_event: DragEndEvent) => {
        // já tratamos tudo no onDragOver
    }

    return (
        <>
            <form
                onSubmit={handleColumnSubmit}
                style={{ display: 'flex', gap: 4, marginBottom: 20 }}
            >
                <Input
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="New column name"
                    style={{ flex: 1 }}
                />
                <Button type="submit">Add Column</Button>
            </form>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div style={style}>
                    {columns.map((column) => (
                        <Column
                            key={column.id}
                            id={column.id}
                            name={column.name}
                            width={column.width} // <-- passa a largura aqui
                        >
                            <SortableContext
                                items={items[column.id].map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items[column.id].map((item, index) => (
                                    <Item
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        column={column.id}
                                    />
                                ))}
                            </SortableContext>
                        </Column>
                    ))}

                </div>

                <div style={{ marginTop: 40 }}>
                    <Column id="library" name="Library" onAddItem={addLibraryItem}>
                        <SortableContext
                            items={items['library'].map((i) => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items['library'].map((item, index) => (
                                <Item
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    column="library"
                                />
                            ))}
                        </SortableContext>
                    </Column>
                </div>
            </DndContext>
        </>
    )
}
