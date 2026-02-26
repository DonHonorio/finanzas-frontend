"use server"

import { getToken } from "../auth/token"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function toggleAccountActive(prevState: ActionStateType, formData: FormData) {
  // Recibe cuenta objetivo y estado final explícito desde la UI.
  const accountId = formData.get("accountId")
  const newStatusRaw = formData.get("newStatus")

  if (!accountId) {
    return {
      errors: ["ID de cuenta no proporcionado."],
      success: "",
    }
  }

  // Valida que el estado entrante sea boolean serializado.
  if (newStatusRaw !== "true" && newStatusRaw !== "false") {
    return {
      errors: ["Estado inválido para activar o desactivar la cuenta."],
      success: "",
    }
  }

  // Exige sesión autenticada antes de mutar estado de cuenta.
  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  // Llama al endpoint de habilitar/deshabilitar del backend.
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

  // Soporta respuestas sin JSON para no romper el flujo de toggle.
  const json = await req.json().catch(() => ({}))

  // Devuelve error normalizado consumible por toast en cliente.
  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo actualizar el estado de la cuenta.")],
      success: "",
    }
  }

  // Entrega mensaje de éxito para confirmar cambio de estado en UI.
  return {
    errors: [],
    success: getActionSuccessMessage(json, "Estado de la cuenta actualizado"),
  }
}
