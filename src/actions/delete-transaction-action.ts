"use server"

import { getToken } from "../auth/token"
import { ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function deleteTransaction(prevState: ActionStateType, formData: FormData) {
  // Requiere ambos IDs por la relación jerárquica: transacción pertenece a categoría
  const transactionId = formData.get("transactionId")
  const categoryId = formData.get("categoryId")

  if (!transactionId || !categoryId) {
    return {
      errors: ["ID de transacción o categoría no proporcionado."],
      success: "",
    }
  }

  const token = await getToken()

  // Endpoint anidado: DELETE /categories/{categoryId}/transactions/{transactionId}
  const url = `${process.env.API_URL}/categories/${categoryId}/transactions/${transactionId}`
  const req = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await req.json()

  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: "",
    }
  }

  const success = SuccessSchema.parse(json.message)
  return {
    errors: [],
    success,
  }
}