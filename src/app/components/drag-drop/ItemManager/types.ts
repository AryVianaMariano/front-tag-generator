export interface Item {
    id: string
    name: string
}

export interface Container {
    id: string
    name: string
    items: Item[]
}