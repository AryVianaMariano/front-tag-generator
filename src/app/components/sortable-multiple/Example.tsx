'use client'

import React from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

import { Column } from './Column'
import { Item } from './Item'

const defaultStyles: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'row',
    gap: 20,
}

export interface ExampleProps {
    style?: React.CSSProperties
}

export function Example({ style = defaultStyles }: ExampleProps) {
    const [items, setItems] = React.useState<Record<string, string[]>>({
        A: ['A0', 'A1', 'A2'],
        B: ['B0', 'B1'],
        C: [],
    })

    return (
        <DragDropProvider
            onDragOver={(event) => {
                setItems((current) => move(current, event))
            }}
        >
            <div style={style}>
                {Object.entries(items).map(([column, columnItems]) => (
                    <Column key={column} id={column}>
                        {columnItems.map((id, index) => (
                            <Item key={id} id={id} index={index} column={column} />
                        ))}
                    </Column>
                ))}
            </div>
        </DragDropProvider>
    )
}