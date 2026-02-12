"use server"

import { getToken } from "../auth/token"
import { ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function deleteCategory(prevState: ActionStateType, formData: FormData) {
  // Extrae el ID de categoría del FormData enviado desde el cliente
  const categoryId = formData.get('categoryId')
  if (!categoryId) {
    return {
      errors: ["ID de categoría no proporcionado."],
      success: ""
    }
  }

  // Autenticación y petición DELETE a la API externa
  const token = await getToken()
  const url = `${process.env.API_URL}/categories/${categoryId}`
  const req = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  const json = await req.json()
  
  // Manejo de errores de la API
  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: ""
    }
  }

  // Respuesta exitosa
  const success = SuccessSchema.parse(json.message)
  return {
    errors: [],
    success
  }
}