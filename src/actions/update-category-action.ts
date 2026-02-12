"use server"

import { getToken } from "../auth/token"
import { DraftCategorySchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function updateCategory(prevState: ActionStateType, formData: FormData) {
  // Obtiene el ID de la categoría a actualizar
  const categoryId = formData.get('categoryId')

  // Extrae todos los campos editables del formulario
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

  // Validación de datos con Zod
  const category = DraftCategorySchema.safeParse(categoryData)
  if (!category.success) {
    return {
      errors: category.error._zod.def.map(issue => issue.message),
      success: ''
    }
  }

  const token = await getToken()

  // Endpoint PUT para actualizar categoría existente
  const url = `${process.env.API_URL}/categories/${categoryId}`
  const req = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(category.data)
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

  // Menaje de éxito
  const success = SuccessSchema.parse(json.message)
  return {
    errors: [],
    success
  }
}