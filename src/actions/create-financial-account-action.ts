"use server"

import { getToken } from "../auth/token"
import { DraftAccountSchema } from "../schemas"
import { ActionStateType } from "../types/action-types"
import { getActionErrorMessage, getActionSuccessMessage } from "./account-action-utils"

export default async function createAccount(prevState: ActionStateType, formData: FormData) {
  // Construye payload del formulario con defaults requeridos por backend.
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

  // Valida y normaliza el payload antes de llamar a la API.
  const account = DraftAccountSchema.safeParse(accountData)
  if (!account.success) {
    return {
      errors: account.error._zod.def.map((issue) => issue.message),
      success: "",
    }
  }

  // Exige token backend para proteger endpoint de cuentas.
  const token = await getToken()
  if (!token) {
    return {
      errors: ["No autenticado. Por favor, inicia sesión."],
      success: "",
    }
  }

  // Ejecuta creación de cuenta en API externa.
  const req = await fetch(`${process.env.API_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(account.data),
  })

  // Parsea respuesta sin romper si el backend devuelve body vacío/no JSON.
  const json = await req.json().catch(() => ({}))

  // Homogeneiza mensaje de error para consumo directo desde la UI.
  if (!req.ok) {
    return {
      errors: [getActionErrorMessage(json, "No se pudo crear la cuenta.")],
      success: "",
    }
  }

  // Devuelve mensaje de éxito consumible por toasts y callbacks de recarga.
  return {
    errors: [],
    success: getActionSuccessMessage(json, "Cuenta creada exitosamente"),
  }
}
