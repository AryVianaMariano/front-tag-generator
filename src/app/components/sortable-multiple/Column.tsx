'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GripHorizontal, MoreVertical } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Label } from '@radix-ui/react-label'
import { Separator } from "@/components/ui/separator"

export const COLUMN_WIDTH = 240

export interface ColumnProps {
    id: string
    name: string
    width?: number
    children?: React.ReactNode
    onAddItem?: (name: string) => void
}

export function Column({ id, name, width = COLUMN_WIDTH, children, onAddItem }: ColumnProps) {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })

    const [itemName, setItemName] = React.useState('')

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        width,
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: '70vh',
    }


    return (
        <div ref={setNodeRef} style={style}>
            {/* Cabeçalho */}
            <div className="flex items-center justify-between shrink-0">
                <h2 className="font-semibold text-sm">{name}</h2>

                <div className="flex items-center gap-1">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-muted-foreground"
                        tabIndex={-1}
                    >
                        <GripHorizontal className="w-4 h-4" />
                    </button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                tabIndex={-1}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48 text-sm">
                            <Label className='font-semibold' htmlFor="processPrefix">Prefixo</Label>
                            <Input id='processPrefix' type="text" placeholder="Digite aqui..." />
                            <div className='flex justify-end'>
                                <Button className='mt-2' type="submit" variant="outline">
                                    Salvar
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <Separator />
            {/* Conteúdo expansível */}

            <div style={{ flex: 1 }}>
                {children}
            </div>


            {/* Formulário de adicionar item */}
            {onAddItem && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!itemName.trim()) return
                        onAddItem(itemName.trim())
                        setItemName('')
                    }}
                    className="flex gap-2 pt-2 shrink-0"
                >
                    <Input
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Novo item"
                        className="flex-1"
                    />
                    <Button type="submit">+</Button>
                </form>
            )}
        </div>
    )
}
