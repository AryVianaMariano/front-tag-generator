'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ItemData } from './Item'

export function PoolItem({ item }: { item: ItemData }) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: item.id,
        data: { type: 'poolItem' },
    })

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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="text-sm">
            {item.name}
        </div>
    )
}