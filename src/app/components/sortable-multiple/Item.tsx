import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: item.id,
        data: { column, type: 'item' },
    })

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState('option1')

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '8px',
        marginBottom: '6px',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '6px',
        cursor: 'grab',
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    {index + 1}. {item.name}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-40">
                <RadioGroup value={value} onValueChange={setValue}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option1" id={`${item.id}-o1`} />
                        <label htmlFor={`${item.id}-o1`} className="text-sm">
                            Option 1
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option2" id={`${item.id}-o2`} />
                        <label htmlFor={`${item.id}-o2`} className="text-sm">
                            Option 2
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option3" id={`${item.id}-o3`} />
                        <label htmlFor={`${item.id}-o3`} className="text-sm">
                            Option 3
                        </label>
                    </div>
                </RadioGroup>
            </PopoverContent>
        </Popover>
    )
}