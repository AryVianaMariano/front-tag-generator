import { promises as fs } from 'fs'
import path from 'path'

const MINI_DB_PATH = path.join(process.cwd(), 'mini-db.json')

export interface MiniData {
    miniContainers: Record<string, string[]>
}

const defaultMiniData: MiniData = {
    miniContainers: {},
}

export async function readMiniData(): Promise<MiniData> {
    try {
        const data = await fs.readFile(MINI_DB_PATH, 'utf-8')
        return JSON.parse(data) as MiniData
    } catch {
        return { ...defaultMiniData }
    }
}

export async function writeMiniData(data: MiniData) {
    await fs.writeFile(MINI_DB_PATH, JSON.stringify(data, null, 2))
}