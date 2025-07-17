'use client'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useRef, useState } from 'react'
import { Droppable } from '../components/Droppable'
import { Draggable } from '../components/Draggable'

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
                    <Draggable
                        id="draggable"
                        className="bg-emerald-500 text-white px-4 py-2 rounded cursor-move select-none"
                        initialPosition={position}
                        style={{ position: 'absolute' }}
                    >
                        Arraste-me
                    </Draggable>
                )}
                <div className="mt-4" ref={dropZoneRef}>
                    <Droppable id="dropzone" className="min-h-[150px] w-full border rounded-md p-4">
                        {attached && (
                            <Draggable
                                id="draggable"
                                className="bg-emerald-500 text-white px-4 py-2 rounded cursor-move select-none"
                                initialPosition={{ x: 0, y: 0 }}
                                style={{ position: 'relative' }}
                            >
                                Arraste-me
                            </Draggable>
                        )}
                        Solte aqui
                    </Droppable>
                </div>
            </div>
        </DndContext>
    )
}