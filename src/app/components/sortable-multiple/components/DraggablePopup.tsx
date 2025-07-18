'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface DraggablePopupProps {
    children: React.ReactNode
    initialPosition: { x: number; y: number }
    onClose: () => void
}

export function DraggablePopup({ children, initialPosition, onClose }: DraggablePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [position, setPosition] = useState(initialPosition)
    const [dragging, setDragging] = useState(false)
    const dragOffset = useRef({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            if (dragging) {
                setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
            }
        }

        function handleMouseUp() {
            setDragging(false)
        }

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging])

    const startDrag = (e: React.MouseEvent) => {
        if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect()
            dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            setDragging(true)
        }
    }

    if (!mounted || typeof document === 'undefined') {
        return null
    }

    return createPortal(
        <div
            ref={popupRef}
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                zIndex: 9999,
                width: 250,
                height: 150,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    padding: '8px',
                    background: '#f5f5f5',
                    cursor: 'move',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    userSelect: 'none',
                }}
                onMouseDown={startDrag}
            >
                <span className="text-sm font-semibold">Arraste aqui</span>
                <button
                    onClick={onClose}
                    style={{
                        float: 'right',
                        fontSize: 12,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                    }}
                >
                    ✕
                </button>
            </div>
            <div style={{ padding: '10px', flex: 1, overflow: 'auto' }}>
                {children}
            </div>
        </div>,
        document.body,
    )
}
