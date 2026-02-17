"use server"

import { getToken } from "../auth/token"
import { DraftCategorySchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function createCategory(prevState: ActionStateType, formData: FormData) {

    const categoryData = {
        name: formData.get('name'),
        budget: formData.get('budget'),
        frequency: formData.get('frequency'),
        dtstart: formData.get('dtstart'),
        type: formData.get('type'),
        icon: formData.get('icon'),
        color: formData.get('color'),
        isActive: formData.get('isActive') === 'true',
        withSubcategory: formData.get('withSubcategory') === 'true',
    }

    const category = DraftCategorySchema.safeParse(categoryData)
    if (!category.success) {
        return {
            errors: category.error._zod.def.map(issue => issue.message),
            success: ''
        }
    }

    // Generar categoría en la base de datos
    const token = await getToken()
    if (!token) {
        return {
            errors: ['No autenticado. Por favor, inicia sesión.'],
            success: ''
        }
    }

    const url = `${process.env.API_URL}/categories`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category.data)
    })

    const json = await req.json()
    if (!req.ok) {
        const { error } = ErrorResponseSchema.parse(json)
        return {
            errors: [error],
            success: ''
        }
    }

    const success = SuccessSchema.parse(json.message)
    return {
        errors: [],
        success
    }
}