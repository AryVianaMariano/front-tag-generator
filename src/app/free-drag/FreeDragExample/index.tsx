'use client'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { DraggableBox } from '../DraggableBox'
import { DropZone } from '../DropZone'


export function FreeDragExample() {
    const sensors = useSensors(useSensor(PointerSensor))
    const [attached, setAttached] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, delta } = event
        if (over && over.id === 'dropzone') {
            setAttached(true)
            setPosition({ x: 0, y: 0 })
        } else {
            setAttached(false)
            setPosition((prev) => ({ x: prev.x + delta.x, y: prev.y + delta.y }))
        }
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="relative min-h-[300px] border p-4">
                <DraggableBox id="draggable" attached={attached} position={position} />
                <div className="mt-4">
                    <DropZone id="dropzone">Solte aqui</DropZone>
                </div>
            </div>
        </DndContext>
    )
}