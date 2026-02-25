import "server-only"
import { redirect } from "next/navigation"
import { cache } from "react"
import { getSessionType } from "@/src/data-layer/session"
import { getUserAction as getBackendUser } from "@/src/actions/get-user-action"
import { UserSchema } from "@/src/schemas"
import { z } from "zod"

type User = z.infer<typeof UserSchema>

export type VerifySessionResult = {
    user: User | null
    isAuth: boolean
    sessionType: "backend" | "local"
    source: "backend" | "local"
}

// Verifica la sesión y redirige a / si no está autenticado
export const verifySession = cache(async (redirectOnFail: boolean = true): Promise<VerifySessionResult | null> => {
    try {
        // Primero se detecta el origen real de sesión para decidir si consultar backend o no.
        const sessionType = await getSessionType()

        if (sessionType === "none") {
            return redirectOnFail ? redirect('/') : null
        }

        if (sessionType === "local") {
            // En local no existe perfil backend; el user final se resuelve en cliente.
            return {
                user: null,
                isAuth: true,
                sessionType,
                source: "local"
            }
        }

        const user = await getBackendUser()

        if (!user) {
            return redirectOnFail ? redirect('/') : null
        }

        return {
            user,
            isAuth: true,
            sessionType,
            source: "backend"
        }
    } catch (error) {
        console.error('Error verificando sesión:', error)
        return redirectOnFail ? redirect('/') : null
    }
})
