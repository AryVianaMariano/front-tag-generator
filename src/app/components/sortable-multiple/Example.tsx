'use client'

import React from 'react'
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragEndEvent,
    DragOverEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Column, COLUMN_WIDTH } from './Column'
import { Item, ItemData } from './Item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"

const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(5, ${COLUMN_WIDTH}px)`,
    alignItems: 'start',       // deixa colunas com altura própria
    gap: 20,
    padding: 20,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    border: '1px solid #ccc',
    overflowX: 'auto',
    overflowY: 'auto',
    height: '100%',            // cresce com o painel
}

export function Example() {
    const [columns, setColumns] = React.useState([
        { id: 'A', name: 'Column A' },
        { id: 'B', name: 'Column B' },
        { id: 'C', name: 'Column C' },
    ])

    const [items, setItems] = React.useState<Record<string, ItemData[]>>({
        library: [],
        A: [
            { id: 'A0', name: 'A0' },
            { id: 'A1', name: 'A1' },
        ],
        B: [{ id: 'B0', name: 'B0' }],
        C: [],
    })

    const [columnName, setColumnName] = React.useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )

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

    const addColumn = (name: string) => {
        const id = uuidv4()
        setColumns((cols) => [...cols, { id, name }])
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <form
                onSubmit={handleColumnSubmit}
                style={{ display: 'flex', gap: 4, padding: 16 }}
            >
                <Input
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    placeholder="New column name"
                    style={{ flex: 1 }}
                />
                <Button type="submit">Add Column</Button>
            </form>

            <ResizablePanelGroup direction="vertical" className="flex-1">
                <ResizablePanel defaultSize={70} minSize={30} maxSize={90} className="overflow-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={columns.map((col) => col.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div style={boardStyle}>
                                {columns.map((column) => (
                                    <div style={{ height: '100%', display: 'flex' }} key={column.id}>
                                        <Column id={column.id} name={column.name}>
                                            <SortableContext
                                                items={items[column.id]?.map((i) => i.id) || []}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {items[column.id]?.map((item, index) => (
                                                    <Item
                                                        key={item.id}
                                                        item={item}
                                                        index={index}
                                                        column={column.id}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </Column>
                                    </div>
                                ))}

                            </div>
                        </SortableContext>
                    </DndContext>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={30} minSize={10}>
                    <div style={{ padding: 16 }}>
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
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
