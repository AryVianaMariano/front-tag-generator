'use client'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useRef, useState } from 'react'
import { DraggableBox } from '../DraggableBox'
import { DropZone } from '../DropZone'


export function FreeDragExample() {
    const sensors = useSensors(useSensor(PointerSensor))
    const containerRef = useRef<HTMLDivElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)
    const startPosRef = useRef({ x: 0, y: 0 })
    const [attached, setAttached] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const getDropZoneOffset = () => {
        const containerRect = containerRef.current?.getBoundingClientRect()
        const dropRect = dropZoneRef.current?.getBoundingClientRect()
        if (containerRect && dropRect) {
            return {
                x: dropRect.left - containerRect.left,
                y: dropRect.top - containerRect.top,
            }
        }
        return { x: 0, y: 0 }
    }

    const handleDragStart = () => {
        if (attached) {
            startPosRef.current = getDropZoneOffset()
        } else {
            startPosRef.current = position
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, delta } = event
        if (over && over.id === 'dropzone') {
            setAttached(true)
            setPosition({ x: 0, y: 0 })
        } else {
            const start = attached ? startPosRef.current : position
            setAttached(false)
            setPosition({ x: start.x + delta.x, y: start.y + delta.y })
        }
    }

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div ref={containerRef} className="relative min-h-[300px] border p-4">
                {!attached && (
                    <DraggableBox id="draggable" attached={false} position={position} />
                )}
                <div className="mt-4" ref={dropZoneRef}>
                    <DropZone id="dropzone">
                        {attached && (
                            <DraggableBox id="draggable" attached={true} position={{ x: 0, y: 0 }} />
                        )}
                        Solte aqui
                    </DropZone>
                </div>
            </div>
        </DndContext>
    )
}