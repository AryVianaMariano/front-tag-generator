'use client'

import { useState } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AppRightSidebar() {
    const [items, setItems] = useState<string[]>([])
    const [newItem, setNewItem] = useState('')

    const addItem = () => {
        if (!newItem.trim()) return
        setItems((prev) => [...prev, newItem.trim()])
        setNewItem('')
    }

    return (
        <Sidebar side="right" variant="sidebar" collapsible="icon">
            <SidebarContent>

                {/* Formulário no topo */}
                <SidebarGroup>
                    <SidebarGroupLabel>Adicionar Item</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                addItem()
                            }}
                            className="flex flex-col gap-2"
                        >
                            <Input
                                placeholder="Novo item"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                            />
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Criar
                            </Button>
                        </form>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Lista de itens criados */}
                <SidebarGroup>
                    <SidebarGroupLabel>Itens Criados</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <span>{item}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}
