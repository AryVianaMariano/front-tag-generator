'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface DraggablePopupProps {
    children: React.ReactNode
    initialPosition: { x: number; y: number }
    onClose: () => void
}

let globalZIndex = 10000

export function DraggablePopup({ children, initialPosition, onClose }: DraggablePopupProps) {
    const popupRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [position, setPosition] = useState(initialPosition)
    const [dragging, setDragging] = useState(false)
    const [zIndex, setZIndex] = useState(globalZIndex++)
    const dragOffset = useRef({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        function handleMove(e: MouseEvent | TouchEvent) {
            if (!dragging) return
            const point = 'touches' in e ? e.touches[0] : e
            setPosition({
                x: point.clientX - dragOffset.current.x,
                y: point.clientY - dragOffset.current.y,
            })
        }

        function handleUp() {
            setDragging(false)
        }

        if (dragging) {
            window.addEventListener('mousemove', handleMove)
            window.addEventListener('touchmove', handleMove)
            window.addEventListener('mouseup', handleUp)
            window.addEventListener('touchend', handleUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('touchmove', handleMove)
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('touchend', handleUp)
        }
    }, [dragging])

    const bringToFront = useCallback(() => {
        const nextZ = ++globalZIndex
        setZIndex(nextZ)
    }, [])

    const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
        bringToFront()
        const point = 'touches' in e ? e.touches[0] : e
        if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect()
            dragOffset.current = { x: point.clientX - rect.left, y: point.clientY - rect.top }
            setDragging(true)
        }
        e.preventDefault()
    }

    if (!mounted || typeof document === 'undefined') {
        return null
    }

    return createPortal(
        <div
            ref={popupRef}
            onMouseDown={bringToFront}
            onTouchStart={bringToFront}
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                zIndex,
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
                onTouchStart={startDrag}
            >
                <span className="text-sm font-semibold">Arraste aqui</span>
                <button
                    onClick={onClose}
                    style={{
                        float: 'right',
                        fontSize: 16,
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