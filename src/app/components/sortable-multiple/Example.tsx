'use client'

import React from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

import { Column } from './Column'
import { Item, ItemData } from './Item'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { v4 as uuidv4 } from 'uuid'

const defaultStyles: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    gap: 20,
}

export interface ExampleProps {
    style?: React.CSSProperties
}

export function Example({ style = defaultStyles }: ExampleProps) {
    const [columns, setColumns] = React.useState<{ id: string; name: string }[]>([
        { id: 'A', name: 'Column A' },
        { id: 'B', name: 'Column B' },
        { id: 'C', name: 'Column C' },
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
        <DragDropProvider
            onDragOver={(event) => {
                setItems((current) => move(current, event))
            }}
        >
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
            <div style={style}>
                {columns.map((column) => (
                    <Column key={column.id} id={column.id} name={column.name}>
                        {items[column.id]?.map((item, index) => (
                            <Item
                                key={item.id}
                                item={item}
                                index={index}
                                column={column.id}
                            />
                        ))}
                    </Column>
                ))}
            </div>
            <div style={{ marginTop: 40 }}>
                <Column id="library" name="Library" onAddItem={addLibraryItem}>
                    {items['library']?.map((item, index) => (
                        <Item
                            key={item.id}
                            item={item}
                            index={index}
                            column="library"
                        />
                    ))}
                </Column>
            </div>
        </DragDropProvider>
    )
}