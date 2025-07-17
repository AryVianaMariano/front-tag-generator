'use client'

import { useDroppable, UseDroppableArguments } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { DraggableItem } from '../DraggableItem'
import type { Container } from './types'

interface Props {
    container: Container
    onDeleteContainer: (id: string) => void
    onDeleteItem: (id: string) => void
}

export function SortableContainer({ container, onDeleteContainer, onDeleteItem }: Props) {
    const { setNodeRef: setDroppableRef } = useDroppable({ id: container.id } as UseDroppableArguments)
    const {
        attributes,
        listeners,
        setNodeRef: setSortableRef,
        transform,
        transition,
    } = useSortable({ id: container.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const setRefs = (node: HTMLElement | null) => {
        setDroppableRef(node)
        setSortableRef(node)
    }

    return (
        <div
            ref={setRefs}
            style={style}
            {...attributes}
            {...listeners}
            className="space-y-2 w-60 min-h-[150px] border rounded-md p-4 bg-white cursor-move"
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">{container.name}</h2>
                <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => onDeleteContainer(container.id)}
                >
                    Delete
                </Button>
            </div>
            <SortableContext items={container.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {container.items.map((item) => (
                    <DraggableItem key={item.id} id={item.id} name={item.name} onDelete={onDeleteItem} />
                ))}
            </SortableContext>
        </div>
    )
}