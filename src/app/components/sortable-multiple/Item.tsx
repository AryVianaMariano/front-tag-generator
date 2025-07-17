import React from 'react'
import { useSortable } from '@dnd-kit/sortable'

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
    const { setNodeRef, attributes, listeners } = useSortable({
        id: item.id,
        data: { column },
    })

    return (
        <button ref={setNodeRef} {...attributes} {...listeners}>
            {item.name}
        </button>
    )
}
