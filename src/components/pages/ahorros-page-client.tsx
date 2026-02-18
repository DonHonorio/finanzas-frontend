'use client'

import { PiggyBank } from "lucide-react"
import { z } from 'zod'
import { Header } from "@/src/components/menu-principal/header"
import { BackButton } from "@/src/components/ui/back-button"
import ToastNotification from "@/src/components/ui/ToastNotification"
import { UserSchema } from '@/src/schemas'

type User = z.infer<typeof UserSchema>

interface AhorrosPageClientProps {
    user?: User | null
}

// Pantalla placeholder de Ahorros: mantiene layout estándar y muestra contenido temporal.
export function AhorrosPageClient({ user }: AhorrosPageClientProps) {
    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Header user={user} />

            {/* Contenido Principal */}
            <main className="flex-1 p-10">
                <div className="h-full flex flex-col">
                    {/* Área de contenido */}
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <PiggyBank className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Ahorros</h1>
                        <p className="text-gray-500">Próximamente...</p>
                    </div>
                </div>
            </main>
            <ToastNotification />
        </div>
    )
}
