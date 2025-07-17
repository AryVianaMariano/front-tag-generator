import { promises as fs } from 'fs'
import path from 'path'

const ITEMS_DB_PATH = path.join(process.cwd(), 'items-db.json')

export interface Item {
    id: string
    name: string
}

export interface ItemData {
    items: Record<string, Item[]>
}

const defaultItemData: ItemData = {
    items: {},
}

export async function readItemData(): Promise<ItemData> {
    try {
        const data = await fs.readFile(ITEMS_DB_PATH, 'utf-8')
        return JSON.parse(data) as ItemData
    } catch {
        return { ...defaultItemData }
    }
}

export async function writeItemData(data: ItemData) {
    await fs.writeFile(ITEMS_DB_PATH, JSON.stringify(data, null, 2))
}