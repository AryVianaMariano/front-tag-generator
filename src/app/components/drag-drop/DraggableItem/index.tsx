'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableItemProps {
    id: string
    name: string
    onDelete: (id: string) => void
}

export function DraggableItem({ id, name, onDelete }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-gray-200 rounded-md p-2 flex items-center justify-between text-sm cursor-move"
        >
            <span>{name}</span>
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onDelete(id)}
                className="text-red-500 text-xs"
            >
                Delete
            </button>
        </div>
    )
}