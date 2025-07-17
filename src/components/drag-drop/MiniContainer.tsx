'use client'

interface MiniContainerProps {
    id: string
    name: string
    onDelete: (id: string) => void
}

export function MiniContainer({ id, name, onDelete }: MiniContainerProps) {
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