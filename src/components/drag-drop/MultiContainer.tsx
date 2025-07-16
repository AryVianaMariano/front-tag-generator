'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
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
    horizontalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef } from 'react';

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

// Container visual
function SortableContainer({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex flex-col gap-2 w-60"
        >
            {children}
        </div>
    );
}

export function MultiContainer() {
    const [containers, setContainers] = useState<Record<string, string[]>>({
        processoA: ['Motor', 'Sensor'],
        processoB: ['CLP'],
    });
    const [containerOrder, setContainerOrder] = useState<string[]>([
        'processoA',
        'processoB',
    ]);
    const nextContainerIndex = useRef(3);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainerOf = (itemId: string): string | null => {
        return (
            Object.entries(containers).find(([, items]) =>
                items.includes(itemId)
            )?.[0] ?? null
        );
    };

    const handleDragStart = () => {
        // Intentionally left blank but reserved for future use
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        if (!over) return;
        if (containerOrder.includes(String(active.id))) {
            return;
        }

        const activeContainer = findContainerOf(String(active.id));
        let overContainer = findContainerOf(String(over.id));

        if (!overContainer && over.id in containers) {
            overContainer = String(over.id);
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
        if (over && containerOrder.includes(String(active.id)) && containerOrder.includes(String(over.id))) {
            const oldIndex = containerOrder.indexOf(String(active.id));
            const newIndex = containerOrder.indexOf(String(over.id));
            if (oldIndex !== newIndex) {
                setContainerOrder((prev) => arrayMove(prev, oldIndex, newIndex));
            }
            return;
        }

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

    const handleAddContainer = () => {
        const newId = `processo${nextContainerIndex.current}`;
        nextContainerIndex.current += 1;
        setContainers((prev) => ({
            ...prev,
            [newId]: [],
        }));
        setContainerOrder((prev) => [...prev, newId]);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={containerOrder} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-8">
                    {containerOrder.map((containerId) => (
                        <SortableContainer key={containerId} id={containerId}>
                            <h2 className="text-lg font-bold text-center mb-2">{containerId}</h2>
                            <SortableContext items={containers[containerId]} strategy={verticalListSortingStrategy}>
                                <div className="min-h-[150px] p-4 bg-gray-100 border rounded-md space-y-2">
                                    {containers[containerId].map((id) => (
                                        <SortableItem key={id} id={id} />
                                    ))}
                                </div>
                            </SortableContext>
                        </SortableContainer>
                    ))}
                </div>
            </SortableContext>
            <button
                type="button"
                onClick={handleAddContainer}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
            >
                Adicionar Processo
            </button>
        </DndContext>
    );
}