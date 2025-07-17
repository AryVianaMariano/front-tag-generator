'use client'

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DraggableItem } from '../DraggableItem'

interface Container {
    id: string
    name: string
    items: Item[]
}

interface Item {
    id: string
    name: string
}

function DroppableZone({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
    const { setNodeRef } = useDroppable({ id })
    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    )
}

export function ItemManager() {
    const [containers, setContainers] = useState<Container[]>([])
    const [availableItems, setAvailableItems] = useState<Item[]>([])
    const [newItemName, setNewItemName] = useState('')
    const [newContainerName, setNewContainerName] = useState('')

    const sensors = useSensors(useSensor(PointerSensor))

    const findContainerOf = (id: string): string | 'available' | null => {
        if (availableItems.some((i) => i.id === id)) return 'available'
        const container = containers.find((c) => c.items.some((i) => i.id === id))
        return container ? container.id : null
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) return
        const origin = findContainerOf(String(active.id))
        const destination = String(over.id)
        if (!origin) return
        if (origin === destination) return

        if (origin === 'available') {
            const item = availableItems.find((i) => i.id === active.id)
            if (!item) return
            setAvailableItems((prev) => prev.filter((i) => i.id !== item.id))
            setContainers((prev) =>
                prev.map((c) => (c.id === destination ? { ...c, items: [...c.items, item] } : c))
            )
            return
        }

        // origin is a container
        const item = containers
            .find((c) => c.id === origin)?.items.find((i) => i.id === active.id)
        if (!item) return
        if (destination === 'available') {
            setContainers((prev) =>
                prev.map((c) => (c.id === origin ? { ...c, items: c.items.filter((i) => i.id !== item.id) } : c))
            )
            setAvailableItems((prev) => [...prev, item])
        } else {
            setContainers((prev) =>
                prev.map((c) => {
                    if (c.id === origin) return { ...c, items: c.items.filter((i) => i.id !== item.id) }
                    if (c.id === destination) return { ...c, items: [...c.items, item] }
                    return c
                })
            )
        }
    }

    const handleAddItem = () => {
        const name = newItemName.trim()
        if (!name) return
        const newItem: Item = { id: uuidv4(), name }
        setAvailableItems((prev) => [...prev, newItem])
        setNewItemName('')
    }

    const handleAddContainer = () => {
        const name = newContainerName.trim()
        if (!name) return
        const id = name.replace(/\s+/g, '-').toLowerCase()
        let uniqueId = id
        let index = 1
        const existing = containers.map((c) => c.id)
        while (existing.includes(uniqueId)) {
            uniqueId = `${id}-${index}`
            index += 1
        }
        setContainers((prev) => [...prev, { id: uniqueId, name, items: [] }])
        setNewContainerName('')
    }

    const handleDeleteContainer = (id: string) => {
        setContainers((prev) => prev.filter((c) => c.id !== id))
    }

    const handleDeleteItem = (id: string) => {
        if (availableItems.some((i) => i.id === id)) {
            setAvailableItems((prev) => prev.filter((i) => i.id !== id))
        }
        setContainers((prev) =>
            prev.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }))
        )
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddItem()
                        }}
                        placeholder="Nome do item"
                    />
                    <Button type="button" onClick={handleAddItem}>
                        Adicionar Item
                    </Button>
                </div>
                <div className="flex gap-4">
                    <Input
                        value={newContainerName}
                        onChange={(e) => setNewContainerName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddContainer()
                        }}
                        placeholder="Nome do drop"
                    />
                    <Button type="button" onClick={handleAddContainer}>
                        Adicionar Drop
                    </Button>
                </div>
                <div className="flex gap-8 mt-4">
                    <DroppableZone id="available" className="space-y-2 w-60 min-h-[150px] border rounded-md p-4">
                        <SortableContext items={availableItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                            <h2 className="font-bold mb-2">Itens Disponíveis</h2>
                            {availableItems.map((item) => (
                                <DraggableItem key={item.id} id={item.id} name={item.name} onDelete={handleDeleteItem} />
                            ))}
                        </SortableContext>
                    </DroppableZone>
                    {containers.map((container) => (
                        <DroppableZone key={container.id} id={container.id} className="space-y-2 w-60 min-h-[150px] border rounded-md p-4">
                            <SortableContext items={container.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold">{container.name}</h2>
                                    <Button variant="destructive" size="sm" type="button" onClick={() => handleDeleteContainer(container.id)}>
                                        Delete
                                    </Button>
                                </div>
                                {container.items.map((item) => (
                                    <DraggableItem key={item.id} id={item.id} name={item.name} onDelete={handleDeleteItem} />
                                ))}
                            </SortableContext>
                        </DroppableZone>
                    ))}
                </div>
            </div>
        </DndContext>
    )
}