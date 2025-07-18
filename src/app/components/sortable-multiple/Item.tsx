'use client'

import React, { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { MoreVertical, GripVertical } from 'lucide-react'
import { DraggablePopup } from './components/DraggablePopup'

export interface ItemData {
    id: string
    name: string
}

export interface ItemProps {
    item: ItemData
    column: string
    index: number
}

export function Item({ item, column, index }: ItemProps) {
    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({
            id: item.id,
            data: { column, type: 'item' },
        })

    const [popupOpen, setPopupOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 })

    const openPopup = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setInitialPos({
                x: rect.left + window.scrollX,
                y: rect.bottom + window.scrollY,
            })
        }
        setPopupOpen(true)
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px 12px',
        marginBottom: '8px',
        background: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        cursor: 'default',
        userSelect: 'none' as const,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between gap-2 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-2">
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 cursor-grab text-muted-foreground"
                    tabIndex={-1}
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                <span className="text-sm font-medium">{index + 1}. {item.name}</span>
            </div>

            <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                tabIndex={-1}
                onClick={openPopup}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <MoreVertical className="size-4" />
            </Button>

            {popupOpen && (
                <DraggablePopup
                    initialPosition={initialPos}
                    onClose={() => setPopupOpen(false)}
                >
                    <div className="text-sm">Popup para {item.name}</div>
                </DraggablePopup>
            )}
        </div>
    )
}