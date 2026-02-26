"use server"

import { getToken } from "../auth/token"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function deleteAccount(prevState: ActionStateType, formData: FormData) {
  // Identifica la cuenta que se eliminará.
  const accountId = formData.get("accountId")

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  // Requiere sesión backend válida para operación destructiva.
  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  // Solicita eliminación física de la cuenta en API externa.
  const req = await fetch(`${process.env.API_URL}/accounts/${accountId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  // Parsea respuesta de forma tolerante para evitar throw por body inesperado.
  const json = await req.json().catch(() => ({}))

  // Unifica errores backend en un formato apto para UI.
  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo eliminar la cuenta.")],
      success: "",
    }
  }

  // Retorna mensaje de éxito estándar para notificación y revalidación.
  return {
    errors: [],
    success: getActionSuccessMessage(json, "Cuenta eliminada exitosamente"),
  }
}
