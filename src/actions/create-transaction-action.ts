"use server"

import { getToken } from "../auth/token"
import { DraftTransactionSchema, ErrorResponseSchema, SuccessSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"

export default async function createTransaction(prevState: ActionStateType, formData: FormData) {
  
  // Extrae valores del FormData para validación con Zod
  const transactionData = {
    name: formData.get("name"),
    date: formData.get("date"),
    amount: formData.get("amount"),
    description: formData.get("description"),
    type: formData.get("type"),
    currency: formData.get("currency"),
    accountId: formData.get("account"),
    categoryId: formData.get("category"),
    subcategoryId: formData.get("subcategory") || null,
  }
  console.log('DATA: ', transactionData)

  // Validación del lado del servidor con Zod
  const transaction = DraftTransactionSchema.safeParse(transactionData)
  if (!transaction.success) {
    return {
      errors: transaction.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  // Autenticación con token JWT
  const token = await getToken()
  if (!token) {
    return {
      errors: ['No autenticado. Por favor, inicia sesión.'],
      success: ''
    }
  }
  
  const categoryId = formData.get("category")
  
  // Endpoint específico: POST a /categories/{id}/transactions
  const url = `${process.env.API_URL}/categories/${categoryId}/transactions`
  const req = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...transaction.data
    }),
  })

  const json = await req.json()
  
  // Manejo de errores de la API externa
  if (!req.ok) {
    const { error } = ErrorResponseSchema.parse(json)
    return {
      errors: [error],
      success: "",
    }
  }

  // Respuesta exitosa
  const success = SuccessSchema.parse(json.message)
  return {
    errors: [],
    success,
  }
}