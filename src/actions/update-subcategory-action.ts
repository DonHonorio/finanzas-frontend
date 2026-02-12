"use server"

import { getToken } from "../auth/token"
import { DraftSubcategorySchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function updateSubcategory(prevState: ActionStateType, formData: FormData) {  
  // Extrae datos editables de la subcategoría
  const subcategoryData = {
    name: formData.get('name'),
    description: formData.get('description'),
    budget: formData.get('budget'),
    color: formData.get('color'),
    isActive: formData.get('isActive') === 'true'
  }

  // Validación con Zod
  const subcategory = DraftSubcategorySchema.safeParse(subcategoryData)
  if (!subcategory.success) {
    return {
      errors: subcategory.error._zod.def.map(issue => issue.message),
      success: ''
    }
  }

  // Requiere ambos IDs por la relación jerárquica (como ya están validados por zod, se asume que son correctos)
  const categoryId = formData.get('categoryId')
  const subcategoryId = formData.get('subcategoryId')

  const token = await getToken()
  
  // Endpoint anidado: PUT /categories/{categoryId}/subcategories/{subcategoryId}
  const url = `${process.env.API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`
  const req = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(subcategory.data)
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