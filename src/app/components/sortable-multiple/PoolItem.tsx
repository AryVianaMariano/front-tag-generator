'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ItemData } from './Item'
import { useBoard } from './BoardContext'

export function PoolItem({ item }: { item: ItemData }) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: item.id,
        data: { type: 'poolItem', column: 'POOL' }, // <-- FIX: Adicionado column
    })

    const { selectedItem, selectItem, selectColumn } = useBoard()

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px 12px',
        marginBottom: '8px',
        background: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'grab',
        userSelect: 'none',
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={() => {
                selectItem(item.id)
                selectColumn(null)
            }}
            style={{
                ...style,
                outline: selectedItem === item.id ? '2px solid #3b82f6' : undefined,
            }}
            className="text-sm"
        >
            {item.name}
        </div>
    )
}