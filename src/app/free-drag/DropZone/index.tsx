'use client'
import { useDroppable } from '@dnd-kit/core'

interface DropZoneProps {
    id: string
    children: React.ReactNode
}

export function DropZone({ id, children }: DropZoneProps) {
    const { isOver, setNodeRef } = useDroppable({ id })

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[150px] w-full border rounded-md p-4 transition-colors ${isOver ? 'bg-green-100' : 'bg-gray-50'}`}
        >
            {children}
        </div>
    )
}