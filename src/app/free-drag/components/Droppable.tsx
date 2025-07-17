'use client'

import { useDroppable } from '@dnd-kit/core'
import React from 'react'

interface DroppableProps {
    id: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export function Droppable({ id, children, className, style: styleProp }: DroppableProps) {
    const { isOver, setNodeRef } = useDroppable({ id })

    const style: React.CSSProperties = {
        backgroundColor: isOver ? 'rgba(0, 0, 0, 0.05)' : undefined,
        ...styleProp,
    }

    return (
        <div ref={setNodeRef} className={className} style={style}>
            {children}
        </div>
    )
}