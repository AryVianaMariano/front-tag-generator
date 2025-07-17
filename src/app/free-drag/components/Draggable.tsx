'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

interface DraggableProps {
    id: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    initialPosition?: { x: number; y: number }
}

export function Draggable({ id, children, className, style: styleProp, initialPosition }: DraggableProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString({
            x: (transform?.x || 0) + (initialPosition?.x || 0),
            y: (transform?.y || 0) + (initialPosition?.y || 0),
            scaleX: 1,
            scaleY: 1,
        }),
        ...styleProp,
    }

    return (
        <div ref={setNodeRef} style={style} className={className} {...listeners} {...attributes}>
            {children}
        </div>
    )
}