import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 20,
    minWidth: 200,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
}

export interface ColumnProps {
    id: string
    name: string
    width?: number // <-- adiciona isso
    children?: React.ReactNode
    onAddItem?: (name: string) => void
}


export interface ColumnProps {
    id: string
    name: string
    width?: number
    children?: React.ReactNode
    onAddItem?: (name: string) => void
    style?: React.CSSProperties
}

export function Column({ children, id, name, onAddItem, width, style = {} }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id })

    const [itemName, setItemName] = React.useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!itemName.trim() || !onAddItem) return
        onAddItem(itemName.trim())
        setItemName('')
    }

    const defaultStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 20,
        width: width || 200,
        minWidth: width || 200,
        height: 'auto',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
    }

    return (
        <div style={{ ...defaultStyles, ...style }} ref={setNodeRef}>
            <h2 className="font-semibold text-gray-700 mb-2">{name}</h2>
            {children}
            {onAddItem && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 4 }}>
                    <Input
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="New item"
                        style={{ flex: 1 }}
                    />
                    <Button type="submit">Add</Button>
                </form>
            )}
        </div>
    )
}
