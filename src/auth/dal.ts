import "server-only"
import { redirect } from "next/navigation"
import { UserSchema } from "../schemas"
import { cache } from "react"
import { getToken } from "./token"

// Verifica la sesión y redirige a / si no está autenticado
export const verifySession = cache(async (redirectOnFail: boolean = true) => {
    const token = await getToken()
    
    !token && redirectOnFail ? redirect('/') : null

    const url = `${process.env.API_URL}/auth/user`
    
    try {
        const req = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        })

        if (!req.ok) {
            if (redirectOnFail) {
                redirect('/')
            }

            return null
        }

        const session = await req.json()
        const result = UserSchema.safeParse(session)

        !result.success && redirectOnFail ? redirect('/') : null

        return {
            user: result.data,
            isAuth: true
        }
    } catch (error) {
        console.error('Error verificando sesión:', error)
        redirectOnFail ? redirect('/') : null
    }
})
