import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { MoreVertical, GripVertical } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
            data: { column, type: "item" },
        })

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("option1")

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "8px",
        marginBottom: "6px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "default",
        userSelect: "none" as const,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between gap-2"
        >
            <div className="flex items-center gap-2">
                {/* Drag Handle apenas aqui */}
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 cursor-grab"
                    tabIndex={-1}
                >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                </button>

                <span>
                    {index + 1}. {item.name}
                </span>
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="size-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                    <RadioGroup value={value} onValueChange={setValue}>
                        {["option1", "option2", "option3"].map((opt) => (
                            <div key={opt} className="flex items-center space-x-2">
                                <RadioGroupItem value={opt} id={`${item.id}-${opt}`} />
                                <label
                                    htmlFor={`${item.id}-${opt}`}
                                    className="text-sm capitalize"
                                >
                                    {opt.replace("option", "Option ")}
                                </label>
                            </div>
                        ))}
                    </RadioGroup>
                </PopoverContent>
            </Popover>
        </div>
    )
}
