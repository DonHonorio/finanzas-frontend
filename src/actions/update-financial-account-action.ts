"use server"

import { getToken } from "../auth/token"
import { DraftAccountSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function updateAccount(prevState: ActionStateType, formData: FormData) {
  // Identifica la cuenta objetivo para actualización.
  const accountId = formData.get("accountId")

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  // Extrae datos editables y conserva defaults compatibles con el modelo de cuenta.
  const accountData = {
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance"),
    currency: formData.get("currency"),
    number: formData.get("number"),
    order: formData.get("order"),
    isActive: String(formData.get("isActive") ?? "true") === "true",
    bankId: formData.get("bankId") ?? "1",
  }

  // Valida/normaliza datos para no propagar payload inválido al backend.
  const account = DraftAccountSchema.safeParse(accountData)
  if (!account.success) {
    return {
      errors: account.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  // Requiere sesión backend autenticada.
  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  // Ejecuta actualización de cuenta existente.
  const req = await fetch(`${process.env.API_URL}/accounts/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(account.data),
  })

  // Parsea respuesta de forma defensiva ante body no JSON.
  const json = await req.json().catch(() => ({}))

  // Normaliza errores para feedback consistente en la interfaz.
  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo actualizar la cuenta.")],
      success: "",
    }
  }

  // Expone confirmación de éxito para toasts y cierre de modal.
  return {
    errors: [],
    success: getActionSuccessMessage(json, "Cuenta actualizada exitosamente"),
  }
}
