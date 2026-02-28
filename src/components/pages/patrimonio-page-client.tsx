'use client'

import { TrendingUp } from "lucide-react"
import { z } from 'zod'
import { Header } from "@/src/components/menu-principal/header"
import ToastNotification from "@/src/components/ui/ToastNotification"
import { UserSchema } from '@/src/schemas'
import { useResolvedSessionUser } from "@/src/hooks/use-resolved-session-user"
import { useTranslations } from "next-intl"

type User = z.infer<typeof UserSchema>

interface PatrimonioPageClientProps {
    user?: User | null
    source?: "backend" | "local" | "none"
}

// Pantalla placeholder de Patrimonio: conserva la estructura común y un estado visual temporal.
export function PatrimonioPageClient({ user, source }: PatrimonioPageClientProps) {
    const t = useTranslations("PlaceholderPages")
    const resolvedUser = useResolvedSessionUser(user, source)

    return (
        <div className="h-[100dvh] overflow-hidden flex flex-col bg-gray-50">
            {/* Header */}
            <Header user={resolvedUser} source={source} />

            {/* Contenido Principal */}
            <main className="flex-1 min-h-0 p-3 sm:p-10 overflow-hidden">
                <div className="h-full min-h-0 flex flex-col items-center justify-center sm:items-stretch sm:justify-start">
                    {/* Área de contenido */}
                    <div className="w-full aspect-square max-h-full sm:max-h-none sm:aspect-auto sm:flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">{t("netWorthTitle")}</h1>
                        <p className="text-gray-500">{t("comingSoon")}</p>
                    </div>
                </div>
            </main>
            <ToastNotification />
        </div>
    )
}
