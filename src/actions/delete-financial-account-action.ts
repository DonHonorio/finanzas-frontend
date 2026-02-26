"use server"

import { getToken } from "../auth/token"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function deleteAccount(prevState: ActionStateType, formData: FormData) {
  const accountId = formData.get("accountId")

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  const req = await fetch(`${process.env.API_URL}/accounts/${accountId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const json = await req.json().catch(() => ({}))

  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo eliminar la cuenta.")],
      success: "",
    }
  }

  return {
    errors: [],
    success: getActionSuccessMessage(json, "Cuenta eliminada exitosamente"),
  }
}
