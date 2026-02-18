"use server"

import { getToken } from "../auth/token"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ErrorResponseSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

/**
 * Server Action para eliminar permanentemente la cuenta del usuario autenticado.
 * 
 * Flujo:
 * 1. Verifica que el usuario esté autenticado mediante JWT
 * 2. Realiza petición DELETE al backend para eliminar el usuario
 * 3. Si es exitoso, elimina la cookie de sesión y redirige a la página de inicio
 * 4. Si hay error, devuelve el mensaje para mostrarlo en el cliente
 */
export default async function deleteUser(prevState: ActionStateType, formData: FormData) {
    // Obtener el token JWT de las cookies para autenticación
    const token = await getToken()
    if (!token) {
        return {
            errors: ['No autenticado. Por favor, inicia sesión.'],
            success: ''
        }
    }

    // Endpoint DELETE para eliminar usuario (el usuario se identifica por su JWT)
    const url = `${process.env.API_URL}/auth/delete-account`
    const req = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    const json = await req.json()

    // Manejo de errores de la petición HTTP
    if (!req.ok) {
        const { error } = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ""
        }
    }

    // Respuesta exitosa - eliminar cookie de sesión y redirigir
    // La cookie debe eliminarse antes de redirigir para evitar intentos de autenticación con token inválido
    const cookiesStore = await cookies()
    cookiesStore.delete('FINANZAS_TOKEN')

    // Redirigir a la página de inicio después de eliminar cuenta
    // redirect() lanza una excepción NEXT_REDIRECT que Next.js maneja internamente, por eso debe estar al final
    redirect('/')
}
