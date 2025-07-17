import React from 'react'
import { useSortable } from '@dnd-kit/sortable'

export interface ItemData {
    id: string
    name: string
}

export interface ItemProps {
    item: ItemData
    column: string
}

export function Item({ item, column }: ItemProps) {
    const { setNodeRef, attributes, listeners } = useSortable({
        id: item.id,
        data: { column, type: 'item' },
    })

    return (
        <button ref={setNodeRef} {...attributes} {...listeners}>
            {item.name}
        </button>
    )
}