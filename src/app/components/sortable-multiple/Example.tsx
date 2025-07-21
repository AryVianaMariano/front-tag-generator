'use client'

import React from 'react'
import {
    SortableContext,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Column, COLUMN_WIDTH } from './Column'
import { Item } from './Item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBoard } from './BoardContext'

const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(5, ${COLUMN_WIDTH}px)`,
    alignItems: 'start',
    gap: 20,
    padding: 20,
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    border: '1px solid #ccc',
    overflowX: 'auto',
    overflowY: 'auto',
    height: '100%',
}

export function Example() {
    const { columns, items, addColumn } = useBoard()
    const [columnName, setColumnName] = React.useState('')

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
                    <SortableContext
                        items={columns.map((col) => col.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div style={boardStyle}>
                            {columns.map((column) => (
                                <div
                                    style={{ height: '100%', display: 'flex' }}
                                    key={column.id}
                                >
<Column
                                        id={column.id}
                                        name={column.name}
                                        items={items[column.id]?.map((i) => i.id) || []}
                                    >                                        <SortableContext
                                            items={
                                                items[column.id]?.map((i) => i.id) || []
                                            }
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
                </div>
            </div>
        </div>
    )
}