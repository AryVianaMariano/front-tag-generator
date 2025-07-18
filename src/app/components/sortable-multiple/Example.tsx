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
import { AppRightSidebar } from '../AppRightSidebar'

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

        let sourceCol: string | undefined

        sourceCol = Object.keys(items).find((colId) =>
            items[colId].some((i) => i.id === activeId)
        )


        const targetCol = over?.data?.current?.column || overId

        if (!sourceCol || !targetCol || sourceCol === targetCol) return

        const draggedItem =

            items[sourceCol].find((i) => i.id === activeId)
        if (!draggedItem) return


        setItems((prev) => ({
            ...prev,
            [sourceCol!]: prev[sourceCol!].filter((i) => i.id !== activeId),
        }))



        setItems((prev) => ({
            ...prev,
            [targetCol]: [...(prev[targetCol] || []), draggedItem],
        }))

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

    const handleColumnSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!columnName.trim()) return
        addColumn(columnName.trim())
        setColumnName('')
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
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

                <div className="flex-1 overflow-auto">
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

                        <AppRightSidebar />
                    </DndContext>
                </div>
            </div>
        </div>
    )
}