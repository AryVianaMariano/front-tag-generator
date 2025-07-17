import { promises as fs } from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.json')

export interface ContainerData {
    containers: Record<string, string[]>
    containerOrder: string[]
}

const defaultData: ContainerData = {
    containers: {},
    containerOrder: []
}

export async function readData(): Promise<ContainerData> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8')
        return JSON.parse(data) as ContainerData
    } catch {
        return { ...defaultData }
    }
}

export async function writeData(data: ContainerData) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}