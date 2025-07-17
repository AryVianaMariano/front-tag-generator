'use client'
import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface DraggableBoxProps {
    id: string
    attached: boolean
    position: { x: number; y: number }
}

export function DraggableBox({ id, attached, position }: DraggableBoxProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

    const style: React.CSSProperties = {
        position: attached ? 'relative' : 'absolute',
        transform: CSS.Translate.toString({
            x: (transform?.x || 0) + (attached ? 0 : position.x),
            y: (transform?.y || 0) + (attached ? 0 : position.y),
            scaleX: 1,
            scaleY: 1,
        }),
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="bg-emerald-500 text-white px-4 py-2 rounded cursor-move select-none"
            style={style}
        >
            Arraste-me
        </div>
    )
}