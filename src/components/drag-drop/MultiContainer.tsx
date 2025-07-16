'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
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
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainerOf = (itemId: string): keyof typeof containers | null => {
        return (
            (Object.entries(containers).find(([, items]) =>
                items.includes(itemId)
            )?.[0] as keyof typeof containers) ?? null
        );
    };

    const handleDragStart = () => {
        // Intentionally left blank but reserved for future use
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;

        const activeContainer = findContainerOf(String(active.id));
        let overContainer = findContainerOf(String(over.id));

        if (!overContainer && over.id in containers) {
            overContainer = over.id as keyof typeof containers;
        }

        if (!activeContainer || !overContainer) return;

        if (activeContainer !== overContainer) {
            setContainers((prev) => {
                const activeItems = prev[activeContainer];
                const overItems = prev[overContainer];

                const overIndex = overItems.indexOf(String(over.id));

                const newIndex = overIndex >= 0 ? overIndex : overItems.length;

                return {
                    ...prev,
                    [activeContainer]: activeItems.filter((i) => i !== active.id),
                    [overContainer]: [
                        ...overItems.slice(0, newIndex),
                        String(active.id),
                        ...overItems.slice(newIndex),
                    ],
                };
            });
        }
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        const activeContainer = findContainerOf(String(active.id));
        const overContainer = over ? findContainerOf(String(over.id)) : null;

        if (!activeContainer) {
            return;
        }

        if (over && activeContainer === overContainer) {
            const activeIndex = containers[activeContainer].indexOf(String(active.id));
            const overIndex = containers[overContainer!].indexOf(String(over.id));
            if (activeIndex !== overIndex) {
                setContainers((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }

        // drag operation ended
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-8">
                {Object.entries(containers).map(([containerId, items]) => (
                    <div key={containerId} className="flex flex-col gap-2 w-60">
                        <h2 className="text-lg font-bold text-center mb-2">{containerId}</h2>
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            <div className="min-h-[150px] p-4 bg-gray-100 border rounded-md space-y-2">
                                {items.map((id) => (
                                    <SortableItem key={id} id={id} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                ))}
            </div>
        </DndContext>
    );
}