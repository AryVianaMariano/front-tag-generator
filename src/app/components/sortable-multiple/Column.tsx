import React from 'react'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 20,
    minWidth: 200,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
}

export interface ColumnProps {
    id: string
    name: string
    children?: React.ReactNode
    onAddItem?: (name: string) => void
}

export function Column({ children, id, name, onAddItem }: ColumnProps) {
    const { ref } = useDroppable({
        id,
        type: 'column',
        accept: ['item'],
        collisionPriority: CollisionPriority.Low,
    })

    const [itemName, setItemName] = React.useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!itemName.trim() || !onAddItem) return
        onAddItem(itemName.trim())
        setItemName('')
    }

    return (
        <div style={styles} ref={ref}>
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