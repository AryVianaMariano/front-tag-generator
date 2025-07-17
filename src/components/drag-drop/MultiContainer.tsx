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
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MiniContainer } from './MiniContainer';

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
    const [containers, setContainers] = useState<Record<string, string[]>>({});
    const [containerOrder, setContainerOrder] = useState<string[]>([]);
    const nextContainerIndex = useRef(1);
    const [newContainerName, setNewContainerName] = useState('');
    const [miniContainers, setMiniContainers] = useState<Record<string, string[]>>({});
    const [miniContainerInputs, setMiniContainerInputs] = useState<Record<string, string>>({});
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        async function loadData() {
            const res = await fetch('/api/containers');
            if (res.ok) {
                const data = await res.json();
                setContainers(data.containers || {});
                setMiniContainers(data.miniContainers || {});
                setContainerOrder(data.containerOrder || Object.keys(data.containers || {}));
                nextContainerIndex.current = (data.containerOrder ? data.containerOrder.length : Object.keys(data.containers || {}).length) + 1;
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        const data = { containers, miniContainers, containerOrder };
        fetch('/api/containers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    }, [containers, miniContainers, containerOrder]);

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
        const baseName = newContainerName.trim() || `processo${nextContainerIndex.current}`;
        const newId = baseName;
        nextContainerIndex.current += 1;
        setContainers((prev) => ({
            ...prev,
            [newId]: [],
        }));
        setContainerOrder((prev) => [...prev, newId]);
        setNewContainerName('');
    };

    const handleDeleteContainer = (id: string) => {
        setContainerOrder((prevOrder) => {
            const newOrder = prevOrder.filter((c) => c !== id);

            // Após atualizar a ordem, atualize containers e miniContainers em seguida
            setContainers((prevContainers) => {
                const updated = { ...prevContainers };
                delete updated[id];
                return updated;
            });

            setMiniContainers((prevMini) => {
                const updated = { ...prevMini };
                delete updated[id];
                return updated;
            });

            setMiniContainerInputs((prevInputs) => {
                const updated = { ...prevInputs };
                delete updated[id];
                return updated;
            });

            return newOrder;
        });
    };

    const handleAddMiniContainer = (containerId: string) => {
        const name = (miniContainerInputs[containerId] || '').trim();
        if (!name) return;
        setMiniContainers((prev) => ({
            ...prev,
            [containerId]: [...(prev[containerId] || []), name],
        }));
        setMiniContainerInputs((prev) => ({ ...prev, [containerId]: '' }));
    };

    const handleDeleteMiniContainer = (containerId: string, id: string) => {
        setMiniContainers((prev) => ({
            ...prev,
            [containerId]: (prev[containerId] || []).filter((m) => m !== id),
        }));
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
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold">{containerId}</h2>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    type="button"
                                    onClick={() => handleDeleteContainer(containerId)}
                                >
                                    Delete
                                </Button>
                            </div>
                            <SortableContext items={containers[containerId]} strategy={verticalListSortingStrategy}>
                                <div className="min-h-[150px] p-4 bg-gray-100 border rounded-md space-y-2">
                                    {containers[containerId].map((id) => (
                                        <SortableItem key={id} id={id} />
                                    ))}
                                </div>
                            </SortableContext>
                            <div className="space-y-2 mt-2">
                                {miniContainers[containerId]?.map((mini) => (
                                    <MiniContainer
                                        key={mini}
                                        id={mini}
                                        name={mini}
                                        onDelete={(id) => handleDeleteMiniContainer(containerId, id)}
                                    />
                                ))}
                                <div className="flex gap-2">
                                    <Input
                                        value={miniContainerInputs[containerId] || ''}
                                        onChange={(e) =>
                                            setMiniContainerInputs((prev) => ({
                                                ...prev,
                                                [containerId]: e.target.value,
                                            }))
                                        }
                                        placeholder="Nome do mini container"
                                    />
                                    <Button size="sm" type="button" onClick={() => handleAddMiniContainer(containerId)}>
                                        Adicionar mini
                                    </Button>
                                </div>
                            </div>
                        </SortableContainer>
                    ))}
                </div>
            </SortableContext>
            <div className="mt-4 flex gap-2">
                <Input
                    value={newContainerName}
                    onChange={(e) => setNewContainerName(e.target.value)}
                    placeholder="Nome do processo"
                />
                <Button type="button" onClick={handleAddContainer}>
                    Adicionar Processo
                </Button>
            </div>
        </DndContext>
    );
}