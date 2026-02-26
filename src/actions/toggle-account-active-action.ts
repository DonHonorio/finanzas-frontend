"use server"

import { getToken } from "../auth/token"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function toggleAccountActive(prevState: ActionStateType, formData: FormData) {
  const accountId = formData.get("accountId")
  const newStatusRaw = formData.get("newStatus")

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  if (newStatusRaw !== "true" && newStatusRaw !== "false") {
    return {
      errors: ["Estado inválido para activar o desactivar la cuenta."],
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

  const req = await fetch(`${process.env.API_URL}/accounts/${accountId}/enable`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      newStatus: newStatusRaw === "true",
    }),
  })

  const json = await req.json().catch(() => ({}))

  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo actualizar el estado de la cuenta.")],
      success: "",
    }
  }

  return {
    errors: [],
    success: getActionSuccessMessage(json, "Estado de la cuenta actualizado"),
  }
}
