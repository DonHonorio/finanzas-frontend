"use server"

import { getToken } from "../auth/token"
import { DraftSubcategorySchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function createSubcategory(prevState: ActionStateType, formData: FormData) {

    const subcategoryData = {
        name: formData.get('name'),
        description: formData.get('description'),
        budget: formData.get('budget'),
        color: formData.get('color'),
        isActive: formData.get('isActive') === 'true'
    }
    console.log('subcategoryData: ', subcategoryData)

    const subcategory = DraftSubcategorySchema.safeParse(subcategoryData)
    if (!subcategory.success) {
        return {
            errors: subcategory.error._zod.def.map(issue => issue.message),
            success: ''
        }
    }

    const categoryId = formData.get('categoryId')

    // Crear subcategoría en la base de datos
    const token = await getToken()
    const url = `${process.env.API_URL}/categories/${categoryId}/subcategories`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subcategory.data)
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
        success: success
    }
}
