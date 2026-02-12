"use server"

import { getToken } from "../auth/token"
import { ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function deleteSubcategory(prevState: ActionStateType, formData: FormData) {
  // Requiere AMBOS IDs porque la subcategoría pertenece a una categoría padre
  const subcategoryId = formData.get("subcategoryId")
  const categoryId = formData.get("categoryId")

  if (!subcategoryId || !categoryId) {
    return {
      errors: ["ID de subcategoría o categoría no proporcionado."],
      success: "",
    }
  }

  const token = await getToken()
  
  // Endpoint anidado: DELETE /categories/{categoryId}/subcategories/{subcategoryId}
  const url = `${process.env.API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`
  const req = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await req.json()
  
  // Manejo de errores
  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: "",
    }
  }

  // Mensaje de éxito
  const success = SuccessSchema.parse(json.message)
  return {
    errors: [],
    success,
  }
}