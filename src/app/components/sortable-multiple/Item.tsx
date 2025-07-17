import React from 'react'
import { useSortable } from '@dnd-kit/react/sortable'

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
    const { ref } = useSortable({
        id: item.id,
        index,
        group: column,
        type: 'item',
        accept: ['item'],
    })

    return <button ref={ref}>{item.name}</button>
}