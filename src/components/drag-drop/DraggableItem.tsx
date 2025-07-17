'use client'

interface DraggableItemProps {
    id: string
    name: string
    onDelete: (id: string) => void
}

export function DraggableItem({ id, name, onDelete }: DraggableItemProps) {
    return (
        <div className="bg-gray-200 rounded-md p-2 flex items-center justify-between text-sm">
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