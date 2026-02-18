"use server"

import { getToken } from "../auth/token"
import { ErrorResponseSchema, SuccessSchema, UpdateUserSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function updateUser(prevState: ActionStateType, formData: FormData) {
    // Extrae todos los campos editables del formulario
    const userData = {
        name: formData.get('name'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        baseCurrency: formData.get('baseCurrency'),
        timeZone: formData.get('timeZone'),
        avatar: formData.get('avatar') ? formData.get('avatar') : undefined, // Avatar es opcional, si no se proporciona se envía como undefined
    }
    console.log('Datos recibidos para actualización: ', userData)
    // Validación de datos con Zod
    const user = UpdateUserSchema.safeParse(userData)
    if (!user.success) {
        
        return {
            errors: user.error._zod.def.map(issue => issue.message),
            success: ''
        }
    }

    const token = await getToken()
    if (!token) {
        return {
            errors: ['No autenticado. Por favor, inicia sesión.'],
            success: ''
        }
    }

    // Endpoint PUT para actualizar perfil de usuario (el usuario se identifica por su JWT)
    const url = `${process.env.API_URL}/auth/update-account`
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user.data)
    })

    const json = await req.json()

    // Manejo de errores
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
