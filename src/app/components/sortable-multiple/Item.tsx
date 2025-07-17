import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface ItemData {
    id: string
    name: string
}

export interface ItemProps {
    item: ItemData
    column: string
    index: number
}

export function Item({ item, column, index }: ItemProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: item.id,
        data: { column, type: 'item' },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px',
        marginBottom: '6px',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '6px',
        cursor: 'grab',
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {index + 1}. {item.name}
        </div>
    )
}
