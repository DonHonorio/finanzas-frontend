'use server'

import { CreateAccountSchema } from "@/src/schemas"

// action para crear una cuenta de usuario nueva
export const createAccountAction = async (prevState: unknown, formData: FormData) => {
    const data = {
        email: formData.get('email'),
        name: formData.get('name'),
        fullName: formData.get('fullName'),
        password: formData.get('password'),
        baseCurrency: formData.get('baseCurrency'),
        timeZone: formData.get('timeZone'),
    }

    // Validar datos del formulario
    const validatedFields = CreateAccountSchema.safeParse(data)

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error de validación'
        }
    }

    try {
        const response = await fetch(`${process.env.API_URL}/auth/create-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedFields.data),
        })

        const result = await response.json()

        // Si la respuesta no es OK, devolver el error
        if (!response.ok) {
            return {
                success: false,
                message: result.error || 'Error al crear la cuenta'
            }
        }

        // Éxito: devolver mensaje y userId
        return {
            success: true,
            message: result.message || 'Cuenta creada exitosamente',
            userId: result.userId
        }
    } catch (error) {
        console.error('Error al crear cuenta:', error)
        return {
            success: false,
            message: 'Error de conexión con el servidor'
        }
    }
}
