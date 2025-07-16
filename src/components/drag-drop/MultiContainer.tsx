'use client';

import {
    DndContext,
    DragEndEvent,
    closestCenter,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

// Item visual
function SortableItem({ id }: { id: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow cursor-move"
        >
            {id}
        </div>
    );
}

export function MultiContainer() {
    const [containers, setContainers] = useState({
        processoA: ['Motor', 'Sensor'],
        processoB: ['CLP'],
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const sourceContainer = findContainerOf(active.id as string);
        const targetContainer = findContainerOf(over.id as string);

        if (!sourceContainer || !targetContainer) return;

        if (sourceContainer === targetContainer) return;

        setContainers((prev) => {
            const sourceItems = [...prev[sourceContainer]];
            const targetItems = [...prev[targetContainer]];

            const itemIndex = sourceItems.indexOf(active.id as string);
            const [moved] = sourceItems.splice(itemIndex, 1);
            targetItems.push(moved);

            return {
                ...prev,
                [sourceContainer]: sourceItems,
                [targetContainer]: targetItems,
            };
        });
    };

    const findContainerOf = (itemId: string): keyof typeof containers | null => {
        return (
            (Object.entries(containers).find(([, items]) =>
                items.includes(itemId)
            )?.[0] as keyof typeof containers) ?? null
        );
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-8">
                {Object.entries(containers).map(([containerId, items]) => (
                    <div key={containerId} className="flex flex-col gap-2 w-60">
                        <h2 className="text-lg font-bold text-center mb-2">{containerId}</h2>
                        <div className="min-h-[150px] p-4 bg-gray-100 border rounded-md space-y-2">
                            <SortableContext
                                items={items}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((id) => (
                                    <SortableItem key={id} id={id} />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                ))}
            </div>
        </DndContext>
    );
}
