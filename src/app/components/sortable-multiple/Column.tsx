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


export function Column({ children, id, name, onAddItem, width }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id })

    const [itemName, setItemName] = React.useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!itemName.trim() || !onAddItem) return
        onAddItem(itemName.trim())
        setItemName('')
    }

    const styles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 20,
        minWidth: width || 200,
        width: width,
        height: 'auto', // <-- garante altura independente
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        boxSizing: 'border-box',
    }


    return (
        <div style={styles} ref={setNodeRef}>
            <h2>{name}</h2>
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
