import { KeyIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

export function AppRightSidebar() {
    return (
        <Sidebar side="right">
            <SidebarContent className="h-svh">
                <Tabs defaultValue="account" className="flex h-full">
                    <TabsList className="flex flex-row bg-muted min-w-[180px] rounded-none border-l mx-auto w-full">
                        <TabsTrigger value="account" className="justify-start">
                            <UserIcon className="mr-2 h-4 w-4" />
                            Criação
                        </TabsTrigger>
                        <TabsTrigger value="password" className="justify-start">
                            <KeyIcon className="mr-2 h-4 w-4" />
                            Biblioteca
                        </TabsTrigger>
                    </TabsList>

                    {/* Conteúdo ao lado da sidebar */}
                    <div className="flex-1 p-6 overflow-auto">
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>
                                        Make changes to your account here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue="Pedro Duarte" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue="@peduarte" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>
                                        Change your password here.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current">Current password</Label>
                                        <Input id="current" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new">New password</Label>
                                        <Input id="new" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Update password</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </SidebarContent>
        </Sidebar>
    )
}