'use client'

import React, { useState } from 'react'
import {
    SortableTree,
    SimpleTreeItemWrapper,
    type TreeItems,
    type TreeItemComponentProps,
} from 'dnd-kit-sortable-tree'

interface NodeData {
    value: string
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemComponentProps<NodeData>>(function TreeItem(props, ref) {
    return (
        <SimpleTreeItemWrapper {...props} ref={ref}>
            <div>{props.item.value}</div>
        </SimpleTreeItemWrapper>
    )
})

const initialData: TreeItems<NodeData> = [
    {
        id: '1',
        value: 'Parent',
        children: [
            { id: '2', value: 'Child A' },
            { id: '3', value: 'Child B' },
        ],
    },
    { id: '4', value: 'Second Parent' },
]

export default function Page() {
    const [items, setItems] = useState(initialData)

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-8">
            <h1 className="text-3xl font-bold">Sortable Tree</h1>
            <SortableTree items={items} onItemsChanged={setItems} TreeItemComponent={TreeItem} />
        </main>
    )
}