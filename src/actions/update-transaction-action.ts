"use server"

import { getToken } from "../auth/token"
import { DraftTransactionSchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function updateTransaction(prevState: ActionStateType, formData: FormData) {
  // Obtiene el ID de la transacción a actualizar
  const transactionId = formData.get("transactionId")
  
  // Extrae todos los campos editables de la transacción
  const transactionData = {
    name: formData.get("name"),
    type: formData.get("type"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    description: formData.get("description"),
    accountId: formData.get("account"),
    categoryId: formData.get("category"),
    subcategoryId: formData.get("subcategory") || null, // Opcional
  }

  // Validación con Zod
  const transaction = DraftTransactionSchema.safeParse(transactionData)
  if (!transaction.success) {
    return {
      errors: transaction.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  const token = await getToken()
  
  // Usa previousCategoryId para la URL porque la transacción PUEDE cambiar de categoría
  // Si usáramos transactionData.categoryId y está cambiando, la URL sería inválida
  const previousCategoryId = formData.get("previousCategoryId")
  const url = `${process.env.API_URL}/categories/${previousCategoryId}/transactions/${transactionId}`
  const req = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...transaction.data
    }),
  })

  const json = await req.json()
  
  // Manejo de errores de la API
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