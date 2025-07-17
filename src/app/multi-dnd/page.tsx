'use client'

import { MultiContainer } from "../components/drag-drop/MultiContainer"


export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-8">
            <h1 className="text-3xl font-bold">Gerenciar Processos</h1>
            <MultiContainer />
        </main>
    )
}