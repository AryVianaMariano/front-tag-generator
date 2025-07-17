import React from 'react'
import { useSortable } from '@dnd-kit/react/sortable'

export interface ItemProps {
    id: string
    column: string
    index: number
}

export function Item({ id, column, index }: ItemProps) {
    const { ref } = useSortable({
        id,
        index,
        group: column,
        type: 'item',
        accept: ['item'],
    })

    return <button ref={ref}>{id}</button>
}