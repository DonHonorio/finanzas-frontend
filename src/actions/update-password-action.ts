"use server"

import { getToken } from "../auth/token"
import { ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

/**
 * Server Action para actualizar la contraseña del usuario autenticado.
 * 
 * Flujo:
 * 1. Verifica que el usuario esté autenticado mediante JWT
 * 2. Extrae las contraseñas actual y nueva del formulario
 * 3. Realiza petición PUT al backend para actualizar la contraseña
 * 4. Devuelve éxito o errores para mostrar en el cliente
 */
export default async function updatePassword(prevState: ActionStateType, formData: FormData) {
    // Extraer contraseñas del formulario
    const passwordData = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
    }

    // Validación básica
    if (!passwordData.currentPassword || !passwordData.newPassword) {
        return {
            errors: ['Todos los campos son obligatorios'],
            success: ''
        }
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
        return {
            errors: ['La nueva contraseña debe ser diferente a la actual'],
            success: ''
        }
    }

    if (typeof passwordData.newPassword === 'string' && passwordData.newPassword.length < 6) {
        return {
            errors: ['La nueva contraseña debe tener al menos 6 caracteres'],
            success: ''
        }
    }

    // Obtener token JWT para autenticación
    const token = await getToken()
    if (!token) {
        return {
            errors: ['No autenticado. Por favor, inicia sesión.'],
            success: ''
        }
    }

    // Endpoint PUT para actualizar contraseña
    const url = `${process.env.API_URL}/auth/update-password`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
    })

    const json = await req.json()

    // Manejo de errores de la petición HTTP
    if (!req.ok) {
        const { error } = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ''
        }
    }

    // Respuesta exitosa
    const success = SuccessSchema.parse(json.message)
    return {
        errors: [],
        success
    }
}
