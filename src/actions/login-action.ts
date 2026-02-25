'use server'

import { LoginSchema } from "@/src/schemas"
import { setToken } from "@/src/auth/token"
import { cookies } from "next/headers"

// action para iniciar sesión
export const loginAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    // Validar datos del formulario
    const validatedFields = LoginSchema.safeParse(data)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error de validación'
        }
    }

    // Flag opcional para flujos transaccionales (signup+migración) donde no se debe limpiar local aún.
    const preserveLocalSession = String(formData.get('preserveLocalSession') ?? 'false') === 'true'

    try {
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedFields.data),
        })

        const result = await response.json()

        // devuelve error
        if (!response.ok) {
            return {
                success: false,
                message: result.error || 'Error al iniciar sesión'
            }
        }

        // Guardar el token en una cookie
        await setToken(result.token)
        // En login normal, al entrar en backend se eliminan marcadores de sesión local.
        if (!preserveLocalSession) {
            const cookieStore = await cookies()
            cookieStore.delete('localToken')
            cookieStore.delete('localBaseCurrency')
            cookieStore.delete('localTimeZone')
        }

        return {
            success: true,
            message: result.message || 'Inicio de sesión exitoso'
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return {
            success: false,
            message: 'Error de conexión con el servidor'
        }
    }
}
