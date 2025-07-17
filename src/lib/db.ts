import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

export interface DataShape {
    containers: Record<string, string[]>
    miniContainers: Record<string, string[]>
    containerOrder: string[]
}

const defaultData: DataShape = {
    containers: {},
    miniContainers: {},
    containerOrder: []
}

export async function readData(): Promise<DataShape> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8')
        return JSON.parse(data) as DataShape
    } catch {
        return { ...defaultData }
    }
}

export async function writeData(data: DataShape) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}